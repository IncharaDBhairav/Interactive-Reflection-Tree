# Reflection Tree Design Rationale

## Purpose and question selection
The reflection tree is designed to reveal three psychological axes with deterministic, fixed-choice logic: Locus of Control, Orientation, and Radius of Concern.

Axis 1 questions probe how an employee interprets setbacks and responsibility. These items are drawn from Rotter’s Locus of Control: they ask whether the individual sees outcomes as driven by their own choices or by external forces. Questions are phrased as experience-based observations rather than judgments, for example: “When a challenge appears, which statement feels most true?” and “When a project stalls, where does your first attention go?”. This avoids moralizing while inviting self-reflection.

Axis 2 questions examine how the employee defines contribution versus entitlement. We deliberately avoid loaded language and instead surface behavior around teamwork, recognition, and credit. For example, one item asks how the user responds when a peer succeeds, which is a practical window into entitlement versus contribution without invoking labels.

Axis 3 questions explore the employee’s radius of concern: whether they focus primarily on self, the immediate team, or broader stakeholders. This is informed by Maslow’s later work on self-transcendence and Batson’s perspective-taking: we ask about help, shared credit, and organizational impact to assess whether someone is self-centric, balanced, or altrocentric.

## Branching design and trade-offs
The tree is deterministic and static, so all routing is based on visible signal tallies and discrete answer conditions. This satisfies the requirement for no runtime LLMs and fixed options only.

The first axis is sequenced deliberately: locus questions come first, so the user establishes their sense of agency before moving to meaning and scope. Two bridge nodes transition to the second and third axes, keeping the flow coherent and signaling a change in lens.

Branching occurs with four decision nodes:
- `decision_locus` routes after the Locus axis.
- `decision_orientation` routes after the Orientation axis.
- `decision_profile` routes after the Radius axis and a final integrative question.
- A final profile decision combines signals across axes to select the most relevant reflection.

We made trade-offs to keep the experience short yet rich. Rather than allowing free-text responses, fixed options ensure consistency and deterministic mapping. This also makes it easier to interpolate specific answer text into reflections, which is essential for personalized feedback without natural language generation.

We did not over-branch into dozens of paths because the goal is cognitive reflection, not exploration of every nuance. Instead, the tree uses core signal combinations to identify dominant patterns while preserving a manageable set of meaningful reflections.

## Psychological grounding
- **Rotter’s Locus of Control**: The first axis directly maps to internal versus external control beliefs. Questions target whether employees interpret setbacks as a result of their own decisions or outside circumstances.

- **Carol Dweck’s Mindset**: The orientation axis echoes growth and fixed mindsets. Contribution-oriented options align with a growth posture of learning, collaboration, and effort, while entitlement-oriented options reflect a fixed view that value is earned primarily through deserved recognition.

- **Maslow’s Self-Transcendence**: The radius axis is rooted in Maslow’s later work, which showed that psychological health extends beyond self-actualization to concern for others and higher-purpose values. Questions about helping colleagues, shared credit, and organizational impact are intended to distinguish self-centered from self-transcendent concern.

- **Batson’s Perspective-Taking**: The tree also uses Batson’s research on empathy and other-oriented motivation. When employees are invited to think about team success, shared credit, and the broader impact of their choices, they are effectively practicing perspective-taking rather than defaulting to self-focused reasoning.

## Improvements with more time
With additional development time, we would refine the model in these areas:

1. **Empirical validation**: Run pilot sessions with employees to test whether the signal tallies align with validated psychometric scales for locus of control, entitlement, and perspective-taking. This would let us calibrate thresholds and option wording.

2. **More nuanced reflections**: Introduce additional reflection nodes that respond to mixed profiles, such as internal agency paired with entitlement, or external control paired with contribution. This would reduce the number of paths that land in a “balanced” fallback.

3. **Adaptive scaffolding**: Add a lightweight onboarding explanation so users understand the three axes in plain language before they begin. This would make the experience feel more supportive while still preserving the deterministic structure.

4. **Longitudinal follow-up**: Capture anonymized state summaries across multiple sessions to show users how their pattern shifts over time. This would turn a one-time reflection into an ongoing developmental tool.

## Conclusion
The final JSON and UI are intentionally structured to be deterministic, psychologically grounded, and user-centered. The content supports a premium, non-judgmental reflection experience while satisfying the assignment’s strict requirements for fixed options, signal-driven routing, and axis sequencing.
