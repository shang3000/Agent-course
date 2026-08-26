"""纯 Python 演示：工具 schema、执行器与 ReAct 循环。"""

from dataclasses import dataclass
from typing import Callable


def get_weather(city: str) -> dict:
    """获取城市天气（教学模拟）。"""
    return {"city": city, "temperature": 18, "rain": True}


TOOLS: dict[str, Callable] = {"get_weather": get_weather}


@dataclass
class Action:
    tool: str
    arguments: dict


def execute(action: Action):
    if action.tool not in TOOLS:
        raise ValueError(f"未知工具：{action.tool}")
    return TOOLS[action.tool](**action.arguments)


def run_demo() -> str:
    print("THOUGHT 需要大连实时天气")
    action = Action("get_weather", {"city": "大连"})
    print("ACTION ", action)
    observation = execute(action)
    print("OBSERVE", observation)
    answer = "建议带伞" if observation["rain"] else "不用带伞"
    print("FINAL  ", answer)
    return answer


if __name__ == "__main__":
    run_demo()
