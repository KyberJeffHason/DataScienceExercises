import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";

const LETTER = ["A", "B", "C", "D", "E", "F", "G", "H"];

function ScoreRing({ pct }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = pct >= 80 ? "#059669" : pct >= 50 ? "#d97706" : "#e11d48";
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <motion.circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={tone}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * pct) / 100 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <text x="64" y="64" textAnchor="middle" dominantBaseline="central" className="rotate-90"
        transform="rotate(90 64 64)" fontSize="26" fontWeight="700" fill="#0f172a">
        {pct}%
      </text>
    </svg>
  );
}

/** What counts toward the score (handles legacy items without a grading model). */
function finalOf(q) {
  return q.finalCorrect !== undefined ? q.finalCorrect : q.isCorrect;
}

function wasAttempted(q) {
  if (q.attempted != null) return q.attempted;
  if (q.type === "numeric") return q.userValue !== "";
  if (q.type === "dnd" || q.type === "matrix")
    return q.placements && Object.keys(q.placements).length > 0;
  if (q.type === "multi") return (q.selected || []).length > 0;
  if (q.type === "text") return (q.userValue || "") !== "";
  if (q.type === "cloze")
    return q.userBlanks && Object.values(q.userBlanks).some((v) => String(v).trim() !== "");
  if (q.type === "recall") return q.typed !== "" || q.finalCorrect != null;
  return q.pickedId != null;
}

/**
 * Final summary + clickable question map + per-question review.
 *
 * @param {object} result       Result/attempt object (live or from history).
 * @param {() => void} [onRetry]  Restart the same quiz.
 * @param {() => void} onHome     Back to the hub.
 * @param {boolean} [fromHistory] Reviewing a past attempt.
 * @param {(r) => void} [onUpdateResult] Persist edits (manual overrides / self-grades).
 */
export function QuizResults({ result, onRetry, onHome, fromHistory = false, onUpdateResult }) {
  const [res, setRes] = useState(result);
  const [showReview, setShowReview] = useState(fromHistory);

  const pct = res.total ? Math.round((res.correct / res.total) * 100) : 0;
  const minutes = Math.floor(res.durationMs / 60000);
  const seconds = Math.floor((res.durationMs % 60000) / 1000);
  const hasBreakdown = Array.isArray(res.breakdown) && res.breakdown.length > 0;
  const ungraded = hasBreakdown
    ? res.breakdown.filter((q) => finalOf(q) == null).length
    : 0;

  const verdict = fromHistory
    ? "Past attempt"
    : ungraded > 0
    ? "Some answers need grading"
    : pct >= 80
    ? "Excellent work!"
    : pct >= 50
    ? "Good effort — keep going."
    : "Worth another round.";

  function jumpTo(qi) {
    setShowReview(true);
    setTimeout(() => {
      document.getElementById(`review-q-${qi}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  /** Apply a manual override / self-grade to question qi (value: true|false|null). */
  function setGrade(qi, value) {
    setRes((prev) => {
      const breakdown = prev.breakdown.map((b, i) => {
        if (i !== qi) return b;
        if (b.type === "recall") {
          return { ...b, manualCorrect: value, finalCorrect: value, isCorrect: value === true, gradingMode: "self" };
        }
        const finalCorrect = value != null ? value : b.autoCorrect ?? false;
        return {
          ...b,
          manualCorrect: value,
          finalCorrect,
          isCorrect: finalCorrect === true,
          gradingMode: value != null ? "manual" : "auto",
        };
      });
      const correct = breakdown.filter((b) => finalOf(b) === true).length;
      const next = { ...prev, breakdown, correct, wrong: prev.total - correct };
      onUpdateResult?.(next);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-3xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
            <ScoreRing pct={pct} />
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{verdict}</h2>
                <p className="text-sm text-slate-500">
                  {res.quizTitle} ·{" "}
                  {res.feedbackMode === "immediate" ? "instant feedback" : "feedback at the end"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Correct" value={res.correct} tone="text-emerald-600" />
                <Stat label="Wrong" value={res.wrong} tone="text-rose-600" />
                <Stat label="Time" value={`${minutes}:${String(seconds).padStart(2, "0")}`} tone="text-slate-700" />
              </div>
            </div>
          </div>

          {hasBreakdown && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Question map</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <LegendDot cls="bg-emerald-500" label="correct" />
                  <LegendDot cls="bg-rose-500" label="wrong" />
                  <LegendDot cls="bg-amber-400" label="needs grading" />
                  <LegendDot cls="bg-slate-300" label="skipped" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {res.breakdown.map((q, qi) => {
                  const fc = finalOf(q);
                  const cls =
                    fc === true
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : fc == null
                      ? "bg-amber-400 hover:bg-amber-500 text-white"
                      : wasAttempted(q)
                      ? "bg-rose-500 hover:bg-rose-600 text-white"
                      : "bg-slate-300 hover:bg-slate-400 text-slate-700";
                  return (
                    <button key={q.key} onClick={() => jumpTo(qi)} title={q.prompt}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${cls}`}>
                      {qi + 1}
                    </button>
                  );
                })}
              </div>
              {ungraded > 0 && (
                <p className="text-xs text-amber-600">
                  {ungraded} answer{ungraded > 1 ? "s" : ""} need self-grading in the review below.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {hasBreakdown && (
              <Button onClick={() => setShowReview((s) => !s)} variant="outline">
                {showReview ? "Hide review" : "Review answers"}
              </Button>
            )}
            {onRetry && (
              <Button onClick={onRetry} variant="outline">Retry quiz</Button>
            )}
            <Button onClick={onHome}>{fromHistory ? "Back to history" : "Back to quizzes"}</Button>
          </div>
        </CardContent>
      </Card>

      {showReview && hasBreakdown && (
        <div className="space-y-4">
          {res.breakdown.map((q, qi) => (
            <Card key={q.key} id={`review-q-${qi}`} className="scroll-mt-24 rounded-2xl shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600">{q.sectionTitle}</p>
                    <h3 className="mt-0.5 whitespace-pre-line text-sm font-semibold text-slate-900">
                      {qi + 1}. {q.prompt}
                    </h3>
                  </div>
                  <StatusBadge q={q} />
                </div>

                {q.error ? (
                  <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-mono text-xs text-amber-800">
                    {q.error}
                  </p>
                ) : q.type === "numeric" ? (
                  <NumericReview q={q} />
                ) : q.type === "dnd" ? (
                  <DndReview q={q} />
                ) : q.type === "multi" ? (
                  <MultiReview q={q} />
                ) : q.type === "text" ? (
                  <TextReview q={q} onGrade={(v) => setGrade(qi, v)} />
                ) : q.type === "cloze" ? (
                  <ClozeReview q={q} onGrade={(v) => setGrade(qi, v)} />
                ) : q.type === "matrix" ? (
                  <MatrixReview q={q} />
                ) : q.type === "recall" ? (
                  <RecallReview q={q} onGrade={(v) => setGrade(qi, v)} />
                ) : (
                  <ChoiceReview q={q} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── shared bits ─────────────────────────────────────────────────────────────
function StatusBadge({ q }) {
  const fc = finalOf(q);
  const label = fc === true ? "Correct" : fc == null ? "Needs grading" : wasAttempted(q) ? "Wrong" : "Skipped";
  const cls =
    fc === true ? "bg-emerald-100 text-emerald-700" : fc == null ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  const overridden = q.gradingMode === "manual" && q.autoCorrect != null && q.autoCorrect !== q.finalCorrect;
  const self = q.gradingMode === "self";
  return (
    <div className="shrink-0 text-right">
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{label}</span>
      {overridden && (
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          System: {q.autoCorrect ? "correct" : "incorrect"} · overridden
        </p>
      )}
      {self && fc != null && (
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Self-graded</p>
      )}
    </div>
  );
}

function OverrideControls({ q, onGrade }) {
  const isManual = q.gradingMode === "manual";
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
      <span className="text-xs font-medium text-slate-500">Override:</span>
      <button
        onClick={() => onGrade(true)}
        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
          q.finalCorrect === true ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-emerald-300"
        }`}
      >
        Mark correct
      </button>
      <button
        onClick={() => onGrade(false)}
        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
          q.finalCorrect === false ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600 hover:border-rose-300"
        }`}
      >
        Mark incorrect
      </button>
      {isManual && (
        <button onClick={() => onGrade(null)} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-600">
          Reset to system
        </button>
      )}
    </div>
  );
}

// ── per-type reviews ────────────────────────────────────────────────────────
function ChoiceReview({ q }) {
  return (
    <div className="space-y-2">
      {q.options.map((opt, i) => {
        const picked = q.pickedId === opt.id;
        let tone = "border-slate-200 bg-slate-50";
        if (opt.correct) tone = "border-emerald-300 bg-emerald-50";
        else if (picked) tone = "border-rose-300 bg-rose-50";
        return (
          <div key={opt.id} className={`rounded-xl border px-3 py-2 ${tone}`}>
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                opt.correct ? "bg-emerald-500 text-white" : picked ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                {opt.correct ? "✓" : picked ? "✕" : LETTER[i]}
              </span>
              <span className="text-sm text-slate-800">
                {opt.text}
                {picked && <em className="ml-1 text-xs text-slate-500">(your answer)</em>}
              </span>
            </div>
            <p className={`ml-7 mt-1 text-xs leading-relaxed ${opt.correct ? "text-emerald-800" : "text-rose-700"}`}>
              <strong>{opt.correct ? "Why it's right: " : "Why it's wrong: "}</strong>
              {opt.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function MultiReview({ q }) {
  const selected = q.selected || [];
  return (
    <div className="space-y-2">
      {q.options.map((opt, i) => {
        const picked = selected.includes(opt.id);
        let tone = "border-slate-200 bg-slate-50";
        if (opt.correct) tone = "border-emerald-300 bg-emerald-50";
        else if (picked) tone = "border-rose-300 bg-rose-50";
        return (
          <div key={opt.id} className={`rounded-xl border px-3 py-2 ${tone}`}>
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                opt.correct ? "bg-emerald-500 text-white" : picked ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                {opt.correct ? "✓" : picked ? "✕" : LETTER[i]}
              </span>
              <span className="text-sm text-slate-800">
                {opt.text}
                {picked && <em className="ml-1 text-xs text-slate-500">(selected)</em>}
              </span>
            </div>
            <p className={`ml-7 mt-1 text-xs leading-relaxed ${opt.correct ? "text-emerald-800" : "text-rose-700"}`}>
              <strong>{opt.correct ? "Correct choice: " : "Not correct: "}</strong>
              {opt.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NumericReview({ q }) {
  const attempted = q.userValue !== "";
  const fmtAnswer = `${q.answer}${q.unit ? ` ${q.unit}` : ""}`;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <AnswerChip label="Your answer" ok={q.isCorrect} value={attempted ? `${q.userValue}${q.unit ? ` ${q.unit}` : ""}` : "—"} />
        <AnswerChip label="Correct answer" ok value={fmtAnswer} />
      </div>
      <Solution text={q.explanation} />
    </div>
  );
}

function TextReview({ q, onGrade }) {
  const attempted = q.userValue !== "";
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <AnswerChip label="Your answer" ok={q.finalCorrect === true} value={attempted ? q.userValue : "—"} />
        <AnswerChip label="Accepted" ok value={q.answers.join(" · ")} />
      </div>
      {q.explanation && <Solution text={q.explanation} />}
      <OverrideControls q={q} onGrade={onGrade} />
    </div>
  );
}

function ClozeReview({ q, onGrade }) {
  return (
    <div className="space-y-2">
      <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700">
        {Object.keys(q.blanks).map((bid) => {
          const yours = q.userBlanks?.[bid];
          return (
            <p key={bid}>
              <strong>{bid}:</strong> <span className="text-slate-800">{yours || "—"}</span>
              <span className="text-slate-400"> · accepted: {q.blanks[bid].join(" · ")}</span>
            </p>
          );
        })}
      </div>
      {q.explanation && <Solution text={q.explanation} />}
      <OverrideControls q={q} onGrade={onGrade} />
    </div>
  );
}

function MatrixReview({ q }) {
  return (
    <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
      {q.items.map((it) => {
        const p = q.placements?.[it.id];
        const ok = p?.row === it.row && p?.col === it.column;
        const rowLbl = q.rows.find((r) => r.id === it.row)?.label;
        const colLbl = q.columns.find((c) => c.id === it.column)?.label;
        const yourRow = q.rows.find((r) => r.id === p?.row)?.label;
        const yourCol = q.columns.find((c) => c.id === p?.col)?.label;
        return (
          <p key={it.id} className={ok ? "text-emerald-700" : "text-rose-700"}>
            {ok ? "✓" : "✕"} <strong>{it.text}</strong> → {rowLbl} · {colLbl}
            {!ok && p ? <span className="text-slate-400"> (you: {yourRow} · {yourCol})</span> : ""}
            {!ok && !p ? <span className="text-slate-400"> (not placed)</span> : ""}
            {it.explanation ? <span className="text-slate-500"> — {it.explanation}</span> : ""}
          </p>
        );
      })}
    </div>
  );
}

function RecallReview({ q, onGrade }) {
  return (
    <div className="space-y-2">
      {q.typed ? (
        <AnswerChip label="Your recalled answer" ok={q.finalCorrect === true} value={q.typed} wide />
      ) : (
        <p className="text-xs text-slate-400">No typed answer recorded.</p>
      )}
      <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-500">Model answer</p>
        <p className="mt-1 whitespace-pre-line font-medium">{q.modelAnswer}</p>
        {q.explanation && <p className="mt-2 text-xs leading-relaxed text-slate-600">{q.explanation}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
        <span className="text-xs font-medium text-slate-500">Self-grade:</span>
        <button onClick={() => onGrade(true)}
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
            q.finalCorrect === true ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-emerald-300"}`}>
          I was correct
        </button>
        <button onClick={() => onGrade(false)}
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
            q.finalCorrect === false ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600 hover:border-rose-300"}`}>
          I was incorrect
        </button>
      </div>
    </div>
  );
}

function DndReview({ q }) {
  const labelOf = (tid) => q.targets.find((t) => t.id === tid)?.label ?? "—";
  return (
    <div className="space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700">
      {q.items.map((it) => {
        const placed = q.placements?.[it.id];
        const ok = placed === it.target;
        return (
          <p key={it.id} className={ok ? "text-emerald-700" : "text-rose-700"}>
            {ok ? "✓" : "✕"} <strong>{it.text}</strong> → {labelOf(it.target)}
            {!ok && placed ? ` (you chose ${labelOf(placed)})` : ""}
            {!ok && !placed ? " (not placed)" : ""}
            {it.explanation ? <span className="text-slate-500"> — {it.explanation}</span> : ""}
          </p>
        );
      })}
    </div>
  );
}

function AnswerChip({ label, ok, value, wide }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${wide ? "w-full" : ""} ${
      ok ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-700"}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</span>
      <p className="whitespace-pre-line font-bold">{value}</p>
    </div>
  );
}

function Solution({ text }) {
  return (
    <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
      <strong>Solution: </strong>
      {text}
    </p>
  );
}

function LegendDot({ cls, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />
      {label}
    </span>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
      <p className={`text-xl font-bold ${tone}`}>{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
