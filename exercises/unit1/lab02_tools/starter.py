"""任务版：实现有 schema 校验的工具执行器。"""

from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class ToolSpec:
    name: str
    description: str
    parameters: dict[str, type]
    function: Callable[..., object]


def get_weather(city: str) -> dict[str, object]:
    """教学模拟工具，不调用实时天气 API。"""
    return {"city": city, "temperature": 18, "rain": True}


TOOLS = {
    "get_weather": ToolSpec(
        name="get_weather",
        description="查询指定城市的教学模拟天气。",
        parameters={"city": str},
        function=get_weather,
    )
}


def execute_tool(tool_name: str, arguments: dict[str, object]) -> dict[str, object]:
    """验证并执行工具，返回包含 ok 的结构化结果。"""
    # TODO: 按 README 的五个步骤完成执行器。
    raise NotImplementedError("请完成工具执行器")
