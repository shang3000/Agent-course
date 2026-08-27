EFFECTIVENESS = {("water", "fire"): 2.0, ("fire", "grass"): 2.0, ("grass", "water"): 2.0}


def choose_move(state: dict) -> dict:
    moves = state.get("legal_moves", [])
    opponent = state.get("opponent_type")
    if not moves:
        return {"status": "no_legal_action", "move": None, "reason": "没有可执行招式"}
    chosen = max(moves, key=lambda move: EFFECTIVENESS.get((move["type"], opponent), 1.0))
    multiplier = EFFECTIVENESS.get((chosen["type"], opponent), 1.0)
    return {"status": "selected", "move": chosen["name"], "reason": f"属性倍率 {multiplier}"}
