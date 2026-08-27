"""任务版：使用真实 smolagents ToolCallingAgent 完成天气任务。"""

from smolagents import (
    ChatMessage,
    Model,
    ToolCallingAgent,
    tool,
)


# TODO 1: 使用 @tool 定义 get_weather(city: str) -> str。
# 文档字符串必须包含 Args 中的 city 说明。


class LocalTeachingModel(Model):
    """确定性教学模型；只替代 LLM，不替代 smolagents 框架。"""

    def generate(
        self,
        messages: list[ChatMessage],
        stop_sequences: list[str] | None = None,
        response_format: dict[str, str] | None = None,
        tools_to_call_from=None,
        **kwargs,
    ) -> ChatMessage:
        # TODO 2: 第一次生成 get_weather 调用；收到工具结果后生成 final_answer 调用。
        raise NotImplementedError("请完成本地教学模型的两轮决策")


def run_demo() -> str:
    """创建并运行 ToolCallingAgent。"""
    # TODO 3: 创建 ToolCallingAgent 并运行“查询大连天气并决定是否带伞”。
    raise NotImplementedError("请创建并运行 ToolCallingAgent")
