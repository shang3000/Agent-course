"""答案版：有白名单、参数校验和结构化错误的工具执行器。"""

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
    """仅执行白名单工具，并把失败转换为稳定 Observation。"""
    spec = TOOLS.get(tool_name)
    if spec is None:
        return {"ok": False, "tool": tool_name, "error": "unknown_tool"}
    if not isinstance(arguments, dict):
        return {"ok": False, "tool": tool_name, "error": "arguments_must_be_object"}

    missing = [name for name in spec.parameters if name not in arguments]
    if missing:
        return {"ok": False, "tool": tool_name, "error": "missing_arguments", "details": missing}

    unexpected = [name for name in arguments if name not in spec.parameters]
    if unexpected:
        return {"ok": False, "tool": tool_name, "error": "unexpected_arguments", "details": unexpected}

    for name, expected_type in spec.parameters.items():
        if not isinstance(arguments[name], expected_type):
            return {
                "ok": False,
                "tool": tool_name,
                "error": "invalid_argument_type",
                "details": {"argument": name, "expected": expected_type.__name__},
            }

    try:
        return {"ok": True, "tool": tool_name, "data": spec.function(**arguments)}
    except Exception as exc:  # 工具边界必须把异常转换为 Observation
        return {"ok": False, "tool": tool_name, "error": "tool_execution_failed", "details": type(exc).__name__}


if __name__ == "__main__":
    print(execute_tool("get_weather", {"city": "大连"}))
