import unittest

from exercises.unit1.lab01_messages.solution import apply_chat_template


class MessageLabTests(unittest.TestCase):
    def test_template_contains_roles_and_generation_prompt(self):
        text = apply_chat_template([{"role": "user", "content": "你好"}], add_generation_prompt=True)
        self.assertIn("user", text)
        self.assertIn("assistant", text)


if __name__ == "__main__":
    unittest.main()
