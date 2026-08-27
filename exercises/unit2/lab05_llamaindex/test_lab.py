import importlib.util
import unittest


@unittest.skipUnless(importlib.util.find_spec("llama_index"), "尚未安装 llama-index")
class LlamaIndexLabTests(unittest.TestCase):
    def test_sources_are_preserved(self):
        from exercises.unit2.lab05_llamaindex.solution import build_and_retrieve
        results = build_and_retrieve("RAG")
        self.assertTrue(results)
        self.assertTrue(all(item["source"] for item in results))


if __name__ == "__main__":
    unittest.main()
