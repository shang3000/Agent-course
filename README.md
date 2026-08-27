# Hugging Face Agents Course 中文伴读与实验项目

本项目配合 [Hugging Face Agents Course 中文课程](https://huggingface.co/learn/agents-course/zh-CN) 学习。官方原文、Hinata 学习层、个人记录和实验代码分开存储；学习层只增加解释，不压缩、替代或改写官方内容。

## 当前真实状态

| 能力 | 状态 |
|---|---|
| 官方中文课程 | 75/75 页，固定提交 `8c0832e`；原始 MDX 75/75 逐字符一致 |
| Hinata 学习层 | 75/75 页，每页都有 8 类学习字段；Unit 1 为人工精写，其余页根据官方本页标题、段落与代码生成 |
| 官方测验 | 8 个测验页、39/39 题；支持提交后显示答案、重试、得分、错题与本地保存 |
| 学习工具 | 正文全文搜索、本地笔记、收藏、没看懂、Markdown 导出、主动回忆、间隔复习和 15 个概念关系 |
| 真实框架 | smolagents ToolCallingAgent / CodeAgent、LlamaIndex 索引检索、LangGraph 条件路由已用固定版本实际运行通过 |
| 渐进式主项目 | 8 阶段：最小循环 → 路由 → 模型适配 → RAG → 状态图 → 多角色 → Trace/Span → GAIA 风格评估 |
| 自动验收 | 官方完整性、75 页学习层、39 题、28 个内部链接、Python 实验、lint、生产构建和本地 HTTP 冒烟均通过 |
| 依赖安全 | Next 16.3.3、React 19.2.8、Vinext beta.8、Vite 8.2.2 等兼容组合；`npm audit` 0 漏洞 |
| 离线图片 | 已有批量缓存脚本与页面降级提示；当前命令行无法连接 Hugging Face，109 个图片未实际缓存，不标记为完成 |
| 学习者掌握度 | 系统只记录证据，不会因为功能做完就自动声称你“已掌握” |

完整要求、实施顺序和验收记录见 [LEARNING_SYSTEM_REQUIREMENTS.md](LEARNING_SYSTEM_REQUIREMENTS.md)。

## 一键打开

双击根目录的 `打开课程.bat`，它会检查服务、必要时启动项目，然后在默认浏览器打开 `http://localhost:3000/`。手动启动使用 `npm run dev`。

## 建议学习顺序

1. 在网页中阅读官方原文和本页 Hinata 学习层。
2. 不看正文完成复述自评，再做官方测验。
3. 按 `exercises/unit1 → unit2 → unit3 → unit4` 完成任务版，用测试检查，最后对照答案版。
4. 用 `exercises/capstone/` 把分散知识合成同一个 8 阶段项目。
5. 在统一记录中处理错题、没看懂和到期复习，而不是只累计“已阅读”。

Python 环境按 [PYTHON_SETUP.md](PYTHON_SETUP.md) 重建。当前旧 `.venv` 指向已删除的 Python 3.12，这是本机环境状态，不是实验代码错误。

## 验收和维护

```powershell
npm run verify:all
npm run check:updates
npm run cache:assets
```

- `verify:all`：内容、链接、学习层、Python、lint 和生产构建总验收。请先按 Python 指南重建 `.venv`。
- `check:updates`：只读比较官方提交；有变化时生成行级差异报告，不自动覆盖本地学习层。
- `cache:assets`：批量缓存官方教学图片；需要命令行能访问 Hugging Face。

浏览器中的进度、笔记、收藏、疑问、复习和错题都只保存在当前设备，不会上传。
