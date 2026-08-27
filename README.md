# Hugging Face Agents Course 中文伴读与实验项目

本项目配合 [Hugging Face Agents Course 中文课程](https://huggingface.co/learn/agents-course/zh-CN) 使用。目标是完整保存官方内容，并增加解释、主动回忆、可运行实验和自动反馈；网页是否好看不是完成标准。

## 当前真实状态

| 能力 | 状态 |
|---|---|
| 官方中文课程源码 | 75/75 页已接入，固定提交 `8c0832e` |
| 官方原文完整性 | 75/75 页原始 MDX 逐字符一致 |
| Unit 1 学习层 | 15/15 页已有目标、前置、人话解释、概念、误区、任务、回忆题与掌握标准 |
| 官方静态选择题 | 39/39 道已恢复为互动测验，支持得分、重试和错题记录 |
| Unit 1 实验 | 3 个纯 Python 离线实验 + 1 个真实 smolagents 框架实验，均有任务版、答案版、说明和测试 |
| Python 环境 | 配置和自检已完成；当前电脑的旧 `.venv` 已失效，需要按指南重建 |
| 全课程逐页学习层 | 尚未完成，当前为 15/75 页 |
| 真实框架与最终项目 | 正在建设，不能标记为已完成 |
| Unit 1 掌握度 | 已综合阅读、测验、实验与闭卷复述；全课程扩展仍在继续 |
| 笔记、收藏、疑问 | 已支持全部 75 页，含统一列表和 Markdown 导出 |
| 全文搜索 | 下一实施项；当前仍只有标题筛选，不能冒充全文搜索 |

完整建设清单与验收标准见 [LEARNING_SYSTEM_REQUIREMENTS.md](LEARNING_SYSTEM_REQUIREMENTS.md)。

## 一键打开课程

双击根目录的 `打开课程.bat`。它会启动本地网页服务，并在默认浏览器打开：

```text
http://localhost:3000/
```

手动启动时必须在项目根目录运行：

```powershell
npm run dev
```

根目录的 `package.json` 会自动进入 `learning-site/`，因此不会再出现“根目录找不到 package.json”的问题。

## Python 学习环境

先阅读 [PYTHON_SETUP.md](PYTHON_SETUP.md)。当前 `.venv` 指向一个已经不存在的 Python 3.12，必须安装 Python 3.12 后重新创建。

环境恢复后：

```powershell
python scripts\check_python_environment.py
python -m unittest discover -s tests -v
```

Unit 1 正式实验位于 `exercises/unit1/`，建议按 `lab01_messages → lab02_tools → lab03_agent_loop → lab04_smolagents` 顺序完成。前三个只用标准库；第四个真实使用 smolagents，并同时提供无 Token 教学模型和可选在线模型。

## 目录说明

- `learning-site/`：75 页官方内容阅读器、学习层和互动测验。
- `official-source/`：固定版本的 Hugging Face 官方课程源文件。
- `exercises/`：本地 Python 实验；正式实验带 starter、solution 和测试。
- `tests/`：离线自动测试。
- `notes/`：早期本地笔记，后续会整合进网页学习层。
- `scripts/`：官方内容同步、完整性校验、测验提取和环境自检。
- 根目录零散 `.py`：早期自由实验，不属于正式课程交付物。

## 内容校验

```powershell
npm run verify:official
npm run verify:learning
npm run verify:quizzes
npm run lint
npm run build
```

网页进度、测验选择和错题目前只保存在当前浏览器，不会上传，也不会修改官方原文。
