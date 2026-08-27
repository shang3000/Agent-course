import unittest

from exercises.unit1.lab02_tools.solution import execute_tool


class ToolLabTests(unittest.TestCase):
    def test_unknown_tool_is_rejected(self):
        result = execute_tool("unknown", {})
        self.assertFalse(result["ok"])


if __name__ == "__main__":
    unittest.main()
