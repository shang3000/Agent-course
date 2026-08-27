import importlib.util
import unittest


@unittest.skipUnless(importlib.util.find_spec("smolagents"), "尚未安装 smolagents")
class ToolCallingAgentLabTests(unittest.TestCase):
    def test_framework_executes_tool(self):
        from exercises.unit1.lab04_smolagents.solution import run_demo
        answer, model, events = run_demo()
        self.assertIn("带伞", answer)
        self.assertEqual(model.generation_count, 2)
        self.assertTrue(any(event["event"] == "tool_executed" for event in events))


if __name__ == "__main__":
    unittest.main()
