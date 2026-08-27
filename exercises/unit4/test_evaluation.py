import unittest

from exercises.unit4.solution import evaluate


class EvaluationTests(unittest.TestCase):
    def test_fixed_regression_set(self):
        report = evaluate()
        self.assertEqual(report["passed"], report["total"])
        self.assertEqual(report["accuracy"], 1.0)


if __name__ == "__main__":
    unittest.main()
