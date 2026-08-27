"""在真正训练前验证函数调用 SFT 样本，避免用 GPU 学习错误格式。"""


def validate_example(example: dict) -> list[str]:
    errors: list[str] = []
    messages = example.get("messages")
    tools = example.get("tools")
    if not isinstance(messages, list) or not messages:
        errors.append("messages_missing")
        return errors
    if not isinstance(tools, list) or not tools:
        errors.append("tools_missing")
    calls = [message for message in messages if message.get("role") == "assistant" and message.get("tool_calls")]
    responses = [message for message in messages if message.get("role") == "tool"]
    if not calls:
        errors.append("assistant_tool_call_missing")
    if len(calls) != len(responses):
        errors.append("tool_call_response_mismatch")
    for message in messages:
        if message.get("role") not in {"system", "user", "assistant", "tool"}:
            errors.append("invalid_role")
    return sorted(set(errors))
