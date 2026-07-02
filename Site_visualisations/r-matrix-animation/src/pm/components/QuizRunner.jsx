import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { flattenQuestions } from "../data/quizzes.js";

const spring = { type: "spring", stiffness: 260, damping: 24 };

const LETTER = ["A", "B", "C", "D", "E", "F"];

/** Fisher–Yates shuffle returning a new array. */
function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const isNumeric = (q) => q.type === "numeric";
const isDnd = (q) => q.type === "dnd";
/** numeric + dnd need an explicit "Check" before feedback reveals in immediate mode. */
const isManualCommit = (q) => isNumeric(q) || isDnd(q);

/** Parse a user-entered number, tolerating commas as decimal separators. */
function parseNum(raw) {
  if (raw == null) return NaN;
  const cleaned = String(raw).trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

function numericIsCorrect(q, raw) {
  const val = parseNum(raw);
  if (Number.isNaN(val)) return false;
  const tol = q.tolerance ?? 0.01;
  return Math.abs(val - q.answer) <= tol;
}

/** Placements = { itemId: targetId }. Correct when every item sits in its target. */
function dndIsCorrect(q, placements = {}) {
  return q.items.every((it) => placements[it.id] === it.target);
}
function dndAllPlaced(q, placements = {}) {
  return q.items.every((it) => placements[it.id] != null);
}

/**
 * Runs a quiz from start to finish. Supports three question types:
 *  - choice  (legacy default): options: [{ id, text, correct, explanation }]
 *  - numeric: { type:"numeric", answer, tolerance?, unit?, hint?, explanation }
 *  - dnd:     { type:"dnd", targets:[{id,label}], items:[{id,text,target,explanation?}] }
 */
export function QuizRunner({
  quiz,
  feedbackMode,
  shuffleQuestions = false,
  shuffleAnswers = false,
  onFinish,
  onExit,
}) {
  const questions = useMemo(() => {
    let qs = flattenQuestions(quiz);
    if (shuffleQuestions) qs = shuffled(qs);
    if (shuffleAnswers)
      qs = qs.map((q) =>
        q.options ? { ...q, options: shuffled(q.options) } : q
      );
    return qs;
  }, [quiz, shuffleQuestions, shuffleAnswers]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // key -> optionId | numericString | placements
  const [checked, setChecked] = useState({}); // key -> true (locked manual-commit answers)
  const [startedAt] = useState(() => Date.now());

  const current = questions[index];
  const numeric = isNumeric(current);
  const dnd = isDnd(current);
  const answer = answers[current.key];
  const isImmediate = feedbackMode === "immediate";

  const committed = isManualCommit(current)
    ? !!checked[current.key]
    : answer != null;
  const revealed = isImmediate && committed;

  const answeredCount = questions.filter((q) => {
    const a = answers[q.key];
    if (isNumeric(q)) return a != null && a !== "";
    if (isDnd(q)) return a && Object.keys(a).length > 0;
    return a != null;
  }).length;
  const isLast = index === total - 1;
  const isFirstOfSection =
    index === 0 || questions[index - 1].sectionId !== current.sectionId;

  function choose(optionId) {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [current.key]: optionId }));
  }
  function setNumericValue(v) {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [current.key]: v }));
  }
  function setPlacements(next) {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [current.key]: next }));
  }
  function commit() {
    setChecked((prev) => ({ ...prev, [current.key]: true }));
  }

  function goNext() {
    if (!isLast) setIndex((i) => i + 1);
  }
  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function finish() {
    let correct = 0;
    const breakdown = questions.map((q) => {
      const base = { key: q.key, sectionTitle: q.sectionTitle, prompt: q.prompt };
      if (isNumeric(q)) {
        const raw = answers[q.key] ?? "";
        const isCorrect = numericIsCorrect(q, raw);
        if (isCorrect) correct += 1;
        return {
          ...base,
          type: "numeric",
          answer: q.answer,
          unit: q.unit ?? "",
          explanation: q.explanation,
          userValue: String(raw).trim(),
          attempted: String(raw).trim() !== "",
          isCorrect,
        };
      }
      if (isDnd(q)) {
        const placements = answers[q.key] ?? {};
        const isCorrect = dndIsCorrect(q, placements);
        if (isCorrect) correct += 1;
        return {
          ...base,
          type: "dnd",
          targets: q.targets,
          items: q.items,
          explanation: q.explanation ?? "",
          placements,
          attempted: Object.keys(placements).length > 0,
          isCorrect,
        };
      }
      const picked = answers[q.key] ?? null;
      const correctOpt = q.options.find((op) => op.correct);
      const isCorrect = picked === correctOpt.id;
      if (isCorrect) correct += 1;
      return {
        ...base,
        type: "choice",
        options: q.options,
        pickedId: picked,
        correctId: correctOpt.id,
        attempted: picked != null,
        isCorrect,
      };
    });
    onFinish({
      quizId: quiz.id,
      quizTitle: quiz.title,
      feedbackMode,
      total,
      correct,
      wrong: total - correct,
      durationMs: Date.now() - startedAt,
      breakdown,
    });
  }

  const pct = Math.round(((index + (revealed ? 1 : 0)) / total) * 100);
  const canAdvance = isImmediate ? committed : true;

  // gating for the manual-commit Check button
  const canCheck = numeric
    ? answer != null && String(answer).trim() !== ""
    : dnd
    ? dndAllPlaced(current, answer)
    : false;

  return (
    <div className="space-y-5">
      {/* header / progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{quiz.title}</h2>
            <p className="text-xs font-medium text-slate-500">
              {isImmediate ? "Instant feedback" : "Feedback at the end"} ·{" "}
              {answeredCount}/{total} answered
            </p>
          </div>
          <Button variant="outline" onClick={onExit} className="shrink-0">
            Exit
          </Button>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-indigo-600"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-right text-xs text-slate-400">
          Question {index + 1} of {total}
        </p>
      </div>

      {/* question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={spring}
        >
          <Card className="rounded-3xl shadow-lg">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {current.sectionTitle}
                </span>
                {numeric && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    calculation
                  </span>
                )}
                {dnd && (
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    drag &amp; drop
                  </span>
                )}
                {isFirstOfSection && (
                  <span className="text-xs font-medium text-slate-400">
                    new topic
                  </span>
                )}
              </div>

              <h3 className="whitespace-pre-line text-lg font-semibold leading-snug text-slate-900">
                {current.prompt}
              </h3>

              {numeric ? (
                <NumericBlock
                  q={current}
                  value={answer ?? ""}
                  revealed={revealed}
                  isImmediate={isImmediate}
                  onChange={setNumericValue}
                  onCheck={commit}
                />
              ) : dnd ? (
                <DndBlock
                  q={current}
                  placements={answer ?? {}}
                  revealed={revealed}
                  onChange={setPlacements}
                />
              ) : (
                <ChoiceBlock
                  q={current}
                  selectedId={answer}
                  revealed={revealed}
                  onChoose={choose}
                />
              )}

              {/* manual-commit Check button (numeric handles its own inline; dnd here) */}
              {dnd && isImmediate && !revealed && (
                <Button onClick={commit} disabled={!canCheck}>
                  Check answer
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* nav */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={goPrev} disabled={index === 0}>
          ← Back
        </Button>
        {isLast ? (
          <Button onClick={finish} disabled={!canAdvance}>
            Finish quiz
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!canAdvance}>
            Next →
          </Button>
        )}
      </div>

      {!canAdvance && (
        <p className="text-center text-xs text-slate-400">
          {numeric
            ? "Check your answer to continue."
            : dnd
            ? "Place every item, then Check to continue."
            : "Select an answer to continue."}
        </p>
      )}
    </div>
  );
}

// ── Choice ────────────────────────────────────────────────────────────────
function ChoiceBlock({ q, selectedId, revealed, onChoose }) {
  const correctOpt = q.options.find((op) => op.correct);
  return (
    <>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const picked = selectedId === opt.id;
          let tone =
            "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40";
          if (revealed) {
            if (opt.correct) tone = "border-emerald-400 bg-emerald-50";
            else if (picked) tone = "border-rose-400 bg-rose-50";
            else tone = "border-slate-200 bg-white opacity-70";
          } else if (picked) {
            tone = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200";
          }
          return (
            <div key={opt.id}>
              <button
                type="button"
                onClick={() => onChoose(opt.id)}
                disabled={revealed}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${tone} ${
                  revealed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    revealed && opt.correct
                      ? "bg-emerald-500 text-white"
                      : revealed && picked
                      ? "bg-rose-500 text-white"
                      : picked
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {revealed && opt.correct
                    ? "✓"
                    : revealed && picked
                    ? "✕"
                    : LETTER[i]}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {opt.text}
                </span>
              </button>

              <AnimatePresence>
                {revealed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`ml-9 mt-1.5 rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      opt.correct
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <strong>
                      {opt.correct ? "Why it's right: " : "Why it's wrong: "}
                    </strong>
                    {opt.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              selectedId === correctOpt.id
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {selectedId === correctOpt.id
              ? "Correct!"
              : `Not quite — the correct answer is ${correctOpt.id}.`}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Numeric ───────────────────────────────────────────────────────────────
function NumericBlock({ q, value, revealed, isImmediate, onChange, onCheck }) {
  const correct = revealed && numericIsCorrect(q, value);
  const fmtAnswer = `${q.answer}${q.unit ? ` ${q.unit}` : ""}`;
  return (
    <div className="space-y-3">
      {q.hint && !revealed && (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
          💡 <strong>Hint:</strong> {q.hint}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isImmediate) onCheck();
        }}
        className="flex flex-wrap items-center gap-2"
      >
        <div
          className={`flex items-center rounded-2xl border-2 px-4 py-3 transition-colors ${
            revealed
              ? correct
                ? "border-emerald-400 bg-emerald-50"
                : "border-rose-400 bg-rose-50"
              : "border-slate-200 bg-white focus-within:border-indigo-400"
          }`}
        >
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            disabled={revealed}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            className="w-40 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-default"
          />
          {q.unit && (
            <span className="ml-1 text-sm font-medium text-slate-400">
              {q.unit}
            </span>
          )}
        </div>
        {isImmediate && !revealed && (
          <Button
            type="submit"
            disabled={value == null || String(value).trim() === ""}
          >
            Check answer
          </Button>
        )}
      </form>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                correct
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {correct
                ? "Correct!"
                : `Not quite — the correct answer is ${fmtAnswer}.`}
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
              <strong>Solution: </strong>
              {q.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Drag & drop (matching items → targets) ─────────────────────────────────
function DndBlock({ q, placements, revealed, onChange }) {
  const [selected, setSelected] = useState(null); // tap-to-place fallback
  const [dragId, setDragId] = useState(null);

  const pool = q.items.filter((it) => placements[it.id] == null);
  const itemsIn = (targetId) =>
    q.items.filter((it) => placements[it.id] === targetId);

  function assign(itemId, targetId) {
    if (revealed || itemId == null) return;
    onChange({ ...placements, [itemId]: targetId });
    setSelected(null);
  }
  function unassign(itemId) {
    if (revealed) return;
    const next = { ...placements };
    delete next[itemId];
    onChange(next);
    setSelected(null);
  }
  function tapItem(itemId) {
    if (revealed) return;
    setSelected((s) => (s === itemId ? null : itemId));
  }

  const Token = ({ it, inTarget }) => {
    const ok = revealed && placements[it.id] === it.target;
    const bad = revealed && placements[it.id] != null && placements[it.id] !== it.target;
    let tone = "border-slate-200 bg-white hover:border-violet-300";
    if (selected === it.id) tone = "border-violet-500 bg-violet-50 ring-2 ring-violet-200";
    if (ok) tone = "border-emerald-400 bg-emerald-50";
    if (bad) tone = "border-rose-400 bg-rose-50";
    return (
      <button
        type="button"
        draggable={!revealed}
        onDragStart={() => setDragId(it.id)}
        onDragEnd={() => setDragId(null)}
        onClick={() => (inTarget ? unassign(it.id) : tapItem(it.id))}
        disabled={revealed}
        className={`rounded-xl border-2 px-3 py-1.5 text-sm font-medium text-slate-800 transition-colors ${tone} ${
          revealed ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        title={inTarget && !revealed ? "Click to send back to pool" : undefined}
      >
        {revealed && (ok ? "✓ " : bad ? "✕ " : "")}
        {it.text}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {!revealed && (
        <p className="text-xs text-slate-400">
          Drag each item into a group — or tap an item then tap a group. Click an
          item in a group to send it back.
        </p>
      )}

      {/* pool */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => dragId && unassign(dragId)}
        className="min-h-[3rem] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-3"
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Items
        </p>
        {pool.length === 0 ? (
          <p className="text-xs text-slate-400">All items placed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pool.map((it) => (
              <Token key={it.id} it={it} inTarget={false} />
            ))}
          </div>
        )}
      </div>

      {/* targets */}
      <div className="grid gap-3 sm:grid-cols-2">
        {q.targets.map((t) => (
          <div
            key={t.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => assign(dragId, t.id)}
            onClick={() => selected && assign(selected, t.id)}
            className={`rounded-2xl border-2 p-3 transition-colors ${
              selected && !revealed
                ? "border-violet-300 bg-violet-50/40"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="mb-2 text-sm font-semibold text-slate-700">{t.label}</p>
            <div className="flex min-h-[2rem] flex-wrap gap-2">
              {itemsIn(t.id).map((it) => (
                <Token key={it.id} it={it} inTarget />
              ))}
            </div>
          </div>
        ))}
      </div>

      {revealed && (
        <div className="space-y-2">
          <div
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              dndIsCorrect(q, placements)
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {dndIsCorrect(q, placements)
              ? "All placed correctly!"
              : "Some items are in the wrong group — see corrections below."}
          </div>
          <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
            {q.items.map((it) => {
              const ok = placements[it.id] === it.target;
              const correctTarget = q.targets.find((t) => t.id === it.target);
              return (
                <p key={it.id}>
                  <span className={ok ? "text-emerald-700" : "text-rose-700"}>
                    {ok ? "✓" : "✕"} <strong>{it.text}</strong>
                  </span>{" "}
                  → {correctTarget?.label}
                  {it.explanation ? ` — ${it.explanation}` : ""}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
