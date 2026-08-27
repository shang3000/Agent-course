# Unit 3：Agentic RAG 主项目

`agentic_rag_project.py` 是贯穿课程的离线主项目阶段：输入校验、检索路由、证据列表、来源引用、无结果拒答和结构化 trace。

先完成 `agentic_rag_starter.py`，再对照答案。预期成功问题返回来源；无证据问题必须明确拒答，不能让模型补写事实。

常见错误：只做向量检索却称为 Agentic RAG、没有来源、无结果仍回答、把检索分数当事实正确率。
