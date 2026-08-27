"""答案版：无 Token 的真实 LangGraph 条件工作流。"""

from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class AgentState(TypedDict):
    question: str
    route: str
    observation: str
    answer: str
    trace: list[str]


def classify(state: AgentState) -> dict:
    route = "weather" if any(word in state["question"] for word in ("天气", "雨", "伞")) else "direct"
    return {"route": route, "trace": [*state.get("trace", []), "classify"]}


def weather_tool(state: AgentState) -> dict:
    return {"observation": "大连 18℃，有雨（教学模拟）", "trace": [*state["trace"], "weather_tool"]}


def answer(state: AgentState) -> dict:
    text = f"根据工具结果：{state['observation']}，建议带伞。" if state["route"] == "weather" else f"普通问题：{state['question']}"
    return {"answer": text, "trace": [*state["trace"], "answer"]}


def route(state: AgentState) -> str:
    return state["route"]


def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("classify", classify)
    graph.add_node("weather_tool", weather_tool)
    graph.add_node("answer", answer)
    graph.add_edge(START, "classify")
    graph.add_conditional_edges("classify", route, {"weather": "weather_tool", "direct": "answer"})
    graph.add_edge("weather_tool", "answer")
    graph.add_edge("answer", END)
    return graph.compile()


if __name__ == "__main__":
    initial: AgentState = {"question": "今天要带伞吗？", "route": "", "observation": "", "answer": "", "trace": []}
    print(build_graph().invoke(initial))
