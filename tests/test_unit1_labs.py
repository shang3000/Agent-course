"""Unit 1 离线实验答案版测试。"""

import unittest

from exercises.unit1.lab01_messages.solution import apply_chat_template
from exercises.unit1.lab02_tools.solution import execute_tool
from exercises.unit1.lab03_agent_loop.solution import Decision, WeatherDemoModel, run_agent


class MessageTemplateTests(unittest.TestCase):
    def test_formats_messages_and_generation_prompt(self) -> None:
        prompt = apply_chat_template(
            [{"role": "user", "content": "你好"}], add_generation_prompt=True
        )
        self.assertEqual(
            prompt,
            "<|im_start|>user\n你好<|im_end|>\n<|im_start|>assistant\n",
        )

    def test_rejects_unknown_role(self) -> None:
        with self.assertRaises(ValueError):
            apply_chat_template([{"role": "admin", "content": "越权"}])


class ToolExecutorTests(unittest.TestCase):
    def test_executes_valid_tool(self) -> None:
        result = execute_tool("get_weather", {"city": "大连"})
        self.assertTrue(result["ok"])
        self.assertEqual(result["data"]["city"], "大连")

    def test_rejects_unknown_tool(self) -> None:
        result = execute_tool("delete_everything", {})
        self.assertEqual(result["error"], "unknown_tool")

    def test_rejects_missing_and_wrong_type_arguments(self) -> None:
        self.assertEqual(execute_tool("get_weather", {})["error"], "missing_arguments")
        self.assertEqual(
            execute_tool("get_weather", {"city": 123})["error"],
            "invalid_argument_type",
        )


class AgentLoopTests(unittest.TestCase):
    def test_uses_real_observation_before_final_answer(self) -> None:
        result = run_agent("要带伞吗？", WeatherDemoModel(), execute_tool)
        self.assertEqual(result.status, "completed")
        self.assertIn("建议带伞", result.answer)
        self.assertEqual([item.get("type") for item in result.messages], [None, "action", "observation", "final"])

    def test_stops_at_max_steps(self) -> None:
        def repeating_model(_messages):
            return Decision("tool", tool="get_weather", arguments={"city": "大连"})

        result = run_agent("循环", repeating_model, execute_tool, max_steps=2)
        self.assertEqual(result.status, "max_steps_exceeded")
        self.assertEqual(len([item for item in result.messages if item.get("type") == "observation"]), 2)

    def test_tool_failure_becomes_observation(self) -> None:
        decisions = iter([
            Decision("tool", tool="unknown_tool", arguments={}),
            Decision("final", answer="工具失败，停止回答。"),
        ])

        result = run_agent("失败测试", lambda _messages: next(decisions), execute_tool)
        observation = next(item for item in result.messages if item.get("type") == "observation")
        self.assertEqual(observation["content"]["error"], "unknown_tool")


if __name__ == "__main__":
    unittest.main()
