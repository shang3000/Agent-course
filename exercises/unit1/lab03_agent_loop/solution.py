"""答案版：可注入模型和执行器的最小 Agent 循环。"""

from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
import sys

try:
    from exercises.unit1.lab02_tools.solution import execute_tool
except ModuleNotFoundError:  # 支持在 PyCharm 中直接运行当前文件
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
    from exercises.unit1.lab02_tools.solution import execute_tool


@dataclass(frozen=True)
class Decision:
    kind: str
    tool: str | None = None
    arguments: dict[str, object] | None = None
    answer: str | None = None


@dataclass(frozen=True)
class AgentResult:
    status: str
    answer: str
    messages: list[dict[str, object]]


def run_agent(
    question: str,
    decide: Callable[[list[dict[str, object]]], Decision],
    execute: Callable[[str, dict[str, object]], dict[str, object]],
    *,
    max_steps: int = 4,
) -> AgentResult:
    """执行决策；工具结果只能由 execute 产生并写为 Observation。"""
    if max_steps < 1:
        raise ValueError("max_steps 必须大于 0")
    messages: list[dict[str, object]] = [{"role": "user", "content": question}]

    for _ in range(max_steps):
        decision = decide(messages.copy())
        if decision.kind == "final":
            if not decision.answer:
                return AgentResult("invalid_decision", "模型返回了空答案。", messages)
            messages.append({"role": "assistant", "type": "final", "content": decision.answer})
            return AgentResult("completed", decision.answer, messages)

        if decision.kind != "tool" or not decision.tool or decision.arguments is None:
            return AgentResult("invalid_decision", "模型返回了无法解析的行动。", messages)

        messages.append({
            "role": "assistant",
            "type": "action",
            "tool": decision.tool,
            "arguments": decision.arguments,
        })
        observation = execute(decision.tool, decision.arguments)
        messages.append({"role": "tool", "type": "observation", "content": observation})

    return AgentResult("max_steps_exceeded", "达到最大步数，Agent 已停止。", messages)


class WeatherDemoModel:
    """确定性策略，代替 LLM 以便离线观察和测试循环。"""

    def __call__(self, messages: list[dict[str, object]]) -> Decision:
        observations = [message for message in messages if message.get("type") == "observation"]
        if not observations:
            return Decision("tool", tool="get_weather", arguments={"city": "大连"})

        result = observations[-1]["content"]
        if not isinstance(result, dict) or not result.get("ok"):
            return Decision("final", answer=f"天气工具失败，无法可靠回答：{result}")
        data = result["data"]
        recommendation = "建议带伞" if data["rain"] else "不用带伞"
        return Decision(
            "final",
            answer=f"{recommendation}；依据：{data['city']}教学模拟天气为 {data['temperature']}℃。",
        )


if __name__ == "__main__":
    outcome = run_agent("今天出门需要带伞吗？", WeatherDemoModel(), execute_tool)
    for item in outcome.messages:
        print(item)
    print(outcome.answer)
