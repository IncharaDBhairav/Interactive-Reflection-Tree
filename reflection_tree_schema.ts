export type ReflectionTreeNodeType =
  | "start"
  | "question"
  | "decision"
  | "reflection"
  | "bridge"
  | "summary"
  | "end";

export interface BaseNode {
  id: string;
  type: ReflectionTreeNodeType;
  text?: string;
  next?: string;
}

export interface StartNode extends BaseNode {
  type: "start";
  next: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  next: string;
  signals?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

export interface QuestionNode extends BaseNode {
  type: "question";
  text: string;
  options: QuestionOption[];
}

export type ComparisonOperator = ">" | ">=" | "<" | "<=" | "==" | "!=";

export interface SignalCondition {
  signal: string;
  operator: ComparisonOperator;
  value: number;
}

export interface AnswerCondition {
  nodeId: string;
  optionId?: string;
}

export interface RouteCondition {
  all?: RouteCondition[];
  any?: RouteCondition[];
  signalCondition?: SignalCondition;
  answerCondition?: AnswerCondition;
}

export interface DecisionRoute {
  condition?: RouteCondition;
  next: string;
}

export interface DecisionNode extends BaseNode {
  type: "decision";
  routes: DecisionRoute[];
}

export interface ReflectionNode extends BaseNode {
  type: "reflection";
  text: string;
  next: string;
}

export interface BridgeNode extends BaseNode {
  type: "bridge";
  text?: string;
  next: string;
}

export interface SummaryNode extends BaseNode {
  type: "summary";
  text: string;
  next?: string;
}

export interface EndNode extends BaseNode {
  type: "end";
  text?: string;
}

export type ReflectionTreeNode =
  | StartNode
  | QuestionNode
  | DecisionNode
  | ReflectionNode
  | BridgeNode
  | SummaryNode
  | EndNode;

export interface ReflectionTree {
  nodes: ReflectionTreeNode[];
}
