# Unit 1 正式实验

按顺序完成，不要先打开 `solution.py`：

1. `lab01_messages`：消息怎样变成模型读取的提示。
2. `lab02_tools`：工具 schema、参数校验与安全执行器。
3. `lab03_agent_loop`：把模型决策、工具行动和 Observation 串成循环。

每个目录均包含：

- `starter.py`：任务版，保留明确 TODO。
- `solution.py`：参考答案，不是唯一写法。
- `README.md`：目标、步骤、预期输出和常见错误。
- 根目录 `tests/test_unit1_labs.py`：答案版自动检查。

运行全部离线测试：

```powershell
python -m unittest discover -s tests -v
```

这些实验完全使用 Python 标准库，不需要网络、模型或 Token。
