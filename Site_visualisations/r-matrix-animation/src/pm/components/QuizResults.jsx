import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";

const LETTER = ["A", "B", "C", "D", "E", "F"];

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
      <text
        x="64"
        y="64"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90"
        transform="rotate(90 64 64)"
        fontSize="26"
        fontWeight="700"
        fill="#0f172a"
      >
        {pct}%
      </text>
    </svg>
  );
}

/** True if the user actually put an answer in (works for every type). */
function wasAttempted(q) {
  if (q.attempted != null) return q.attempted;
  if (q.type === "numeric") return q.userValue !== "";
  if (q.type === "dnd") return q.placements && Object.keys(q.placements).length > 0;
  return q.pickedId != null;
}

/**
 * Final summary + clickable question map + per-question review.
 *
 * @param {object} result       Result/attempt object (live or from history).
 * @param {() => void} [onRetry]  Restart the same quiz (omitted for history review).
 * @param {() => void} onHome     Back to the hub.
 * @param {boolean} [fromHistory] Tweaks copy/actions when reviewing a past attempt.
 */
export function QuizResults({ result, onRetry, onHome, fromHistory = false }) {
  const [showReview, setShowReview] = useState(fromHistory);
  const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const minutes = Math.floor(result.durationMs / 60000);
  const seconds = Math.floor((result.durationMs % 60000) / 1000);
  const hasBreakdown = Array.isArray(result.breakdown) && result.breakdown.length > 0;

  const verdict = fromHistory
    ? "Past attempt"
    : pct >= 80
    ? "Excellent work!"
    : pct >= 50
    ? "Good effort — keep going."
    : "Worth another round.";

  function jumpTo(qi) {
    setShowReview(true);
    setTimeout(() => {
      const el = document.getElementById(`review-q-${qi}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  return (
    <div className="space-y-5">
      {/* score card */}
      <Card className="rounded-3xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
            <ScoreRing pct={pct} />
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{verdict}</h2>
                <p className="text-sm text-slate-500">
                  {result.quizTitle} ·{" "}
                  {result.feedbackMode === "immediate"
                    ? "instant feedback"
                    : "feedback at the end"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Correct" value={result.correct} tone="text-emerald-600" />
                <Stat label="Wrong" value={result.wrong} tone="text-rose-600" />
                <Stat
                  label="Time"
                  value={`${minutes}:${String(seconds).padStart(2, "0")}`}
                  tone="text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* clickable question map */}
          {hasBreakdown && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Question map
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <LegendDot cls="bg-emerald-500" label="correct" />
                  <LegendDot cls="bg-rose-500" label="wrong" />
                  <LegendDot cls="bg-slate-300" label="skipped" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.breakdown.map((q, qi) => {
                  const attempted = wasAttempted(q);
                  const cls = q.isCorrect
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : attempted
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-slate-300 hover:bg-slate-400 text-slate-700";
                  return (
                    <button
                      key={q.key}
                      onClick={() => jumpTo(qi)}
                      title={q.prompt}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${cls}`}
                    >
                      {qi + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {hasBreakdown && (
              <Button onClick={() => setShowReview((s) => !s)} variant="outline">
                {showReview ? "Hide review" : "Review answers"}
              </Button>
            )}
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Retry quiz
              </Button>
            )}
            <Button onClick={onHome}>
              {fromHistory ? "Back to history" : "Back to quizzes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* full review */}
      {showReview && hasBreakdown && (
        <div className="space-y-4">
          {result.breakdown.map((q, qi) => (
            <Card
              key={q.key}
              id={`review-q-${qi}`}
              className="scroll-mt-24 rounded-2xl shadow-sm"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600">
                      {q.sectionTitle}
                    </p>
                    <h3 className="mt-0.5 whitespace-pre-line text-sm font-semibold text-slate-900">
                      {qi + 1}. {q.prompt}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      q.isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {q.isCorrect ? "Correct" : wasAttempted(q) ? "Wrong" : "Skipped"}
                  </span>
                </div>

                {q.type === "numeric" ? (
                  <NumericReview q={q} />
                ) : q.type === "dnd" ? (
                  <DndReview q={q} />
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
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  opt.correct
                    ? "bg-emerald-500 text-white"
                    : picked
                    ? "bg-rose-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {opt.correct ? "✓" : picked ? "✕" : LETTER[i]}
              </span>
              <span className="text-sm text-slate-800">
                {opt.text}
                {picked && (
                  <em className="ml-1 text-xs text-slate-500">(your answer)</em>
                )}
              </span>
            </div>
            <p
              className={`ml-7 mt-1 text-xs leading-relaxed ${
                opt.correct ? "text-emerald-800" : "text-rose-700"
              }`}
            >
              <strong>
                {opt.correct ? "Why it's right: " : "Why it's wrong: "}
              </strong>
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
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${
            q.isCorrect
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-rose-300 bg-rose-50 text-rose-700"
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            Your answer
          </span>
          <p className="font-bold">
            {attempted ? `${q.userValue}${q.unit ? ` ${q.unit}` : ""}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            Correct answer
          </span>
          <p className="font-bold">{fmtAnswer}</p>
        </div>
      </div>
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
        <strong>Solution: </strong>
        {q.explanation}
      </p>
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
            {it.explanation ? (
              <span className="text-slate-500"> — {it.explanation}</span>
            ) : null}
          </p>
        );
      })}
    </div>
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
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}
