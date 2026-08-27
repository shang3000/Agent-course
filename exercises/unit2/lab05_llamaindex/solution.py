"""答案版：无 Token 的真实 LlamaIndex 结构实验。"""

from llama_index.core import Document, VectorStoreIndex
from llama_index.core.embeddings import MockEmbedding


DOCUMENTS = [
    Document(text="Agent 通过工具与环境交互。", metadata={"source": "agent.md"}),
    Document(text="RAG 先检索资料，再基于证据回答。", metadata={"source": "rag.md"}),
    Document(text="LangGraph 用 State、Node 和 Edge 编排工作流。", metadata={"source": "langgraph.md"}),
]


def build_and_retrieve(query: str) -> list[dict[str, object]]:
    if not query.strip():
        raise ValueError("查询不能为空")
    index = VectorStoreIndex.from_documents(DOCUMENTS, embed_model=MockEmbedding(embed_dim=16))
    nodes = index.as_retriever(similarity_top_k=2).retrieve(query)
    return [{"text": item.node.get_content(), "score": item.score, "source": item.node.metadata.get("source")} for item in nodes]


if __name__ == "__main__":
    for result in build_and_retrieve("什么是 RAG？"):
        print(result)
