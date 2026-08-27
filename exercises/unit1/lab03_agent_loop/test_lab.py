import unittest

from exercises.unit1.lab03_agent_loop.solution import Decision, run_agent


class AgentLoopLabTests(unittest.TestCase):
    def test_final_decision_stops_loop(self):
        result = run_agent("问题", lambda _messages: Decision("final", answer="完成"), lambda *_args: {})
        self.assertEqual(result.status, "completed")
        self.assertEqual(result.answer, "完成")


if __name__ == "__main__":
    unittest.main()
