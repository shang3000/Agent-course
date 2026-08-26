"""Unit 1 微型实验：不用 AI 库，观察 Agent 循环的基本骨架。

这里用一条简单规则代替 LLM。重点不是做出聪明的 Agent，
而是亲眼看到 Thought -> Action -> Observation -> Final Answer 的数据流。
"""


def weather(city: str) -> dict:
    """模拟一个天气工具：真实项目中这里通常会调用天气 API。"""
    return {"city": city, "rain": True, "temperature": 18}


def run_agent(question: str) -> str:
    """完成一次最小化的 Agent 循环。"""
    print(f"USER        {question}")

    thought = "要回答是否带伞，我需要先获得实时天气。"
    print(f"THOUGHT     {thought}")

    action_name = "weather"
    action_args = {"city": "大连"}
    print(f"ACTION      {action_name}({action_args})")

    observation = weather(**action_args)
    print(f"OBSERVATION {observation}")

    answer = "建议带伞。" if observation["rain"] else "今天不用带伞。"
    print(f"FINAL       {answer}")
    return answer


if __name__ == "__main__":
    run_agent("我今天出门需要带伞吗？")
