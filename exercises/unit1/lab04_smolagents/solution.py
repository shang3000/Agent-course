"""答案版：真实 smolagents 编排 + 无 Token 的确定性教学模型。"""

from typing import Any

from smolagents import ChatMessage, Model, ToolCallingAgent, tool
from smolagents.models import (
    ChatMessageToolCall,
    ChatMessageToolCallFunction,
    MessageRole,
)


EVENTS: list[dict[str, Any]] = []


@tool
def get_weather(city: str) -> str:
    """返回指定城市的教学模拟天气。

    Args:
        city: 要查询的城市名称，例如“大连”。
    """
    EVENTS.append({"event": "tool_executed", "tool": "get_weather", "city": city})
    return f"{city}：18℃，有雨（教学模拟数据）"


class LocalTeachingModel(Model):
    """按真实框架消息格式产生工具调用，但不进行语言模型推理。"""

    def __init__(self) -> None:
        super().__init__(model_id="local-deterministic-teaching-model")
        self.generation_count = 0

    def generate(
        self,
        messages: list[ChatMessage],
        stop_sequences: list[str] | None = None,
        response_format: dict[str, str] | None = None,
        tools_to_call_from=None,
        **kwargs,
    ) -> ChatMessage:
        del stop_sequences, response_format, tools_to_call_from, kwargs
        self.generation_count += 1
        received_observation = any(message.role == MessageRole.TOOL_RESPONSE for message in messages)

        if not received_observation:
            EVENTS.append({"event": "model_decision", "decision": "get_weather"})
            return ChatMessage(
                role=MessageRole.ASSISTANT,
                content="先查询天气，再根据 Observation 回答。",
                tool_calls=[
                    ChatMessageToolCall(
                        function=ChatMessageToolCallFunction(
                            name="get_weather",
                            arguments={"city": "大连"},
                        ),
                        id="weather-call-1",
                        type="function",
                    )
                ],
            )

        EVENTS.append({"event": "model_decision", "decision": "final_answer"})
        return ChatMessage(
            role=MessageRole.ASSISTANT,
            content="已读取天气工具返回的 Observation。",
            tool_calls=[
                ChatMessageToolCall(
                    function=ChatMessageToolCallFunction(
                        name="final_answer",
                        arguments={
                            "answer": "建议带伞；smolagents 已执行 get_weather，并观察到大连 18℃、有雨。"
                        },
                    ),
                    id="final-answer-1",
                    type="function",
                )
            ],
        )


def run_demo() -> tuple[str, LocalTeachingModel, list[dict[str, Any]]]:
    """运行一次真实 ToolCallingAgent 循环并返回可检查证据。"""
    EVENTS.clear()
    model = LocalTeachingModel()
    agent = ToolCallingAgent(
        tools=[get_weather],
        model=model,
        max_steps=3,
        verbosity_level=0,
    )
    answer = agent.run("查询大连天气，并告诉我今天是否需要带伞。")
    return str(answer), model, EVENTS.copy()


if __name__ == "__main__":
    final_answer, teaching_model, events = run_demo()
    print(final_answer)
    print(f"模型生成轮数：{teaching_model.generation_count}")
    print("事件记录：")
    for event in events:
        print(f"- {event}")
