import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";

const LETTER = ["A", "B", "C", "D", "E", "F"];

function ScoreRing({ pct }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone =
    pct >= 80 ? "#059669" : pct >= 50 ? "#d97706" : "#e11d48";
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

/**
 * Final summary + per-question review (with explanations for every option).
 *
 * @param {object} result    The result object from QuizRunner.
 * @param {() => void} onRetry   Restart the same quiz.
 * @param {() => void} onHome    Back to the quiz hub.
 */
export function QuizResults({ result, onRetry, onHome }) {
  const [showReview, setShowReview] = useState(false);
  const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const minutes = Math.floor(result.durationMs / 60000);
  const seconds = Math.floor((result.durationMs % 60000) / 1000);

  const verdict =
    pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort — keep going." : "Worth another round.";

  return (
    <div className="space-y-5">
      {/* ── score card ── */}
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

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowReview((s) => !s)} variant="outline">
              {showReview ? "Hide review" : "Review answers"}
            </Button>
            <Button onClick={onRetry} variant="outline">
              Retry quiz
            </Button>
            <Button onClick={onHome}>Back to quizzes</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── full review ── */}
      {showReview && (
        <div className="space-y-4">
          {result.breakdown.map((q, qi) => (
            <Card key={q.key} className="rounded-2xl shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600">
                      {q.sectionTitle}
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
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
                    {q.isCorrect ? "Correct" : q.pickedId ? "Wrong" : "Skipped"}
                  </span>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const picked = q.pickedId === opt.id;
                    const showThis = opt.correct || picked;
                    let tone = "border-slate-200 bg-slate-50";
                    if (opt.correct) tone = "border-emerald-300 bg-emerald-50";
                    else if (picked) tone = "border-rose-300 bg-rose-50";
                    return (
                      <div
                        key={opt.id}
                        className={`rounded-xl border px-3 py-2 ${tone}`}
                      >
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
                              <em className="ml-1 text-xs text-slate-500">
                                (your answer)
                              </em>
                            )}
                          </span>
                        </div>
                        {showThis && (
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
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
