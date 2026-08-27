import unittest
from exercises.bonus.observability.solution import summarize_trace


class ObservabilityTests(unittest.TestCase):
    def test_trace_summary_finds_error_and_slowest(self):
        report = summarize_trace([{"name": "model", "duration_ms": 20}, {"name": "tool", "duration_ms": 50, "status": "error"}])
        self.assertEqual(report["slowest"], "tool")
        self.assertEqual(report["errors"], ["tool"])


if __name__ == "__main__": unittest.main()
