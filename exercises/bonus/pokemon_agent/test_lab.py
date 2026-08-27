import unittest
from exercises.bonus.pokemon_agent.solution import choose_move


class PokemonAgentTests(unittest.TestCase):
    def test_selects_super_effective_legal_move(self):
        state = {"opponent_type": "fire", "legal_moves": [{"name": "撞击", "type": "normal"}, {"name": "水枪", "type": "water"}]}
        self.assertEqual(choose_move(state)["move"], "水枪")


if __name__ == "__main__": unittest.main()
