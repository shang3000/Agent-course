"""不安装框架也能理解的三种核心抽象。"""

from typing import TypedDict


def smolagents_view(task: str, tools: list[str]) -> dict:
    return {"task": task, "available_tools": tools, "action_format": "code"}


def llamaindex_view(documents: list[str], query: str) -> dict:
    matches = [doc for doc in documents if any(word in doc for word in query.split())]
    return {"query": query, "retrieved_nodes": matches}


class GraphState(TypedDict):
    email: str
    is_spam: bool | None


def langgraph_node(state: GraphState) -> GraphState:
    return {**state, "is_spam": "中奖" in state["email"]}


if __name__ == "__main__":
    print(smolagents_view("查天气", ["search", "weather"]))
    print(llamaindex_view(["大连今天小雨", "北京今天晴"], "大连 小雨"))
    print(langgraph_node({"email": "恭喜中奖", "is_spam": None}))
