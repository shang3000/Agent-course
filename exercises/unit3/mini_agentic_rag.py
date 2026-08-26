"""最小 Agentic RAG：让路由器决定查询私有数据还是实时工具。"""

GUESTS = {
    "Ada": "数学家，被称为第一位程序员。",
    "Tesla": "发明家，热衷无线能量与鸽子。",
}


def retrieve_guest(question: str) -> str:
    for name, profile in GUESTS.items():
        if name.lower() in question.lower():
            return f"来源=guestbook; {name}: {profile}"
    return "来源=guestbook; 未找到匹配宾客"


def weather_tool(question: str) -> str:
    return "来源=weather; 晚上小雨，暂缓烟花"


def route(question: str) -> str:
    if "天气" in question or "烟花" in question:
        return weather_tool(question)
    return retrieve_guest(question)


if __name__ == "__main__":
    for query in ["介绍 Ada", "今晚适合放烟花吗？"]:
        print(query, "->", route(query))
