# Reflection Tree Diagram

```mermaid
flowchart TD
  subgraph Axis1 [Axis 1: Locus of Control]
    S[start]\nstart
    Q1[q1: Challenge response]
    Q2[q2: Project stall response]
    D1[decision_locus]
  end

  subgraph Axis2 [Axis 2: Orientation]
    B1[bridge_orientation_*]
    Q3[q3: Team signal]
    Q4[q4: Peer success response]
    Q5[q5: Planning priority]
    D2[decision_orientation]
  end

  subgraph Axis3 [Axis 3: Radius of Concern]
    B2[bridge_radius_*]
    Q6[q6: Help decision]
    Q7[q7: Credit sharing]
    Q8[q8: Team problem focus]
    Q9[q9: Urgent issue response]
    Q10[q10: Current posture]
    Q11[q11: Next-step focus]
    D4[decision_profile]
  end

  subgraph Reflection [Reflection & Summary]
    R1[reflection_victor_contribution_altro]
    R2[reflection_victor_contribution_self]
    R3[reflection_victim_entitlement_self]
    R4[reflection_victim_entitlement_altro]
    R5[reflection_balanced]
    SUM[summary]
    END[end]
  end

  S --> Q1
  Q1 --> Q2
  Q2 --> D1

  D1 -->|internal >=2| B1
  D1 -->|external >=2| B1
  D1 -->|otherwise| B1

  B1 --> Q3
  Q3 --> Q4
  Q4 --> Q5
  Q5 --> D2

  D2 -->|contribution >=2| B2
  D2 -->|entitlement >=2| B2
  D2 -->|otherwise| B2

  B2 --> Q6
  Q6 --> Q7
  Q7 --> Q8
  Q8 --> Q9
  Q9 --> Q10
  Q10 --> Q11
  Q11 --> D4

  D4 -->|internal+contribution+altro| R1
  D4 -->|internal+contribution+self| R2
  D4 -->|external+entitlement+self| R3
  D4 -->|external+entitlement+altro| R4
  D4 -->|otherwise| R5

  R1 --> SUM
  R2 --> SUM
  R3 --> SUM
  R4 --> SUM
  R5 --> SUM
  SUM --> END
```
