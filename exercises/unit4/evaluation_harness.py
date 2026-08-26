"""最小评估框架：保存结果并按失败类型汇总。"""

from collections import Counter

CASES = [
    {"question": "2+2", "expected": "4"},
    {"question": "法国首都", "expected": "巴黎"},
]


def demo_agent(question: str) -> str:
    return {"2+2": "4", "法国首都": "巴黎"}.get(question, "")


def evaluate() -> None:
    failures = Counter()
    for case in CASES:
        answer = demo_agent(case["question"]).strip()
        ok = answer == case["expected"]
        if not ok:
            failures["final_answer_mismatch"] += 1
        print({"question": case["question"], "answer": answer, "ok": ok})
    print("失败汇总：", dict(failures))


if __name__ == "__main__":
    evaluate()
