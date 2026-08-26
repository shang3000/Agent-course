# Unit 1 剩余内容：工具、ReAct 与第一个 Agent

## 工具是什么

工具是 Agent 可调用的函数。模型通常只看到工具的名称、描述、参数和返回类型，不会阅读函数内部代码。

完整调用链：

1. 开发者注册工具及其 schema。
2. 模型根据任务生成工具名称和参数。
3. Agent 框架解析并校验调用。
4. 应用代码执行函数。
5. 执行结果作为 Observation 返回模型。

好工具应具有明确名称、类型注解、清晰 docstring、有限权限和可验证输出。

## ReAct 循环

ReAct = Reasoning + Acting。它让 Agent 交替进行思考和行动：

```text
Thought -> Action -> Observation -> Updated Thought -> ... -> Final Answer
```

- Thought：当前知道什么、缺什么、下一步做什么。
- Action：工具调用、代码执行或提交最终答案。
- Observation：工具返回、错误、状态码或环境变化。

必须设置最大步数和失败策略，防止无限循环。

## Action 与 Tool 的区别

Action 是目标层面的“做什么”，Tool 是实现行动的具体能力。一次“安排会议”行动可能组合日历查询、联系人检索和发送邀请等多个工具。

## Agent 框架替我们做什么

- 统一模型调用；
- 自动描述工具；
- 解析工具调用；
- 执行并回传 Observation；
- 维护消息和运行记忆；
- 限制步数、处理错误并记录日志。

对应练习：`exercises/unit1/tools_and_react.py`。
