import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { flattenQuestions } from "../data/quizzes.js";
import {
  normalizeText,
  gradeMulti,
  gradeText,
  gradeCloze,
  gradeMatrix,
  parseCloze,
  buildGrading,
  validateQuestion,
} from "../grading.js";

const spring = { type: "spring", stiffness: 260, damping: 24 };
const LETTER = ["A", "B", "C", "D", "E", "F", "G", "H"];

/** Fisher–Yates shuffle returning a new array. */
function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Types that reveal feedback only after an explicit "Check" in immediate mode.
const CHECK_TYPES = new Set(["numeric", "dnd", "multi", "text", "cloze", "matrix"]);
// Types whose Check button lives below the answer block (numeric & text are inline).
const EXTERNAL_CHECK = new Set(["dnd", "multi", "cloze", "matrix"]);

const TYPE_CHIP = {
  numeric: { cls: "bg-amber-50 text-amber-700", label: "calculation" },
  dnd: { cls: "bg-violet-50 text-violet-700", label: "drag & drop" },
  multi: { cls: "bg-sky-50 text-sky-700", label: "multi-select" },
  text: { cls: "bg-teal-50 text-teal-700", label: "written" },
  cloze: { cls: "bg-cyan-50 text-cyan-700", label: "fill the blanks" },
  matrix: { cls: "bg-fuchsia-50 text-fuchsia-700", label: "grid" },
  recall: { cls: "bg-rose-50 text-rose-700", label: "active recall" },
};

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
function dndIsCorrect(q, placements = {}) {
  return q.items.every((it) => placements[it.id] === it.target);
}
function dndAllPlaced(q, placements = {}) {
  return q.items.every((it) => placements[it.id] != null);
}

/** True if the user has entered anything for this question. */
function hasAnswer(q, a) {
  switch (q.type) {
    case "numeric":
      return a != null && a !== "";
    case "multi":
      return Array.isArray(a) && a.length > 0;
    case "text":
      return a != null && String(a).trim() !== "";
    case "cloze":
      return a && Object.values(a).some((v) => String(v).trim() !== "");
    case "matrix":
    case "dnd":
      return a && Object.keys(a).length > 0;
    case "recall":
      return a && (a.selfCorrect != null || String(a.typed || "").trim() !== "");
    default:
      return a != null;
  }
}

// ── drop-zone hit-testing (shared by dnd + matrix) ──────────────────────────
const POOL_ZONE = "__pool";
function zoneAtPoint(x, y) {
  if (x == null || y == null) return null;
  const el = document.elementFromPoint(x, y);
  const zone = el?.closest("[data-dropzone]");
  return zone?.getAttribute("data-dropzone") ?? null;
}
function pointFrom(event, info) {
  const x = event?.clientX ?? info?.point?.x;
  const y = event?.clientY ?? info?.point?.y;
  return [x, y];
}

/**
 * Runs a quiz from start to finish. Question types:
 *  choice · numeric · dnd · multi · text · cloze · matrix · recall
 * Unknown/absent type ⇒ choice (legacy). See data/QUIZ_FORMAT.md.
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
      qs = qs.map((q) => (q.options ? { ...q, options: shuffled(q.options) } : q));
    return qs;
  }, [quiz, shuffleQuestions, shuffleAnswers]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // key -> per-type answer value
  const [checked, setChecked] = useState({}); // key -> true (locked)
  const [startedAt] = useState(() => Date.now());

  const current = questions[index];
  const type = current.type || "choice";
  const answer = answers[current.key];
  const isImmediate = feedbackMode === "immediate";
  const error = validateQuestion(current);

  const committed =
    type === "choice"
      ? answer != null
      : type === "recall"
      ? answer?.selfCorrect != null
      : !!checked[current.key];
  const revealed = !error && isImmediate && committed;

  const answeredCount = questions.filter((q) => hasAnswer(q, answers[q.key])).length;
  const isLast = index === total - 1;
  const isFirstOfSection =
    index === 0 || questions[index - 1].sectionId !== current.sectionId;

  const setAnswer = (value) =>
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  const commit = () => setChecked((prev) => ({ ...prev, [current.key]: true }));

  function goNext() {
    if (!isLast) setIndex((i) => i + 1);
  }
  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function finish() {
    let correct = 0;
    const breakdown = questions.map((q) => {
      const base = {
        key: q.key,
        sectionTitle: q.sectionTitle,
        prompt: q.prompt,
        explanation: q.explanation ?? "",
      };
      const qType = q.type || "choice";
      const a = answers[q.key];
      const err = validateQuestion(q);
      if (err) {
        const g = buildGrading({ type: qType, autoCorrect: false });
        return { ...base, type: qType, error: err, attempted: false, isCorrect: false, ...g };
      }

      let item;
      if (qType === "numeric") {
        const raw = a ?? "";
        const g = buildGrading({ type: qType, autoCorrect: numericIsCorrect(q, raw) });
        item = { ...base, type: qType, answer: q.answer, unit: q.unit ?? "", userValue: String(raw).trim(), ...g };
      } else if (qType === "multi") {
        const sel = Array.isArray(a) ? a : [];
        const g = buildGrading({ type: qType, autoCorrect: gradeMulti(q, sel) });
        item = { ...base, type: qType, options: q.options, selected: sel, ...g };
      } else if (qType === "text") {
        const val = String(a ?? "");
        const g = buildGrading({ type: qType, autoCorrect: gradeText(q, val) });
        item = { ...base, type: qType, answers: q.answers, userValue: val.trim(), ...g };
      } else if (qType === "cloze") {
        const map = a || {};
        const g = buildGrading({ type: qType, autoCorrect: gradeCloze(q, map) });
        item = { ...base, type: qType, blanks: q.blanks, userBlanks: map, ...g };
      } else if (qType === "matrix") {
        const placements = a || {};
        const g = buildGrading({ type: qType, autoCorrect: gradeMatrix(q, placements) });
        item = { ...base, type: qType, rows: q.rows, columns: q.columns, items: q.items, placements, ...g };
      } else if (qType === "dnd") {
        const placements = a || {};
        const g = buildGrading({ type: qType, autoCorrect: dndIsCorrect(q, placements) });
        item = { ...base, type: qType, targets: q.targets, items: q.items, placements, ...g };
      } else if (qType === "recall") {
        const selfCorrect = a?.selfCorrect ?? null;
        const g = buildGrading({ type: "recall", manualCorrect: selfCorrect });
        item = { ...base, type: qType, modelAnswer: q.modelAnswer, typed: String(a?.typed || ""), ...g };
      } else {
        const correctOpt = q.options.find((op) => op.correct);
        const g = buildGrading({ type: "choice", autoCorrect: a === correctOpt.id });
        item = { ...base, type: "choice", options: q.options, pickedId: a ?? null, correctId: correctOpt.id, ...g };
      }
      item.attempted = hasAnswer(q, a);
      if (item.finalCorrect === true) correct += 1;
      return item;
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
  const canAdvance = error || !isImmediate ? true : committed;

  // Check-button enablement per type
  const canCheck =
    type === "numeric"
      ? answer != null && String(answer).trim() !== ""
      : type === "dnd"
      ? dndAllPlaced(current, answer)
      : type === "multi"
      ? Array.isArray(answer) && answer.length > 0
      : type === "text"
      ? answer != null && String(answer).trim() !== ""
      : type === "cloze"
      ? parseCloze(current.prompt)
          .filter((p) => p.blank)
          .every((p) => String(answer?.[p.blank] || "").trim() !== "")
      : type === "matrix"
      ? current.items.every((it) => answer?.[it.id] != null)
      : false;

  const showExternalCheck =
    isImmediate && !revealed && !error && EXTERNAL_CHECK.has(type);

  const chip = TYPE_CHIP[type];

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
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {current.sectionTitle}
                </span>
                {chip && (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${chip.cls}`}>
                    {chip.label}
                  </span>
                )}
                {isFirstOfSection && (
                  <span className="text-xs font-medium text-slate-400">new topic</span>
                )}
              </div>

              {/* cloze renders its own prompt with inline inputs */}
              {type !== "cloze" && (
                <h3 className="whitespace-pre-line text-lg font-semibold leading-snug text-slate-900">
                  {current.prompt}
                </h3>
              )}

              {error ? (
                <QuestionError error={error} />
              ) : type === "numeric" ? (
                <NumericBlock q={current} value={answer ?? ""} revealed={revealed} isImmediate={isImmediate} onChange={setAnswer} onCheck={commit} />
              ) : type === "multi" ? (
                <MultiBlock q={current} selected={answer ?? []} revealed={revealed} onToggle={(id) => {
                  if (revealed) return;
                  const cur = Array.isArray(answer) ? answer : [];
                  setAnswer(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
                }} />
              ) : type === "text" ? (
                <TextBlock q={current} value={answer ?? ""} revealed={revealed} isImmediate={isImmediate} onChange={setAnswer} onCheck={commit} />
              ) : type === "cloze" ? (
                <ClozeBlock q={current} value={answer ?? {}} revealed={revealed} onChange={(bid, v) => setAnswer({ ...(answer || {}), [bid]: v })} />
              ) : type === "matrix" ? (
                <MatrixBlock q={current} placements={answer ?? {}} revealed={revealed} onChange={setAnswer} />
              ) : type === "dnd" ? (
                <DndBlock q={current} placements={answer ?? {}} revealed={revealed} onChange={setAnswer} />
              ) : type === "recall" ? (
                <RecallBlock
                  q={current}
                  value={answer ?? { typed: "", selfCorrect: null }}
                  isImmediate={isImmediate}
                  onType={(v) => setAnswer({ ...(answer || { selfCorrect: null }), typed: v })}
                  onSelfGrade={(val) => setAnswer({ ...(answer || { typed: "" }), selfCorrect: val })}
                />
              ) : (
                <ChoiceBlock q={current} selectedId={answer} revealed={revealed} onChoose={(id) => !revealed && setAnswer(id)} />
              )}

              {showExternalCheck && (
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
          {type === "recall"
            ? "Reveal the answer and self-grade to continue."
            : CHECK_TYPES.has(type)
            ? "Enter your answer, then Check to continue."
            : "Select an answer to continue."}
        </p>
      )}
    </div>
  );
}

// ── Malformed question fallback ─────────────────────────────────────────────
function QuestionError({ error }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong>This question can’t be displayed.</strong>
      <p className="mt-1 font-mono text-xs">{error}</p>
      <p className="mt-1 text-xs text-amber-700">You can skip it and continue.</p>
    </div>
  );
}

// ── Choice ──────────────────────────────────────────────────────────────────
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
                  {revealed && opt.correct ? "✓" : revealed && picked ? "✕" : LETTER[i]}
                </span>
                <span className="text-sm font-medium text-slate-800">{opt.text}</span>
              </button>
              <AnimatePresence>
                {revealed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`ml-9 mt-1.5 rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      opt.correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <strong>{opt.correct ? "Why it's right: " : "Why it's wrong: "}</strong>
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
              selectedId === correctOpt.id ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {selectedId === correctOpt.id ? "Correct!" : `Not quite — the correct answer is ${correctOpt.id}.`}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Multi ─────────────────────────────────────────────────────────────────
function MultiBlock({ q, selected, revealed, onToggle }) {
  const allCorrect = revealed && gradeMulti(q, selected);
  return (
    <>
      <p className="text-xs text-slate-400">Select all that apply.</p>
      <div className="space-y-2.5">
        {q.options.map((opt) => {
          const picked = selected.includes(opt.id);
          let tone = "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40";
          if (revealed) {
            if (opt.correct) tone = "border-emerald-400 bg-emerald-50";
            else if (picked) tone = "border-rose-400 bg-rose-50";
            else tone = "border-slate-200 bg-white opacity-70";
          } else if (picked) {
            tone = "border-sky-500 bg-sky-50 ring-2 ring-sky-200";
          }
          return (
            <div key={opt.id}>
              <button
                type="button"
                onClick={() => onToggle(opt.id)}
                disabled={revealed}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${tone} ${
                  revealed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold ${
                    revealed && opt.correct
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : revealed && picked
                      ? "border-rose-500 bg-rose-500 text-white"
                      : picked
                      ? "border-sky-600 bg-sky-600 text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  {revealed && opt.correct ? "✓" : revealed && picked ? "✕" : picked ? "✓" : "·"}
                </span>
                <span className="text-sm font-medium text-slate-800">{opt.text}</span>
              </button>
              <AnimatePresence>
                {revealed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`ml-9 mt-1.5 rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      opt.correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <strong>{opt.correct ? "Correct choice: " : "Not a correct choice: "}</strong>
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
              allCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {allCorrect ? "Correct — all right options, no wrong ones!" : "Not quite — the highlighted options are the correct set."}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Numeric ─────────────────────────────────────────────────────────────────
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
          {q.unit && <span className="ml-1 text-sm font-medium text-slate-400">{q.unit}</span>}
        </div>
        {isImmediate && !revealed && (
          <Button type="submit" disabled={value == null || String(value).trim() === ""}>
            Check answer
          </Button>
        )}
      </form>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
              {correct ? "Correct!" : `Not quite — the correct answer is ${fmtAnswer}.`}
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

// ── Text (short written answer) ─────────────────────────────────────────────
function TextBlock({ q, value, revealed, isImmediate, onChange, onCheck }) {
  const correct = revealed && gradeText(q, value);
  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isImmediate) onCheck();
        }}
        className="space-y-2"
      >
        <input
          type="text"
          autoComplete="off"
          value={value}
          disabled={revealed}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer…"
          className={`w-full rounded-2xl border-2 px-4 py-3 text-base font-medium text-slate-900 outline-none transition-colors placeholder:font-normal placeholder:text-slate-400 ${
            revealed
              ? correct
                ? "border-emerald-400 bg-emerald-50"
                : "border-rose-400 bg-rose-50"
              : "border-slate-200 bg-white focus:border-teal-400"
          }`}
        />
        {isImmediate && !revealed && (
          <Button type="submit" disabled={String(value).trim() === ""}>
            Check answer
          </Button>
        )}
      </form>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
              {correct ? "Correct!" : "Marked incorrect — you can override this in the review."}
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
              <p><strong>Accepted: </strong>{q.answers.join(" · ")}</p>
              {q.explanation && <p className="mt-1">{q.explanation}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Cloze (fill in the blanks) ──────────────────────────────────────────────
function ClozeBlock({ q, value, revealed, onChange }) {
  const parts = parseCloze(q.prompt);
  const correctBlank = (bid) =>
    revealed && textMatchesLocal(q.blanks[bid], value[bid], q);
  return (
    <div className="space-y-3">
      <p className="text-base leading-loose text-slate-900">
        {parts.map((p, i) =>
          p.text != null ? (
            <span key={i} className="whitespace-pre-line">{p.text}</span>
          ) : (
            <input
              key={i}
              type="text"
              autoComplete="off"
              value={value[p.blank] || ""}
              disabled={revealed}
              onChange={(e) => onChange(p.blank, e.target.value)}
              placeholder="…"
              className={`mx-1 inline-block w-40 rounded-lg border-2 px-2 py-1 text-sm font-semibold text-slate-900 outline-none transition-colors ${
                revealed
                  ? correctBlank(p.blank)
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-rose-400 bg-rose-50"
                  : "border-slate-300 bg-white focus:border-cyan-400"
              }`}
            />
          )
        )}
      </p>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
              {Object.keys(q.blanks).map((bid) => (
                <p key={bid}>
                  <strong>{bid}: </strong>
                  {q.blanks[bid].join(" · ")}
                </p>
              ))}
              {q.explanation && <p className="mt-1">{q.explanation}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function textMatchesLocal(accepted, val, q) {
  return (accepted || []).some(
    (a) =>
      normalizeText(a, { caseSensitive: q.caseSensitive, trim: q.trim }) ===
      normalizeText(val, { caseSensitive: q.caseSensitive, trim: q.trim })
  );
}

// ── Matrix (grid classification) ────────────────────────────────────────────
function cellKey(row, col) {
  return `cell:${row}:${col}`;
}
function MatrixBlock({ q, placements, revealed, onChange }) {
  const [selected, setSelected] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);

  const pool = q.items.filter((it) => placements[it.id] == null);
  const itemsInCell = (row, col) =>
    q.items.filter((it) => placements[it.id]?.row === row && placements[it.id]?.col === col);

  function assign(itemId, row, col) {
    if (revealed || itemId == null) return;
    onChange({ ...placements, [itemId]: { row, col } });
    setSelected(null);
  }
  function unassign(itemId) {
    if (revealed) return;
    const next = { ...placements };
    delete next[itemId];
    onChange(next);
    setSelected(null);
  }
  function tap(itemId, inCell) {
    if (revealed) return;
    if (inCell) unassign(itemId);
    else setSelected((s) => (s === itemId ? null : itemId));
  }
  function handleDragEnd(itemId, event, info) {
    const [x, y] = pointFrom(event, info);
    const z = zoneAtPoint(x, y);
    if (z === POOL_ZONE) unassign(itemId);
    else if (z?.startsWith("cell:")) {
      const [, row, col] = z.split(":");
      assign(itemId, row, col);
    }
    setDragId(null);
    setHoverZone(null);
  }
  function handleDrag(event, info) {
    const [x, y] = pointFrom(event, info);
    const z = zoneAtPoint(x, y);
    setHoverZone((prev) => (prev === z ? prev : z));
  }
  const stateOf = (it) =>
    revealed
      ? placements[it.id]?.row === it.row && placements[it.id]?.col === it.column
        ? "ok"
        : "bad"
      : null;

  return (
    <div className="space-y-4">
      {!revealed && (
        <p className="text-xs text-slate-400">
          Drag each item into the right cell — or tap an item then tap a cell. Tap a
          placed item to remove it.
        </p>
      )}

      {/* pool */}
      <div
        data-dropzone={POOL_ZONE}
        className={`min-h-[3rem] rounded-2xl border-2 border-dashed p-3 transition-colors ${
          dragId && hoverZone === POOL_ZONE ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-slate-50/60"
        }`}
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Items</p>
        {pool.length === 0 ? (
          <p className="text-xs text-slate-400">All items placed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pool.map((it) => (
              <DndToken key={it.id} it={it} disabled={revealed} selected={selected === it.id} dragging={dragId === it.id} revealedState={null} inTarget={false}
                onDragStart={(id) => { setDragId(id); setSelected(null); }} onDrag={handleDrag} onDragEnd={handleDragEnd} onTap={tap} />
            ))}
          </div>
        )}
      </div>

      {/* grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="w-28" />
              {q.columns.map((c) => (
                <th key={c.id} className="rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-600">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.rows.map((r) => (
              <tr key={r.id}>
                <th className="rounded-lg bg-slate-100 px-2 py-1.5 text-left text-xs font-semibold text-slate-600">
                  {r.label}
                </th>
                {q.columns.map((c) => {
                  const zone = cellKey(r.id, c.id);
                  const items = itemsInCell(r.id, c.id);
                  return (
                    <td
                      key={c.id}
                      data-dropzone={zone}
                      onClick={() => selected && assign(selected, r.id, c.id)}
                      className={`min-w-[7rem] rounded-lg border-2 p-1.5 align-top transition-colors ${
                        dragId && hoverZone === zone
                          ? "border-fuchsia-400 bg-fuchsia-50"
                          : selected && !revealed
                          ? "border-fuchsia-200 bg-fuchsia-50/40"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex min-h-[2rem] flex-wrap gap-1.5">
                        {items.map((it) => (
                          <DndToken key={it.id} it={it} disabled={revealed} selected={selected === it.id} dragging={dragId === it.id} revealedState={stateOf(it)} inTarget
                            onDragStart={(id) => { setDragId(id); setSelected(null); }} onDrag={handleDrag} onDragEnd={handleDragEnd} onTap={tap} />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {revealed && (
        <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
          {q.items.map((it) => {
            const p = placements[it.id];
            const ok = p?.row === it.row && p?.col === it.column;
            const rowLbl = q.rows.find((r) => r.id === it.row)?.label;
            const colLbl = q.columns.find((c) => c.id === it.column)?.label;
            return (
              <p key={it.id} className={ok ? "text-emerald-700" : "text-rose-700"}>
                {ok ? "✓" : "✕"} <strong>{it.text}</strong> → {rowLbl} · {colLbl}
                {it.explanation ? <span className="text-slate-500"> — {it.explanation}</span> : ""}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Drag & drop token (shared by dnd + matrix) ──────────────────────────────
function DndToken({ it, disabled, selected, dragging, revealedState, inTarget, onDragStart, onDrag, onDragEnd, onTap }) {
  let tone = "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm";
  if (selected) tone = "border-violet-500 bg-violet-50 ring-2 ring-violet-200";
  if (revealedState === "ok") tone = "border-emerald-400 bg-emerald-50";
  if (revealedState === "bad") tone = "border-rose-400 bg-rose-50";
  return (
    <motion.button
      type="button"
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.18}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileDrag={{ scale: 1.06, zIndex: 50, boxShadow: "0 14px 30px rgba(15,23,42,0.22)" }}
      onDragStart={() => onDragStart(it.id)}
      onDrag={onDrag}
      onDragEnd={(e, info) => onDragEnd(it.id, e, info)}
      onClick={() => onTap(it.id, inTarget)}
      disabled={disabled}
      className={`relative select-none touch-none rounded-xl border-2 px-3 py-1.5 text-sm font-medium text-slate-800 transition-[background-color,border-color,box-shadow] ${tone} ${
        disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      } ${dragging ? "pointer-events-none" : ""}`}
      title={inTarget && !disabled ? "Click to send back to pool" : undefined}
    >
      {revealedState === "ok" ? "✓ " : revealedState === "bad" ? "✕ " : ""}
      {it.text}
    </motion.button>
  );
}

// ── Drag & drop (matching items → targets) ──────────────────────────────────
function DndBlock({ q, placements, revealed, onChange }) {
  const [selected, setSelected] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);

  const pool = q.items.filter((it) => placements[it.id] == null);
  const itemsIn = (targetId) => q.items.filter((it) => placements[it.id] === targetId);

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
  function tap(itemId, inTarget) {
    if (revealed) return;
    if (inTarget) unassign(itemId);
    else setSelected((s) => (s === itemId ? null : itemId));
  }
  function handleDragStart(itemId) {
    setDragId(itemId);
    setSelected(null);
  }
  function handleDrag(event, info) {
    const [x, y] = pointFrom(event, info);
    const z = zoneAtPoint(x, y);
    setHoverZone((prev) => (prev === z ? prev : z));
  }
  function handleDragEnd(itemId, event, info) {
    const [x, y] = pointFrom(event, info);
    const z = zoneAtPoint(x, y);
    if (z === POOL_ZONE) unassign(itemId);
    else if (z) assign(itemId, z);
    setDragId(null);
    setHoverZone(null);
  }

  return (
    <div className="space-y-4">
      {!revealed && (
        <p className="text-xs text-slate-400">
          Drag each item into a group — or tap an item then tap a group. Tap an item in a group to send it back.
        </p>
      )}

      <div
        data-dropzone={POOL_ZONE}
        className={`min-h-[3rem] rounded-2xl border-2 border-dashed p-3 transition-colors ${
          dragId && hoverZone === POOL_ZONE ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-slate-50/60"
        }`}
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Items</p>
        {pool.length === 0 ? (
          <p className="text-xs text-slate-400">All items placed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pool.map((it) => (
              <DndToken key={it.id} it={it} disabled={revealed} selected={selected === it.id} dragging={dragId === it.id} revealedState={null} inTarget={false}
                onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd} onTap={tap} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {q.targets.map((t) => (
          <div
            key={t.id}
            data-dropzone={t.id}
            onClick={() => selected && assign(selected, t.id)}
            className={`rounded-2xl border-2 p-3 transition-colors ${
              dragId && hoverZone === t.id
                ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
                : selected && !revealed
                ? "border-violet-300 bg-violet-50/40"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="pointer-events-none mb-2 text-sm font-semibold text-slate-700">{t.label}</p>
            <div className="flex min-h-[2rem] flex-wrap gap-2">
              {itemsIn(t.id).map((it) => (
                <DndToken key={it.id} it={it} disabled={revealed} selected={selected === it.id} dragging={dragId === it.id}
                  revealedState={revealed ? (placements[it.id] === it.target ? "ok" : "bad") : null} inTarget
                  onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd} onTap={tap} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {revealed && (
        <div className="space-y-2">
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${dndIsCorrect(q, placements) ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
            {dndIsCorrect(q, placements) ? "All placed correctly!" : "Some items are in the wrong group — see corrections below."}
          </div>
          <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
            {q.items.map((it) => {
              const ok = placements[it.id] === it.target;
              const correctTarget = q.targets.find((t) => t.id === it.target);
              return (
                <p key={it.id}>
                  <span className={ok ? "text-emerald-700" : "text-rose-700"}>{ok ? "✓" : "✕"} <strong>{it.text}</strong></span>{" "}
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

// ── Recall (flashcard / self-graded) ────────────────────────────────────────
function RecallBlock({ q, value, isImmediate, onType, onSelfGrade }) {
  const [showModel, setShowModel] = useState(false);
  const graded = value.selfCorrect != null;

  // End mode: no reveal during the run — self-grading happens on the review screen.
  if (!isImmediate) {
    return (
      <div className="space-y-3">
        {q.allowTypedAnswer && (
          <textarea
            rows={3}
            value={value.typed || ""}
            onChange={(e) => onType(e.target.value)}
            placeholder="Write your answer from memory…"
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-300"
          />
        )}
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Try to recall the answer. You’ll reveal it and grade yourself on the results screen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {q.allowTypedAnswer && (
        <textarea
          rows={3}
          value={value.typed || ""}
          disabled={graded}
          onChange={(e) => onType(e.target.value)}
          placeholder="Write your answer from memory…"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-300 disabled:bg-slate-50"
        />
      )}

      {!showModel ? (
        <Button variant="outline" onClick={() => setShowModel(true)}>
          Reveal answer
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-500">Model answer</p>
            <p className="mt-1 whitespace-pre-line font-medium">{q.modelAnswer}</p>
            {q.explanation && <p className="mt-2 text-xs leading-relaxed text-slate-600">{q.explanation}</p>}
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-500">How did you do?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSelfGrade(true)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  value.selfCorrect === true ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-emerald-300"
                }`}
              >
                ✓ I was correct
              </button>
              <button
                type="button"
                onClick={() => onSelfGrade(false)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  value.selfCorrect === false ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600 hover:border-rose-300"
                }`}
              >
                ✕ I was incorrect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
