import unittest

from exercises.unit3.solution import run_agent


class AgenticRagTests(unittest.TestCase):
    def test_sources_and_fallback(self):
        self.assertTrue(run_agent("Agent 工具")["sources"])
        self.assertEqual(run_agent("完全不存在的量子菜谱")["status"], "no_evidence")


if __name__ == "__main__":
    unittest.main()
