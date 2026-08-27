# 实验 01：消息与聊天模板

## 目标

把结构化的 `system/user/assistant` 消息转换为模型实际读取的一条提示字符串，并在需要模型继续回答时添加 assistant 起始标记。

## 任务

完成 `starter.py` 中的 `apply_chat_template()`：

1. 检查角色是否合法。
2. 检查 content 是否为字符串。
3. 按 `<|im_start|>角色\n内容<|im_end|>` 拼接。
4. `add_generation_prompt=True` 时补上 assistant 起始标记。

## 预期输出

运行 `solution.py` 后能看到 system 和 user 两段消息，结尾是：

```text
<|im_start|>assistant
```

## 常见错误

- 把消息列表直接传给只接收字符串的模型。
- 忘记换行，导致角色和正文粘连。
- 使用目标模型不认识的特殊 token。
- 误以为模板会让模型永久记住历史。

## 修改挑战

增加 `tool` 角色，并思考：目标模型的官方模板不支持该角色时应该怎样处理？
