"""检查 Agent 课程 Python 环境，不读取或打印任何密钥值。"""

from __future__ import annotations

import argparse
import importlib.util
import os
import platform
import sys
from pathlib import Path


SUPPORTED = {(3, 11), (3, 12)}
FRAMEWORKS = {
    "smolagents": "smolagents",
    "llama-index": "llama_index",
    "langgraph": "langgraph",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="检查课程 Python 环境")
    parser.add_argument(
        "--require-frameworks",
        action="store_true",
        help="缺少任一真实 Agent 框架时返回失败",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parents[1]
    version = sys.version_info[:2]
    failures: list[str] = []

    print("Agent 课程环境自检")
    print(f"- Python: {platform.python_version()}")
    print(f"- 解释器: {sys.executable}")
    print(f"- 项目根目录: {project_root}")

    if version not in SUPPORTED:
        failures.append("Python 版本应为 3.11 或 3.12")

    required_paths = [
        project_root / "requirements.txt",
        project_root / "requirements-frameworks.txt",
        project_root / ".env.example",
        project_root / "exercises" / "unit1" / "agent_loop.py",
    ]
    for required_path in required_paths:
        if not required_path.exists():
            failures.append(f"缺少项目文件：{required_path.relative_to(project_root)}")

    print("- 框架状态:")
    missing_frameworks = []
    for label, module_name in FRAMEWORKS.items():
        installed = importlib.util.find_spec(module_name) is not None
        print(f"  - {label}: {'已安装' if installed else '未安装（离线路径可忽略）'}")
        if not installed:
            missing_frameworks.append(label)

    token_names = ["HF_TOKEN", "OPENAI_API_KEY", "LANGFUSE_PUBLIC_KEY", "LANGFUSE_SECRET_KEY"]
    configured_tokens = [name for name in token_names if os.getenv(name)]
    print(f"- 外部服务凭据: 已配置 {len(configured_tokens)}/{len(token_names)} 项（仅报告状态，不显示值）")

    if args.require_frameworks and missing_frameworks:
        failures.append(f"缺少真实框架：{', '.join(missing_frameworks)}")

    if failures:
        print("\n环境未通过：")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("\n基础环境通过，可以开始离线练习。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
