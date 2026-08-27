# 实验 04：第一个真实 smolagents Agent

## 这次“真实”在哪里

本实验真实使用 `smolagents==1.26.0` 的 `ToolCallingAgent`、`Model`、`@tool`、消息记忆、工具执行和 `final_answer` 终止流程。它不再是我们自己写的 Agent 循环。

为了让你在没有 Token 时也能验证框架，本实验先使用一个**确定性本地模型**产生两次固定决策：

1. 调用 `get_weather`。
2. 读取工具 Observation 后调用 `final_answer`。

因此它是“真实框架 + 教学模型”，不是“真实大模型”。完成离线验收后，再运行可选的 Hugging Face 在线模型版本。

## 安装

```powershell
python -m pip install -r requirements-frameworks.txt
python scripts\check_python_environment.py --require-frameworks
```

## 任务版

完成 `starter.py` 中的三处 TODO：

1. 使用 `@tool` 定义带类型和参数说明的工具。
2. 让本地模型第一次返回 `get_weather` 工具调用。
3. 创建 `ToolCallingAgent` 并运行任务。

## 运行答案版

```powershell
python -m exercises.unit1.lab04_smolagents.solution
```

预期看到框架实际调用一次 `get_weather`，然后返回：

```text
建议带伞；smolagents 已执行 get_weather，并观察到大连 18℃、有雨。
```

## 自动检查

```powershell
python -m unittest tests.test_smolagents_lab -v
```

测试会验证：

- 使用的确实是 smolagents `ToolCallingAgent`。
- 模型发生两轮生成。
- 天气工具只被执行一次。
- Agent 返回最终答案，而不是把工具调用对象当答案。

## 可选：真实 Hugging Face 模型

1. 把 `.env.example` 复制为 `.env`。
2. 填写具备推理权限的 `HF_TOKEN`。
3. 运行：

```powershell
python -m exercises.unit1.lab04_smolagents.online_solution
```

在线版本会产生网络请求，模型输出、等待时间和服务可用性都可能变化。

## 常见错误与风险

- `ModuleNotFoundError: smolagents`：尚未安装框架依赖，或 PyCharm 选错解释器。
- `401/403`：Token 缺失、无效或没有推理权限。
- 工具没有参数说明：`@tool` 无法生成可靠 schema。
- 把确定性模型称为真实 LLM：本实验明确禁止这种表述。
- 给 CodeAgent 任意代码执行权限：后续 CodeAgent 实验必须继续设置导入白名单、最大步数和隔离边界。
