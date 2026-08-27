import unittest
from exercises.bonus.function_calling_finetune.solution import validate_example


class FunctionCallingDatasetTests(unittest.TestCase):
    def test_detects_unpaired_tool_call(self):
        bad = {"tools": [{"name": "weather"}], "messages": [{"role": "assistant", "tool_calls": [{"name": "weather"}]}]}
        self.assertIn("tool_call_response_mismatch", validate_example(bad))


if __name__ == "__main__": unittest.main()
