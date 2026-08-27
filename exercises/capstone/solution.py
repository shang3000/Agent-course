"""答案版：8 阶段可解释、无 Token 也可运行的 Agent 主项目。"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from time import perf_counter
from typing import Callable

from exercises.unit3.agentic_rag_project import retrieve


@dataclass
class Span:
    name: str
    duration_ms: float
    status: str = "ok"


@dataclass
class State:
    question: str
    stage: int
    route: str = ""
    plan: list[str] = field(default_factory=list)
    observations: list[str] = field(default_factory=list)
    sources: list[str] = field(default_factory=list)
    answer: str = ""
    trace: list[str] = field(default_factory=list)
    spans: list[Span] = field(default_factory=list)
    failure_type: str | None = None


def offline_model(prompt: str) -> str:
    """教学用确定性模型；真实模型只需实现相同的 str -> str 接口。"""
    return f"根据已获得的证据：{prompt}"


def _record(state: State, name: str, operation: Callable[[], None]) -> None:
    started = perf_counter()
    status = "ok"
    try:
        operation()
    except Exception:
        status = "error"
        state.failure_type = "tool_or_node_failure"
        raise
    finally:
        state.trace.append(name)
        state.spans.append(Span(name, round((perf_counter() - started) * 1000, 3), status))


def _route(state: State) -> None:
    state.route = "retrieval" if any(word in state.question.lower() for word in ("agent", "rag", "langgraph", "工具", "检索")) else "direct"


def _plan(state: State) -> None:
    state.plan = ["理解问题", "选择工具"]
    if state.stage >= 4 and state.route == "retrieval":
        state.plan.extend(["检索证据", "核对来源"])
    state.plan.append("组织答案")


def _research(state: State) -> None:
    evidence = retrieve(state.question)
    state.observations.extend(item.text for item in evidence)
    state.sources.extend(item.source for item in evidence)


def _write(state: State, model: Callable[[str], str]) -> None:
    if state.route == "retrieval" and not state.observations:
        state.failure_type = "retrieval_no_evidence"
        state.answer = "本地资料没有找到足够证据，因此不编造答案。"
        return
    context = "；".join(state.observations) or state.question
    state.answer = model(context)


def run_capstone(question: str, stage: int = 8, model: Callable[[str], str] | None = None) -> dict[str, object]:
    """使用同一份 State 逐级开启能力，避免每单元重写一个演示。"""
    if stage not in range(1, 9):
        raise ValueError("stage 必须为 1..8")
    state = State(question=question.strip(), stage=stage)
    if not state.question:
        state.failure_type = "invalid_input"
        state.answer = "问题不能为空。"
        return _result(state)

    chosen_model = model or offline_model
    _record(state, "planner", lambda: _plan(state))
    if stage >= 2:
        _record(state, "router", lambda: _route(state))
    else:
        state.route = "direct"
    if stage >= 4 and state.route == "retrieval":
        _record(state, "researcher", lambda: _research(state))
    _record(state, "writer", lambda: _write(state, chosen_model))
    return _result(state)


def _result(state: State) -> dict[str, object]:
    return {
        "status": "failed" if state.failure_type else "completed",
        "stage": state.stage,
        "route": state.route,
        "plan": state.plan,
        "answer": state.answer,
        "sources": state.sources,
        "trace": state.trace,
        "spans": [asdict(span) for span in state.spans],
        "failure_type": state.failure_type,
    }


if __name__ == "__main__":
    from pprint import pprint
    pprint(run_capstone("Agent 如何使用工具？"))
