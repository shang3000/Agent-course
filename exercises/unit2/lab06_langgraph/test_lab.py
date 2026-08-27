import importlib.util
import unittest


@unittest.skipUnless(importlib.util.find_spec("langgraph"), "尚未安装 langgraph")
class LangGraphLabTests(unittest.TestCase):
    def test_conditional_route(self):
        from exercises.unit2.lab06_langgraph.solution import build_graph
        state = {"question": "要带伞吗", "route": "", "observation": "", "answer": "", "trace": []}
        self.assertEqual(build_graph().invoke(state)["trace"], ["classify", "weather_tool", "answer"])


if __name__ == "__main__":
    unittest.main()
