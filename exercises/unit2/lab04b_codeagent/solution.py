"""答案版：真实 CodeAgent + 确定性无 Token 模型。"""

from smolagents import ChatMessage, CodeAgent, Model, tool
from smolagents.models import MessageRole


@tool
def get_weather(city: str) -> str:
    """返回指定城市的教学模拟天气。

    Args:
        city: 城市名称。
    """
    return f"{city}：18℃，有雨（教学模拟数据）"


class LocalCodeModel(Model):
    def __init__(self) -> None:
        super().__init__(model_id="local-code-teaching-model")

    def generate(self, messages, stop_sequences=None, response_format=None, tools_to_call_from=None, **kwargs):
        del messages, stop_sequences, response_format, tools_to_call_from, kwargs
        return ChatMessage(
            role=MessageRole.ASSISTANT,
            content='Thought: 调用已授权的天气工具后结束。\n```py\nweather = get_weather(city="大连")\nfinal_answer(f"建议带伞；{weather}")\n```',
        )


def run_demo() -> str:
    agent = CodeAgent(
        tools=[get_weather], model=LocalCodeModel(), max_steps=2,
        additional_authorized_imports=[], verbosity_level=0,
    )
    return str(agent.run("查询大连天气并决定是否带伞。"))


if __name__ == "__main__":
    print(run_demo())
