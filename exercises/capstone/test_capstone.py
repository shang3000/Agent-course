import unittest

from exercises.capstone.solution import run_capstone


class CapstoneTests(unittest.TestCase):
    def test_stage_one_is_minimal_loop(self):
        result = run_capstone("你好", stage=1)
        self.assertEqual(result["trace"], ["planner", "writer"])
        self.assertEqual(result["sources"], [])

    def test_final_stage_has_roles_sources_and_spans(self):
        result = run_capstone("Agent 工具", stage=8)
        self.assertEqual(result["trace"], ["planner", "router", "researcher", "writer"])
        self.assertTrue(result["sources"])
        self.assertEqual(len(result["spans"]), 4)

    def test_invalid_and_no_evidence_are_explicit(self):
        self.assertEqual(run_capstone("", stage=8)["failure_type"], "invalid_input")
        result = run_capstone("不存在的 Agent 食谱", stage=8)
        self.assertIn(result["status"], {"completed", "failed"})

    def test_real_model_adapter_is_injectable(self):
        result = run_capstone("你好", stage=3, model=lambda prompt: f"REAL:{prompt}")
        self.assertTrue(result["answer"].startswith("REAL:"))


if __name__ == "__main__":
    unittest.main()
