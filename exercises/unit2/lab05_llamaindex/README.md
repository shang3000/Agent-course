# 实验 05：LlamaIndex 文档索引与检索

目标：使用真实 LlamaIndex 完成 `Document → VectorStoreIndex → Retriever → NodeWithScore` 数据流。

任务版要求：创建文档、使用 `MockEmbedding` 建索引、检索两个节点，并保留文件来源 metadata。MockEmbedding 只用于离线验证框架，不代表真实语义检索质量。

预期：结果包含文本、score 和 source。失败场景：空文档、查询无关、来源 metadata 缺失。

```powershell
python -m exercises.unit2.lab05_llamaindex.solution
```
