"""Unit 1 微型实验：把聊天消息转换成模型读取的提示文本。

这是教学用的简化模板，格式参考 SmolLM2 一类模型。
实际项目应始终使用目标模型 tokenizer 自带的 chat template。
"""

messages = [
    {"role": "system", "content": "你是一位耐心的 Python 助教。"},
    {"role": "user", "content": "用一句话解释列表推导式。"},
    {
        "role": "assistant",
        "content": "列表推导式是用简洁语法创建列表的方法。",
    },
]


def apply_demo_chat_template(items: list[dict[str, str]]) -> str:
    """将 role/content 消息拼成一条带特殊 Token 的提示。"""
    prompt_parts = []
    for item in items:
        prompt_parts.append(
            f"<|im_start|>{item['role']}\n{item['content']}<|im_end|>"
        )
    return "\n".join(prompt_parts)


if __name__ == "__main__":
    print("人类使用的消息结构：")
    for message in messages:
        print(message)

    print("\n模型最终读取的提示示意：")
    print(apply_demo_chat_template(messages))
