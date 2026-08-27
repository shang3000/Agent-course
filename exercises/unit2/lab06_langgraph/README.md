# 实验 06：LangGraph 状态、条件路由与循环

目标：真实使用 `StateGraph`，实现分类节点、天气工具节点、普通回答节点和条件边。

任务版要求：补全节点和路由；天气问题必须经过工具节点，普通问题直接回答。状态中保留 trace，便于解释走过哪些节点。

预期：天气问题 trace 为 `classify → weather_tool → answer`；普通问题为 `classify → answer`。失败场景：空问题和未知 route。

```powershell
python -m exercises.unit2.lab06_langgraph.solution
```
