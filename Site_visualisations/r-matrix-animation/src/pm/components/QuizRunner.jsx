import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { flattenQuestions } from "../data/quizzes.js";

const spring = { type: "spring", stiffness: 260, damping: 24 };

const LETTER = ["A", "B", "C", "D", "E", "F"];

/**
 * Runs a quiz from start to finish.
 *
 * @param {object}   quiz          The quiz definition.
 * @param {"immediate"|"end"} feedbackMode  When to reveal correctness/explanations.
 * @param {(result) => void} onFinish  Called with the computed result.
 * @param {() => void} onExit       Abort and return to the hub.
 */
export function QuizRunner({ quiz, feedbackMode, onFinish, onExit }) {
  const questions = useMemo(() => flattenQuestions(quiz), [quiz]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionKey: optionId }
  const [startedAt] = useState(() => Date.now());

  const current = questions[index];
  const selectedId = answers[current.key];
  const isImmediate = feedbackMode === "immediate";
  // In immediate mode, an answered question is locked and reveals feedback.
  const revealed = isImmediate && selectedId != null;

  const answeredCount = Object.keys(answers).length;
  const isLast = index === total - 1;
  const isFirstOfSection =
    index === 0 || questions[index - 1].sectionId !== current.sectionId;

  function choose(optionId) {
    if (revealed) return; // locked once answered in immediate mode
    setAnswers((prev) => ({ ...prev, [current.key]: optionId }));
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
      const picked = answers[q.key] ?? null;
      const correctOpt = q.options.find((op) => op.correct);
      const isCorrect = picked === correctOpt.id;
      if (isCorrect) correct += 1;
      return {
        key: q.key,
        sectionTitle: q.sectionTitle,
        prompt: q.prompt,
        options: q.options,
        pickedId: picked,
        correctId: correctOpt.id,
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

  const correctOpt = current.options.find((op) => op.correct);
  const pct = Math.round(((index + (revealed ? 1 : 0)) / total) * 100);

  // can advance in immediate mode only after answering; in end mode always
  const canAdvance = isImmediate ? selectedId != null : true;

  return (
    <div className="space-y-5">
      {/* ── header / progress ── */}
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

      {/* ── question card ── */}
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
              {/* section chip */}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {current.sectionTitle}
                </span>
                {isFirstOfSection && (
                  <span className="text-xs font-medium text-slate-400">
                    new topic
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold leading-snug text-slate-900">
                {current.prompt}
              </h3>

              {/* options */}
              <div className="space-y-2.5">
                {current.options.map((opt, i) => {
                  const picked = selectedId === opt.id;
                  let tone =
                    "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40";
                  if (revealed) {
                    if (opt.correct)
                      tone = "border-emerald-400 bg-emerald-50";
                    else if (picked)
                      tone = "border-rose-400 bg-rose-50";
                    else tone = "border-slate-200 bg-white opacity-70";
                  } else if (picked) {
                    tone = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200";
                  }

                  return (
                    <div key={opt.id}>
                      <button
                        type="button"
                        onClick={() => choose(opt.id)}
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

                      {/* per-option explanation (immediate mode, after answering) */}
                      <AnimatePresence>
                        {revealed && (picked || opt.correct) && (
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

              {/* immediate-mode result banner */}
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
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* ── nav controls ── */}
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
          Select an answer to continue.
        </p>
      )}
    </div>
  );
}
