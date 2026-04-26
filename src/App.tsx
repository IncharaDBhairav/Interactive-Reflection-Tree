import { useEffect, useMemo, useState } from "react";
import treeData from "../sample_data.json";
import { AnswerData, DecisionNode, ReflectionTree, ReflectionTreeNode, QuestionNode } from "./types";

const interpolate = (text: string, context: Record<string, any>) => {
  return text.replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, key) => {
    const parts = key.split(".");
    let value: any = context;
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return `{${key}}`;
      }
    }
    return String(value ?? "");
  });
};

const evalSignalCondition = (signals: Record<string, number>, condition: any) => {
  const current = signals[condition.signal] ?? 0;
  switch (condition.operator) {
    case ">":
      return current > condition.value;
    case ">=":
      return current >= condition.value;
    case "<":
      return current < condition.value;
    case "<=":
      return current <= condition.value;
    case "==":
      return current === condition.value;
    case "!=":
      return current !== condition.value;
    default:
      return false;
  }
};

const evalAnswerCondition = (answers: Record<string, AnswerData>, condition: any) => {
  const answer = answers[condition.nodeId];
  if (!answer) return false;
  if (!condition.optionId) return true;
  return answer.optionId === condition.optionId;
};

const evalRouteCondition = (state: { answers: Record<string, AnswerData>; signals: Record<string, number> }, condition: any): boolean => {
  if (!condition) return true;
  if (condition.all) {
    return condition.all.every((sub: any) => evalRouteCondition(state, sub));
  }
  if (condition.any) {
    return condition.any.some((sub: any) => evalRouteCondition(state, sub));
  }
  if (condition.signalCondition) {
    return evalSignalCondition(state.signals, condition.signalCondition);
  }
  if (condition.answerCondition) {
    return evalAnswerCondition(state.answers, condition.answerCondition);
  }
  return false;
};

const chooseDecisionRoute = (node: DecisionNode, state: { answers: Record<string, AnswerData>; signals: Record<string, number> }) => {
  for (const route of node.routes) {
    if (!route.condition || evalRouteCondition(state, route.condition)) {
      return route.next;
    }
  }
  return node.next;
};

const buildContext = (answers: Record<string, AnswerData>) => {
  const context: Record<string, any> = {};
  for (const [nodeId, answer] of Object.entries(answers)) {
    context[nodeId] = { answer: answer.label, optionId: answer.optionId };
  }
  return context;
};

const App = () => {
  const tree = treeData as ReflectionTree;
  const nodesById = useMemo(
    () => Object.fromEntries(tree.nodes.map((node) => [node.id, node])),
    [tree.nodes]
  );

  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [answers, setAnswers] = useState<Record<string, AnswerData>>({});
  const [signals, setSignals] = useState<Record<string, number>>({});
  const [isFading, setIsFading] = useState(false);

  const currentNode = nodesById[currentNodeId] as ReflectionTreeNode | undefined;
  const context = buildContext(answers);
  const questionCount = tree.nodes.filter((node) => node.type === "question").length;
  const answeredCount = Object.keys(answers).length;

  const navigateTo = (nextId: string | undefined) => {
    if (!nextId) return;
    setIsFading(true);
    window.setTimeout(() => {
      setCurrentNodeId(nextId);
      setIsFading(false);
    }, 200);
  };

  const resolveNode = (node: ReflectionTreeNode): string | undefined => {
    if (node.type === "start" || node.type === "bridge") {
      return node.next;
    }
    if (node.type === "decision") {
      return chooseDecisionRoute(node as DecisionNode, { answers, signals });
    }
    return undefined;
  };

  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.type === "start" || currentNode.type === "bridge" || currentNode.type === "decision") {
      const next = resolveNode(currentNode);
      if (next) {
        navigateTo(next);
      }
    }
  }, [currentNodeId, currentNode, answers, signals]);

  const handleOptionClick = (option: any) => {
    setSignals((prev) => {
      const nextSignals = { ...prev };
      if (option.signals) {
        for (const [signal, delta] of Object.entries(option.signals)) {
          nextSignals[signal] = (nextSignals[signal] ?? 0) + delta;
        }
      }
      return nextSignals;
    });

    setAnswers((prev) => ({
      ...prev,
      [currentNode!.id]: {
        optionId: option.id,
        label: option.label
      }
    }));

    navigateTo(option.next);
  };

  const handleContinue = () => {
    if (currentNode && currentNode.next) {
      navigateTo(currentNode.next);
    }
  };

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-10 text-center shadow-glow">
            <p className="text-xl font-semibold">Reflection Tree data could not be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderNode = () => {
    const titleMap: Record<string, string> = {
      start: "Welcome",
      question: "Question",
      decision: "Thinking...",
      reflection: "Reflection",
      bridge: "Transition",
      summary: "Summary",
      end: "Finished"
    };

    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                {titleMap[currentNode.type]}
              </p>
              {currentNode.type !== "end" && (
                <h1 className="mt-3 text-3xl font-semibold text-white">
                  {interpolate(currentNode.text ?? "", context)}
                </h1>
              )}
            </div>
            <div className="rounded-full bg-slate-900/90 px-4 py-2 text-sm text-slate-300 shadow-inner">
              {currentNode.type === "question" ? `Question ${answeredCount + 1} of ${questionCount}` : currentNode.type.toUpperCase()}
            </div>
          </div>
        </div>

        {currentNode.type === "question" && (
          <div className="grid gap-4 sm:grid-cols-1">
            {(currentNode as QuestionNode).options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                className="rounded-3xl border border-cyan-500/20 bg-slate-900/95 px-6 py-5 text-left text-base text-white transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-slate-800/95"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {(currentNode.type === "reflection" || currentNode.type === "summary" || currentNode.type === "end") && (
          <div className="space-y-6">
            <p className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-lg leading-8 text-slate-100">
              {interpolate(currentNode.text ?? "", context)}
            </p>
            {currentNode.type !== "end" ? (
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Continue
              </button>
            ) : null}
          </div>
        )}

        {currentNode.type === "start" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-slate-300">
            <p>Tap through a deterministic reflection path based on your answers and hidden signal totals.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-10">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/90 px-8 py-8 shadow-glow backdrop-blur-xl">
          <div className={`transition-all duration-300 ${isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            {renderNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
