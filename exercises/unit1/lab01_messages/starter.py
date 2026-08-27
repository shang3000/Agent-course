"""任务版：完成一个教学用聊天模板。"""

ALLOWED_ROLES = {"system", "user", "assistant"}


def apply_chat_template(
    messages: list[dict[str, str]], *, add_generation_prompt: bool = False
) -> str:
    """把结构化消息转换成一个提示字符串。"""
    # TODO 1: 检查每条消息都有合法 role 和字符串 content。
    # TODO 2: 按 README 指定的特殊 token 格式拼接消息。
    # TODO 3: 根据 add_generation_prompt 添加 assistant 起始标记。
    raise NotImplementedError("请完成聊天模板")
