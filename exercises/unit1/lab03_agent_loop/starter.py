"""任务版：完成一个可测试的离线 Agent 循环。"""

from collections.abc import Callable
from dataclasses import dataclass


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
    """执行 Thought/Action/Observation 循环。"""
    # TODO: 按 README 的五个步骤完成循环。
    raise NotImplementedError("请完成 Agent 循环")
