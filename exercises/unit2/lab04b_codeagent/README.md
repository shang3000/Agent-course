# 实验 4B：smolagents CodeAgent

这是真实框架代码，使用 `smolagents==1.26.0`；离线教学模型只替代 LLM，`CodeAgent` 的规划、Python 执行与 `final_answer` 流程仍由框架负责。

```powershell
python -m exercises.unit2.lab04b_codeagent.solution
python -m unittest exercises.unit2.lab04b_codeagent.test_lab -v
```

预期：返回包含“大连”和“带伞”的答案。学习重点是比较 CodeAgent 的 Python Action 与 ToolCallingAgent 的 JSON Action。

失败场景：删除 `get_weather`、把 `max_steps` 改为 0，或在生成代码中导入未授权模块，观察框架如何拒绝或终止。

安全：这里的代码只调用白名单工具，禁止添加 `os`/`subprocess` 等导入权限。对不可信模型输出，应进一步放入隔离容器。
