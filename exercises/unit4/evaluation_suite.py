"""离线评估：正确率、来源要求和失败类型。"""

from collections import Counter
from exercises.unit3.agentic_rag_project import run_agent

CASES = [
    {"query": "Agent 工具", "expected_status": "completed", "requires_source": True},
    {"query": "完全不存在的量子菜谱", "expected_status": "no_evidence", "requires_source": False},
    {"query": "", "expected_status": "invalid_input", "requires_source": False},
]


def evaluate() -> dict[str, object]:
    failures = Counter()
    passed = 0
    for case in CASES:
        result = run_agent(case["query"])
        ok = result["status"] == case["expected_status"] and (not case["requires_source"] or bool(result["sources"]))
        if ok: passed += 1
        else: failures["status_or_citation_mismatch"] += 1
    return {"passed": passed, "total": len(CASES), "accuracy": passed / len(CASES), "failures": dict(failures)}


if __name__ == "__main__":
    print(evaluate())
