def summarize_trace(spans: list[dict]) -> dict:
    if not spans:
        return {"total_ms": 0, "cost": 0, "errors": [], "slowest": None}
    errors = [span["name"] for span in spans if span.get("status") == "error"]
    slowest = max(spans, key=lambda span: float(span.get("duration_ms", 0)))
    return {
        "total_ms": sum(float(span.get("duration_ms", 0)) for span in spans),
        "cost": sum(float(span.get("cost", 0)) for span in spans),
        "errors": errors,
        "slowest": slowest["name"],
    }
