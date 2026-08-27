"""答案版：教学用聊天模板，不替代模型 tokenizer 自带模板。"""

ALLOWED_ROLES = {"system", "user", "assistant"}


def apply_chat_template(
    messages: list[dict[str, str]], *, add_generation_prompt: bool = False
) -> str:
    """验证并拼接 role/content 消息。"""
    parts: list[str] = []
    for index, message in enumerate(messages):
        role = message.get("role")
        content = message.get("content")
        if role not in ALLOWED_ROLES:
            raise ValueError(f"第 {index + 1} 条消息角色非法：{role!r}")
        if not isinstance(content, str):
            raise TypeError(f"第 {index + 1} 条消息 content 必须是字符串")
        parts.append(f"<|im_start|>{role}\n{content}<|im_end|>\n")

    if add_generation_prompt:
        parts.append("<|im_start|>assistant\n")
    return "".join(parts)


if __name__ == "__main__":
    demo_messages = [
        {"role": "system", "content": "你是一位耐心的 Python 助教。"},
        {"role": "user", "content": "用一句话解释 Agent。"},
    ]
    print(apply_chat_template(demo_messages, add_generation_prompt=True))
