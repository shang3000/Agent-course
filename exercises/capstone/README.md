# 渐进式 Agent 主项目

这不是 8 个互不相关的 Demo。`solution.py` 始终使用同一份 `State` 和 `run_capstone()`，通过 `stage=1..8` 逐步打开能力。

| 阶段 | 新增能力 | 可验收证据 |
|---|---|---|
| 1 | 最小计划—回答循环 | trace 只有 planner/writer |
| 2 | 路由与多工具决策 | `route` 明确记录 |
| 3 | 真实模型适配器 | 注入任意 `str -> str` 调用器；默认离线 |
| 4 | 文档检索与来源 | `sources` 不为空 |
| 5 | 显式 State / Node / Edge | 每个节点只更新 State |
| 6 | planner / researcher / writer 多 Agent 协作 | trace 展示角色交接 |
| 7 | Trace / Span / 延迟 / 失败分类 | `spans` 和 `failure_type` |
| 8 | GAIA 风格最终任务 | 计划、证据、来源、回退和评估输出同时存在 |

运行答案：

```powershell
python -m exercises.capstone.solution
python -m unittest exercises.capstone.test_capstone -v
```

失败练习：空问题必须归类为 `invalid_input`；检索路由没有证据时必须拒答；真实模型适配器抛异常时必须在 Span 中留下 `error`。

安全边界：离线模型不发网络请求；接入真实模型时从环境变量读取 Token，禁止写入代码。工具必须继续使用白名单、参数验证、最大步数和超时。
