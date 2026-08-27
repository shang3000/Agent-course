"""真实 smolagents 实验的框架级自动检查。"""

import importlib.util
import unittest


@unittest.skipUnless(importlib.util.find_spec("smolagents"), "尚未安装 smolagents")
class SmolagentsLabTests(unittest.TestCase):
    def test_real_tool_calling_agent_executes_tool_and_finishes(self) -> None:
        from exercises.unit1.lab04_smolagents.solution import run_demo

        answer, model, events = run_demo()
        self.assertIn("建议带伞", answer)
        self.assertEqual(model.generation_count, 2)
        self.assertEqual(
            len([event for event in events if event["event"] == "tool_executed"]),
            1,
        )
        self.assertEqual(
            [event["decision"] for event in events if event["event"] == "model_decision"],
            ["get_weather", "final_answer"],
        )


if __name__ == "__main__":
    unittest.main()
