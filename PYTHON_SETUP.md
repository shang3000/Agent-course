# Python 学习环境（Windows + PyCharm）

## 当前诊断

项目原来的 `.venv` 已失效。它记录的解释器是：

```text
C:\Users\16257\AppData\Local\Programs\Python\Python312\python.exe
```

该文件目前不存在，Windows 的 `py -0p` 也显示没有已安装的 Python。旧 `.venv` 不能通过复制或修改路径修复，正确做法是先安装 Python，再重建虚拟环境。

## 推荐版本

- Python 3.12 x64
- 项目允许 Python 3.11 或 3.12
- 不建议本项目率先使用 3.13，以减少课程框架和示例代码的兼容变量

依赖版本于 2026-08-27 根据 PyPI 官方元数据核对：`smolagents 1.26.0`、`llama-index 0.14.24`、`langgraph 1.2.11` 均声明支持 Python 3.10 及以上。版本被固定在 requirements 文件中，避免不同日期安装出不同结果。

## 第一次安装

1. 从 [Python 官方 Windows 下载页](https://www.python.org/downloads/windows/) 安装 Python 3.12 x64。
2. 安装界面勾选 `Add python.exe to PATH`。
3. 安装后重新打开 PowerShell，进入项目目录：

```powershell
cd D:\pycharm\Agent-course
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python scripts\check_python_environment.py
```

如果 PowerShell 不允许激活脚本，可只为当前用户放行本地脚本：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

这会改变 PowerShell 的当前用户策略；不想修改策略时，可以始终直接使用 `.\.venv\Scripts\python.exe` 执行命令。

## PyCharm 连接解释器

1. 打开 `设置 → 项目 → Python 解释器`。
2. 选择 `添加解释器 → 添加本地解释器 → 现有`。
3. 选择 `D:\pycharm\Agent-course\.venv\Scripts\python.exe`。
4. 运行 `scripts/check_python_environment.py`，看到“基础环境通过”后再开始练习。

## 两条学习路径

### A. 无 Token、无网络的基础路径

这条路径用于先理解数据流，不需要安装 Agent 框架：

```powershell
.\.venv\Scripts\python.exe exercises\unit1\chat_template.py
.\.venv\Scripts\python.exe exercises\unit1\agent_loop.py
.\.venv\Scripts\python.exe exercises\unit1\tools_and_react.py
.\.venv\Scripts\python.exe -m unittest discover -s tests
```

这些文件中的天气和模型行为属于教学模拟，输出会明确标记，不能当成真实 API 结果。

### B. 真实框架路径

完成离线练习后再安装：

```powershell
python -m pip install -r requirements-frameworks.txt
python scripts\check_python_environment.py --require-frameworks
```

真实 Hugging Face 推理实验需要复制 `.env.example` 为 `.env` 并填写 `HF_TOKEN`。没有 Token 时不要阻塞基础学习，继续使用 A 路径。

## 密钥安全

- 只把密钥放在 `.env`、系统环境变量或 Hugging Face Space Secrets。
- `.env` 已被 `.gitignore` 排除，`.env.example` 只能保留空值。
- 不在 Python 文件、截图、终端日志或 Git 提交中写真实 Token。
- 调用远程工具或 `trust_remote_code=True` 前先检查来源和代码。

## 环境自检结果含义

- `基础环境通过`：可以运行 Unit 1 离线练习与测试。
- `框架未安装`：不是基础路径故障，按需安装 `requirements-frameworks.txt`。
- `Python 版本不支持`：改用 3.11 或 3.12 重建 `.venv`。
- `--require-frameworks` 返回非零：真实框架环境尚未就绪，不能把对应实验标为完成。
