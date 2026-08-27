import importlib.util
import unittest


@unittest.skipUnless(importlib.util.find_spec("smolagents"), "尚未安装 smolagents")
class CodeAgentTests(unittest.TestCase):
    def test_real_code_agent(self):
        from exercises.unit2.lab04b_codeagent.solution import run_demo
        answer = run_demo()
        self.assertIn("大连", answer)
        self.assertIn("带伞", answer)


if __name__ == "__main__":
    unittest.main()
