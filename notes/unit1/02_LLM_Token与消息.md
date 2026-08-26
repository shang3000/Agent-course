# Unit 1.2：LLM、Token 与消息

课程原页：

- [什么是 LLM？](https://huggingface.co/learn/agents-course/zh-CN/unit1/what-are-llms)
- [消息和特殊 Token](https://huggingface.co/learn/agents-course/zh-CN/unit1/messages-and-special-tokens)

## 两句话先记住

1. **LLM 的基础生成过程，是根据已有 Token 连续预测下一个 Token。**
2. **聊天模板负责把 system、user、assistant 消息转换成特定模型认识的提示格式。**

## Token 不是单词

Token 是模型处理信息的基本单位。它可能是：

- 一个完整单词；
- 单词的一部分；
- 标点符号；
- 汉字或字符片段。

具体如何拆分取决于当前模型的 tokenizer。因此不要把某个模型的拆分结果当成通用规则。

## 生成是怎样发生的？

输入“法国的首都是”后，模型会为下一个 Token 计算可能性。选出“巴黎”后，它把“巴黎”追加到已有序列，再预测下一个 Token。这个过程持续到模型生成结束标记或达到长度限制。

模型不一定每次都选概率最高的候选。贪心、采样、Beam Search 等解码策略会产生不同结果。

## 为什么聊天记录会变成一个长提示？

聊天气泡只是用户界面。发送给模型时，应用会把消息组织成类似下面的数据：

```python
messages = [
    {"role": "system", "content": "你是一位耐心的 Python 助教。"},
    {"role": "user", "content": "解释列表推导式。"},
]
```

聊天模板再把这些消息转换成带有角色边界和结束标记的 Token 序列。

## 三种常见角色

| 角色 | 作用 |
| --- | --- |
| system | 定义身份、规则、行为边界和长期指令 |
| user | 当前用户请求或补充信息 |
| assistant | 模型已经生成的回复 |

工具调用还可能使用 `tool` 等其他角色，后续课程再展开。

## 模型会自动记住聊天吗？

通常不会。聊天应用会保存历史消息，并在下一轮请求中把相关历史再次放进上下文。超过上下文长度后，应用必须删除、截断、总结或检索旧内容。

## 特殊 Token 不需要死记

`<|im_end|>`、`<|eot_id|>` 等标记因模型而异。真正使用模型时，应调用它自己的 tokenizer 和 chat template，不要手写一套格式套给所有模型。

## 对应练习

运行 `exercises/unit1/chat_template.py`，比较“人类使用的消息结构”和“模型读取的提示文本”。

尝试增加第二轮 user/assistant 消息，观察最终提示如何变长。
