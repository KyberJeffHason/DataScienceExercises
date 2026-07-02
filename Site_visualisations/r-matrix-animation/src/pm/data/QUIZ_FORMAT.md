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

### 4d. Multi (multiple correct answers)

Checkboxes; several options can be correct. Requires an explicit **Check answer** in immediate mode.

```js
{
  id: "q1",
  type: "multi",
  prompt: "Which are PMBOK knowledge areas?",
  options: [
    { id: "A", text: "Scope Management", correct: true, explanation: "A knowledge area." },
    { id: "B", text: "Cost Management", correct: true, explanation: "A knowledge area." },
    { id: "C", text: "Initiating", correct: false, explanation: "A process group." },
    { id: "D", text: "Closing", correct: false, explanation: "A process group." },
  ],
}
```

- Needs ≥2 options and ≥1 `correct: true`.
- Grading is **all-or-nothing**: every correct option selected, no incorrect ones.

### 4e. Text (short written answer)

Free-text recall, no options shown. Normalised match (trim + collapsed spaces + case-insensitive by default).

```js
{
  id: "q2",
  type: "text",
  prompt: "What document formally authorizes the project?",
  answers: ["project charter", "charter"], // any accepted answer
  explanation: "The Project Charter authorizes the project.",
  caseSensitive: false, // optional (default false)
  trim: true,           // optional (default true)
}
```

- Needs a non-empty `answers` array.
- `" Project   Charter "` matches `"project charter"` by default.
- Supports **manual override** in review (see §7).

### 4f. Cloze (fill in the blanks)

Put `{{blankId}}` placeholders in the prompt; each blank has its own accepted answers.

```js
{
  id: "q3",
  type: "cloze",
  prompt: "A project is a temporary endeavor to create a {{b1}}, {{b2}}, or {{b3}}.",
  blanks: {
    b1: ["unique product", "product"],
    b2: ["unique service", "service"],
    b3: ["unique result", "result"],
  },
  explanation: "PMI: a unique product, service, or result.",
  caseSensitive: false, // optional
  trim: true,           // optional
}
```

- Every `{{blankId}}` in the prompt must have an entry in `blanks`, each with ≥1 accepted answer.
- All blanks must be right for the question to count correct (same normalisation as `text`).
- Supports **manual override** in review (see §7).

### 4g. Matrix (grid classification)

Two-dimensional classification — drag/tap items into row × column cells. Reuses the dnd interaction.

```js
{
  id: "q4",
  type: "matrix",
  prompt: "Place each process into the correct Process Group and Knowledge Area.",
  rows: [
    { id: "initiating", label: "Initiating" },
    { id: "planning", label: "Planning" },
  ],
  columns: [
    { id: "integration", label: "Integration Mgmt" },
    { id: "scope", label: "Scope Mgmt" },
  ],
  items: [
    { id: "charter", text: "Develop Project Charter", row: "initiating", column: "integration",
      explanation: "Initiating + Integration." },
    { id: "wbs", text: "Create WBS", row: "planning", column: "scope",
      explanation: "Planning + Scope." },
  ],
  explanation: "Optional overall note.",
}
```

- Needs ≥1 row, ≥1 column, ≥1 item; every item's `row`/`column` must reference real ids.
- Grading is **all-or-nothing**: every item in its correct row *and* column.

### 4h. Recall (flashcard / self-graded)

Pure active recall. Never auto-graded — the learner reveals the model answer and self-grades.

```js
{
  id: "q5",
  type: "recall",
  prompt: "Without looking, list the five process groups in order.",
  modelAnswer: "Initiating → Planning → Executing → Monitoring & Controlling → Closing",
  explanation: "The five PMBOK process groups in logical order.",
  allowTypedAnswer: true, // optional — show a textarea to write from memory
}
```

- Needs a `modelAnswer`.
- **Immediate mode**: user reveals the answer during the run, then taps *I was correct / I was incorrect*.
- **End mode**: user optionally types an answer during the run; reveals + self-grades on the results screen.
- Starts **ungraded** (`finalCorrect = null`, shown amber in the map) until self-graded.

---

## 7. Manual grading & self-grading override

`text`, `cloze`, and `recall` can be graded by hand in the review screen. Each graded
question stores a grading model:

```js
{
  autoCorrect,    // system result (null for recall)
  manualCorrect,  // user override / self-grade (null if none)
  finalCorrect,   // what counts toward the score
  gradingMode,    // "auto" | "manual" | "self"
}
```

Rules:

- Auto types: `finalCorrect = manualCorrect ?? autoCorrect`; `gradingMode` becomes `"manual"` when overridden.
- Recall: `autoCorrect = null`, `finalCorrect = manualCorrect`, `gradingMode = "self"`.

In review:

- `text` / `cloze` show **Mark correct** / **Mark incorrect** / **Reset to system**.
- `recall` shows **I was correct** / **I was incorrect** (changeable any time).
- Changing a grade **immediately** updates the score, the question-map colour, and the
  stored attempt in history — so re-opening the attempt later shows your overrides.
- The status badge shows when a result was overridden (`System: … · overridden`) or self-graded.

---

## 8. Validation / safe fallback

Malformed questions never crash the quiz — a dev-friendly message renders in place and the
question can be skipped (counts as incorrect). Rules enforced: `multi` (≥2 options, ≥1 correct),
`text` (≥1 accepted answer), `cloze` (every `{{blank}}` has answers), `matrix` (valid row/column
ids; ≥1 row/column/item), `recall` (has `modelAnswer`).

---

## 5. Feedback, shuffling, history

These are handled by the engine — no per-quiz config needed:

- **Feedback mode** (chosen before starting): `immediate` (reveal per question) or `end` (reveal all on the results screen).
- **Shuffle questions** / **shuffle answer order** — toggles in the config screen. Answer-shuffle only affects option-based types (`choice`, `multi`); others are unaffected.
- **History** — each finished attempt stores the full `breakdown` (including the grading model), so users can reopen a past attempt from the history table (**Review →**), see the question map + per-question review, and even change manual/self grades later.
- **Question map** — the results screen shows numbered cells (green = correct, red = wrong, amber = needs grading, grey = skipped); clicking one jumps to that question's review.

---

## 6. Authoring checklist

- [ ] Unique `quiz.id`; unique `section.id`; question `id` unique per section.
- [ ] `choice`: exactly one `correct: true`; every option has an `explanation`.
- [ ] `numeric`: `answer` is a number; set `tolerance: 0` for exact values; add `unit` where relevant.
- [ ] `dnd`: every `item.target` matches a real `target.id`.
- [ ] `multi`: ≥2 options, ≥1 correct.
- [ ] `text`: non-empty `answers`; set `caseSensitive`/`trim` only if needed.
- [ ] `cloze`: every `{{blank}}` in the prompt has answers in `blanks`.
- [ ] `matrix`: every item `row`/`column` references a real id.
- [ ] `recall`: has `modelAnswer`; set `allowTypedAnswer` if you want a textarea.
- [ ] Prompts read clearly; use `\n` for multi-line setups.
- [ ] Registered in `quizzes.js`.
- [ ] `npx eslint src/pm` clean and `npm run build` passes.
