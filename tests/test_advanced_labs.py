import importlib.util
import unittest

from exercises.unit3.agentic_rag_project import run_agent
from exercises.unit4.evaluation_suite import evaluate
from exercises.capstone.solution import run_capstone


class RagAndEvaluationTests(unittest.TestCase):
    def test_rag_cites_and_refuses_without_evidence(self):
        self.assertTrue(run_agent("Agent 工具")["sources"])
        self.assertEqual(run_agent("完全不存在的量子菜谱")["status"], "no_evidence")

    def test_evaluation_suite(self):
        self.assertEqual(evaluate()["accuracy"], 1.0)

    def test_progressive_capstone(self):
        result = run_capstone("Agent 工具", stage=8)
        self.assertTrue(result["sources"])
        self.assertEqual(result["trace"], ["planner", "router", "researcher", "writer"])


@unittest.skipUnless(importlib.util.find_spec("smolagents"), "尚未安装 smolagents")
class CodeAgentTests(unittest.TestCase):
    def test_real_code_agent(self):
        from exercises.unit2.lab04b_codeagent.solution import run_demo
        self.assertIn("带伞", run_demo())


@unittest.skipUnless(importlib.util.find_spec("llama_index"), "尚未安装 llama-index")
class LlamaIndexTests(unittest.TestCase):
    def test_real_index_returns_sources(self):
        from exercises.unit2.lab05_llamaindex.solution import build_and_retrieve
        self.assertTrue(all(item["source"] for item in build_and_retrieve("RAG")))


@unittest.skipUnless(importlib.util.find_spec("langgraph"), "尚未安装 langgraph")
class LangGraphTests(unittest.TestCase):
    def test_real_graph_routes_weather(self):
        from exercises.unit2.lab06_langgraph.solution import build_graph
        state = {"question": "要带伞吗", "route": "", "observation": "", "answer": "", "trace": []}
        result = build_graph().invoke(state)
        self.assertEqual(result["trace"], ["classify", "weather_tool", "answer"])


if __name__ == "__main__": unittest.main()
