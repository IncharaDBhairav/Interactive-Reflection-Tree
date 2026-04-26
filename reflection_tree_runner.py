import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


def get_context_value(context: Dict[str, Any], key: str) -> str:
    value: Any = context
    for part in key.split("."):
        if isinstance(value, dict) and part in value:
            value = value[part]
        else:
            return "{" + key + "}"
    return str(value)


def interpolate(text: str, context: Dict[str, Any]) -> str:
    if not isinstance(text, str):
        return text

    def replace(match: re.Match[str]) -> str:
        return get_context_value(context, match.group(1))

    return re.sub(r"\{([a-zA-Z0-9_.]+)\}", replace, text)


def normalize_nodes(nodes: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    return {node["id"]: node for node in nodes}


def eval_signal_condition(signal_state: Dict[str, int], condition: Dict[str, Any]) -> bool:
    name = condition["signal"]
    operator = condition["operator"]
    value = condition["value"]
    current = signal_state.get(name, 0)
    if operator == ">":
        return current > value
    if operator == ">=":
        return current >= value
    if operator == "<":
        return current < value
    if operator == "<=":
        return current <= value
    if operator == "==":
        return current == value
    if operator == "!=":
        return current != value
    return False


def eval_answer_condition(answers: Dict[str, Dict[str, Any]], condition: Dict[str, Any]) -> bool:
    node_id = condition["nodeId"]
    option_id = condition.get("optionId")
    if node_id not in answers:
        return False
    if option_id is None:
        return True
    return answers[node_id].get("optionId") == option_id


def eval_route_condition(state: Dict[str, Any], condition: Dict[str, Any]) -> bool:
    if condition is None:
        return True
    if "all" in condition:
        return all(eval_route_condition(state, sub) for sub in condition["all"])
    if "any" in condition:
        return any(eval_route_condition(state, sub) for sub in condition["any"])
    if "signalCondition" in condition:
        return eval_signal_condition(state["signals"], condition["signalCondition"])
    if "answerCondition" in condition:
        return eval_answer_condition(state["answers"], condition["answerCondition"])
    return False


def choose_route(node: Dict[str, Any], state: Dict[str, Any]) -> Optional[str]:
    for route in node.get("routes", []):
        condition = route.get("condition")
        if condition is None or eval_route_condition(state, condition):
            return route["next"]
    return node.get("default")


def build_context(answers: Dict[str, Any]) -> Dict[str, Any]:
    return {
        node_id: {
            "answer": data.get("label", ""),
            "optionId": data.get("optionId", ""),
        }
        for node_id, data in answers.items()
    }


def run_engine(data: Dict[str, Any]) -> None:
    nodes = normalize_nodes(data.get("nodes", []))
    state = {"answers": {}, "signals": {}, "history": []}
    current_id = None

    if "start" in nodes:
        current_id = "start"
    else:
        print("ERROR: no start node found.")
        return

    while current_id:
        node = nodes.get(current_id)
        if node is None:
            print(f"ERROR: node '{current_id}' not found.")
            return

        node_type = node["type"]
        context = build_context(state["answers"])

        if node_type == "start":
            current_id = node["next"]
            continue

        if node_type == "bridge":
            text = node.get("text")
            if text:
                print(f"\n{text}\n")
                input("Press Enter to continue...")
            current_id = node["next"]
            continue

        if node_type == "question":
            text = interpolate(node["text"], context)
            print(f"\n{text}\n")
            for index, option in enumerate(node["options"], start=1):
                print(f"  {index}. {option['label']}")

            selected = None
            while selected is None:
                answer = input("Select an option: ").strip()
                if not answer.isdigit():
                    print("Enter a number for your choice.")
                    continue
                choice = int(answer) - 1
                if choice < 0 or choice >= len(node["options"]):
                    print("Choice out of range.")
                    continue
                selected = node["options"][choice]

            option_signals = selected.get("signals", {})
            for signal_name, delta in option_signals.items():
                state["signals"][signal_name] = state["signals"].get(signal_name, 0) + delta

            state["answers"][node["id"]] = {
                "optionId": selected["id"],
                "label": selected["label"],
            }
            state["history"].append({
                "nodeId": node["id"],
                "optionId": selected["id"],
                "label": selected["label"],
            })
            current_id = selected["next"]
            continue

        if node_type == "decision":
            next_id = choose_route(node, state)
            if next_id is None:
                print(f"ERROR: decision node '{current_id}' could not resolve a route.")
                return
            current_id = next_id
            continue

        if node_type in {"reflection", "summary"}:
            text = interpolate(node["text"], context)
            print(f"\n{text}\n")
            if node_type == "reflection":
                input("Press Enter to continue...")
            current_id = node.get("next")
            continue

        if node_type == "end":
            text = node.get("text")
            if text:
                print(f"\n{text}\n")
            break

        print(f"ERROR: unsupported node type '{node_type}'.")
        return

    print("\n=== Session Complete ===\n")


def main() -> None:
    if len(sys.argv) > 1:
        data_path = Path(sys.argv[1])
    else:
        data_path = Path("sample_data.json")

    if not data_path.exists():
        print(f"ERROR: data file not found: {data_path}")
        return

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    run_engine(data)


if __name__ == "__main__":
    main()
