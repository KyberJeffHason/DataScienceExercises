# Quiz Format Guide

How to author a new Project-Management quiz. Every quiz is a plain JS object in
`src/pm/data/`, registered in `quizzes.js`. No engine changes are needed to add a
quiz — only to add a brand-new question *type*.

---

## 1. File + registration

1. Create `src/pm/data/myQuiz.js` and `export const myQuiz = { ... }`.
2. Register it in `src/pm/data/quizzes.js`:

```js
import { myQuiz } from "./myQuiz.js";
export const quizzes = [/* …existing…, */ myQuiz];
```

It then appears automatically in the quiz hub with question count, history,
config (feedback mode + shuffles), running and review.

---

## 2. Quiz object

```js
export const myQuiz = {
  id: "my-quiz",            // unique slug (used in history keys) — REQUIRED, stable
  title: "My Quiz",          // card + header title — REQUIRED
  subtitle: "One-line tag",  // small text on the card
  description: "2–3 sentence summary shown on the quiz card.",
  sections: [ /* one or more sections */ ],
};
export default myQuiz;
```

## 3. Section object

Sections group questions and show a heading chip. A quiz needs ≥1 section.

```js
{
  id: "sec1",              // unique within the quiz — REQUIRED
  title: "Section Title",   // shown as the chip — REQUIRED
  questions: [ /* questions */ ],
}
```

Question keys are auto-namespaced as `${section.id}.${question.id}`, so question
`id` only needs to be unique **within its section** (e.g. `q1`, `q2`, …).

---

## 4. Question types

The engine reads an optional `type` field. Missing/unknown `type` ⇒ **choice**
(so all legacy quizzes keep working). Supported: `choice`, `numeric`, `dnd`.

### 4a. Choice (default — single correct answer)

Every option carries its own explanation (shown for right *and* wrong options on
reveal). Exactly one option should have `correct: true`.

Helper used in the data files:

```js
const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });
```

```js
{
  id: "q1",
  prompt: "What best describes the Waterfall model?",
  options: [
    o("A", "Iterative, revisits phases continuously.", false, "That's agile."),
    o("B", "Sequential, each phase completes before the next.", true, "Correct — linear flow."),
    o("C", "No defined phases.", false, "Waterfall is defined by ordered phases."),
    o("D", "Ships every two weeks.", false, "Fixed cadence is agile."),
  ],
}
```

- Graded correct when the picked option is the `correct: true` one.
- 2–6 options (labelled A–F automatically).

### 4b. Numeric (calculation exercises)

User types a number; graded within a tolerance. Great for PERT, parametric,
reserves, EVM, etc.

Helper:

```js
const num = (id, prompt, answer, explanation, extra = {}) => ({
  id, type: "numeric", prompt, answer, explanation, ...extra,
});
```

```js
num("q2",
  "PERT estimate.\nO = 4, M = 6, P = 14 days.\nExpected duration?",
  7,                                   // answer (number) — REQUIRED
  "(O + 4M + P)/6 = 42/6 = 7 days.",   // explanation / worked solution — REQUIRED
  { unit: "days", tolerance: 0, hint: "Beta PERT: (O + 4M + P)/6." }
)
```

Optional `extra` fields:
- `unit` — string shown after the input and in feedback (e.g. `"days"`, `"$"`, `"hours"`).
- `tolerance` — max absolute difference accepted (default `0.01`). Use `0` for exact integers/money; use e.g. `0.05` when the true value is a rounded decimal.
- `hint` — shown before answering.

Notes:
- `prompt` supports line breaks with `\n` (rendered with `whitespace-pre-line`).
- In immediate mode the user must press **Check answer** before it reveals.

### 4c. Drag & drop (match items to targets / ordering)

User drags items (or taps item → taps target) into buckets. Ordering is just
matching to position buckets.

Helper:

```js
const dnd = (id, prompt, targets, items, explanation = "") => ({
  id, type: "dnd", prompt, targets, items, explanation,
});
```

```js
dnd("q1",
  "Drag each activity into its Process Group.",
  [                                   // targets (buckets) — REQUIRED
    { id: "ini", label: "Initiating" },
    { id: "pla", label: "Planning" },
  ],
  [                                   // items — REQUIRED
    { id: "i1", text: "Develop Project Charter", target: "ini",
      explanation: "Authorises the project." },
    { id: "i2", text: "Create WBS", target: "pla",
      explanation: "Decomposing scope is Planning." },
  ],
  "Optional overall note shown in review."
)
```

- `targets[].id` / `.label` — bucket key + display text.
- `items[].target` — the id of the bucket the item belongs to.
- `items[].explanation` — optional per-item note shown in review.
- Graded correct only when **every** item sits in its correct target (all-or-nothing for the score); the review lists each item ✓/✕ with the correct target.
- For **ordering**, make targets `1st, 2nd, …` and point each item's `target` at its position.

---

## 5. Feedback, shuffling, history

These are handled by the engine — no per-quiz config needed:

- **Feedback mode** (chosen before starting): `immediate` (reveal per question) or `end` (reveal all on the results screen).
- **Shuffle questions** / **shuffle answer order** — toggles in the config screen. Answer-shuffle only affects `choice` options; numeric/dnd are unaffected.
- **History** — each finished attempt stores the full `breakdown`, so users can reopen a past attempt from the history table (**Review →**) and see the clickable question map + per-question review.
- **Question map** — the results screen shows numbered cells (green = correct, red = wrong, grey = skipped); clicking one jumps to that question's review.

---

## 6. Authoring checklist

- [ ] Unique `quiz.id`; unique `section.id`; question `id` unique per section.
- [ ] `choice`: exactly one `correct: true`; every option has an `explanation`.
- [ ] `numeric`: `answer` is a number; set `tolerance: 0` for exact values; add `unit` where relevant.
- [ ] `dnd`: every `item.target` matches a real `target.id`.
- [ ] Prompts read clearly; use `\n` for multi-line calculation setups.
- [ ] Registered in `quizzes.js`.
- [ ] `npx eslint src/pm` clean and `npm run build` passes.
```
