"""渐进式主项目：可解释、带来源和失败回退的离线 Agentic RAG。"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Evidence:
    source: str
    text: str


DOCS = [Evidence("agent.md", "Agent 使用模型决策，使用工具行动。"), Evidence("rag.md", "RAG 使用检索到的证据约束回答。"), Evidence("graph.md", "LangGraph 使用状态图编排循环。")]


def retrieve(query: str) -> list[Evidence]:
    terms = {term.lower() for term in query.replace("？", "").split() if len(term) > 1}
    return [doc for doc in DOCS if any(term in doc.text.lower() or term in doc.source for term in terms)]


def run_agent(query: str) -> dict[str, object]:
    if not query.strip():
        return {"status": "invalid_input", "answer": "问题不能为空。", "sources": [], "trace": ["validate_failed"]}
    trace = ["validate", "route:retrieval", "retrieve"]
    evidence = retrieve(query)
    if not evidence:
        return {"status": "no_evidence", "answer": "本地资料没有找到足够证据，因此不编造答案。", "sources": [], "trace": [*trace, "fallback"]}
    return {"status": "completed", "answer": "；".join(item.text for item in evidence), "sources": [item.source for item in evidence], "trace": [*trace, "answer_with_citations"]}
