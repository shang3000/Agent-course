# Unit 3：Agentic RAG

## 普通 RAG 与 Agentic RAG

普通 RAG 通常固定执行“检索 → 生成”。Agentic RAG 把检索器变成工具，Agent 可以决定：

- 是否需要检索；
- 查询哪个知识源；
- 是否还需要搜索、天气等实时工具；
- 当前证据是否足够回答。

## 官方 Gala 案例

Alfred 需要组合四类能力：

1. 从宾客数据集检索私人信息；
2. 搜索最新网络内容；
3. 查询烟花表演所需天气；
4. 查询 Hugging Face Hub 模型统计。

## 检索工具的制作流程

1. 加载并清洗数据。
2. 转换为带正文和 metadata 的 Document。
3. 建立 BM25 或向量检索器。
4. 用清晰 schema 包装为 Tool。
5. 先单测检索，再集成 Agent。

## 可靠性检查

- 返回内容应带来源；
- 测试无结果、冲突结果和脏数据；
- 对外部文本防范提示注入；
- 不让模型看到无关隐私字段；
- 记录 Agent 选择了哪个来源以及为什么。

对应练习：`exercises/unit3/mini_agentic_rag.py`。
