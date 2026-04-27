# Reflection Tree Web App

Interactive employee reflection tree built with React. Uses a JSON-driven state machine to safely explore Locus of Control and Contribution.

## What this delivers
- `package.json`, `vite.config.ts`, `tailwind.config.js`: frontend scaffolding for a React + Vite + Tailwind app.
- `src/App.tsx`: deterministic tree engine, question rendering, hidden decision routing, and smooth transitions.
- `sample_data.json`: expanded sample with 5 questions, multiple decision nodes, bridge transitions, reflection text interpolation, and a summary node.
- `reflection_tree_runner.py`: terminal fallback runner for the same JSON structure.

## Run the web app
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the app:
   ```powershell
   npm run dev
   ```
3. Open the local Vite URL shown in your terminal.

## JSON design notes
- `question` nodes present fixed clickable options.
- Selected options accumulate hidden `signals`.
- `decision` nodes route invisibly using signal comparison or prior answers.
- `bridge` nodes auto-advance between topic sections.
- `reflection` and `summary` nodes interpolate past answers using placeholders like `{q1.answer}`.
- `end` closes the flow.
