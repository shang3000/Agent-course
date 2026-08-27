"""可选在线版：使用 Hugging Face 推理服务和真实 LLM。"""

import os

from dotenv import load_dotenv
from smolagents import InferenceClientModel, ToolCallingAgent, tool


@tool
def get_weather(city: str) -> str:
    """返回指定城市的教学模拟天气。

    Args:
        city: 要查询的城市名称，例如“大连”。
    """
    return f"{city}：18℃，有雨（教学模拟数据）"


def main() -> None:
    load_dotenv()
    token = os.getenv("HF_TOKEN")
    if not token:
        raise SystemExit("缺少 HF_TOKEN。请复制 .env.example 为 .env 后填写，不要把密钥写进代码。")

    model = InferenceClientModel(
        model_id="Qwen/Qwen2.5-Coder-32B-Instruct",
        token=token,
    )
    agent = ToolCallingAgent(
        tools=[get_weather],
        model=model,
        max_steps=4,
        verbosity_level=1,
    )
    print(agent.run("查询大连天气，并告诉我今天是否需要带伞。"))


if __name__ == "__main__":
    main()
