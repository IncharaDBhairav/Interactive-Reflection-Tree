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

export interface QuestionOption {
  id: string;
  label: string;
  next: string;
  signals?: Record<string, number>;
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
}

export interface BridgeNode extends BaseNode {
  type: "bridge";
  text?: string;
}

export interface SummaryNode extends BaseNode {
  type: "summary";
  text: string;
}

export interface EndNode extends BaseNode {
  type: "end";
}

export type ReflectionTreeNode =
  | QuestionNode
  | DecisionNode
  | ReflectionNode
  | BridgeNode
  | SummaryNode
  | EndNode
  | BaseNode;

export interface ReflectionTree {
  nodes: ReflectionTreeNode[];
}

export interface AnswerData {
  optionId: string;
  label: string;
}
