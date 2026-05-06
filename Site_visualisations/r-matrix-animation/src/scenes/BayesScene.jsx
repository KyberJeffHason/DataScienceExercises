import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

// ─── fixed numbers for the scenario ──────────────────────────────────────────
// Population of 10,000 makes every number a whole integer — easy to follow.
const POP        = 10_000;
const ILL        = 100;     // 1%   of population
const HEALTHY    = 9_900;   // 99%
const TRUE_POS   = 99;      // 99%  of ill  → positive (sensitivity)
const FALSE_NEG  = 1;       // 1%   of ill  → negative
const FALSE_POS  = 198;     // 2%   of healthy → positive (1 − specificity = 1 − 0.98)
const TRUE_NEG   = 9_702;   // 98%  of healthy → negative
const TOTAL_POS  = TRUE_POS + FALSE_POS;   // 297
const PCT_ANSWER = ((TRUE_POS / TOTAL_POS) * 100).toFixed(1); // "33.3"

const TOTAL_STEPS = 5;
const spring = { type: "spring", stiffness: 260, damping: 22 };

// ─── step descriptions shown in the banner ───────────────────────────────────
const STEP_LABELS = [
  "Start with 10,000 people. 100 are ill (1%) and 9,900 are healthy (99%).",
  "Test the 100 ill people. 99 test positive ✓ and 1 tests negative ✗.",
  "Test the 9,900 healthy people. 198 test positive ✗ and 9,702 test negative ✓.",
  "Zoom in on everyone who tested positive: 99 + 198 = 297 people. Most are healthy!",
  `Only 99 of those 297 positives are truly ill → ${PCT_ANSWER}% chance you are actually ill.`,
];

// ─── tree box ────────────────────────────────────────────────────────────────
function TreeBox({ show, count, label, sublabel, bg, border, ring }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={spring}
          className={`rounded-2xl border-2 ${border} ${bg} p-3 text-center ${
            ring ? "ring-4 ring-violet-400 ring-offset-1" : ""
          }`}
        >
          <p className="font-mono text-xl font-bold">{count.toLocaleString()}</p>
          <p className="text-xs font-semibold text-slate-700 leading-tight">{label}</p>
          {sublabel && (
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{sublabel}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── connector arrows between tree levels ────────────────────────────────────
function Connectors({ show, left, right }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-around text-xs font-semibold text-slate-400"
    >
      <span>{left}</span>
      <span>{right}</span>
    </motion.div>
  );
}

// ─── horizontal stacked bar ───────────────────────────────────────────────────
function StackedBar({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold text-slate-700">
            All <span className="font-mono font-bold">{TOTAL_POS}</span> people who tested positive:
          </p>

          <div className="flex h-12 overflow-hidden rounded-xl shadow-sm">
            <motion.div
              initial={{ flex: 0 }}
              animate={{ flex: TRUE_POS }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="flex items-center justify-center bg-red-500 text-white text-xs font-bold"
            >
              {TRUE_POS} truly ill
            </motion.div>
            <motion.div
              initial={{ flex: 0 }}
              animate={{ flex: FALSE_POS }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="flex items-center justify-center bg-amber-300 text-amber-900 text-xs font-bold"
            >
              {FALSE_POS} healthy
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
              Truly ill (true positive)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-amber-300 flex-shrink-0" />
              Healthy but got a positive result (false positive)
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── answer + Bayes formula ───────────────────────────────────────────────────
function AnswerBox({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 space-y-4"
        >
          <h2 className="text-lg font-bold text-emerald-900">
            ✅ P(actually ill | positive test) ≈ {PCT_ANSWER}%
          </h2>
          <p className="text-sm text-emerald-800">
            Even though the test correctly catches <strong>99%</strong> of ill people,
            only about <strong>1 in 3</strong> people who test positive are truly ill.
            Why? Because the disease is rare — there are so many healthy people that
            even a small false-positive rate (2%) creates far more wrong positives
            than the disease itself produces.
          </p>

          {/* Bayes formula */}
          <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bayes' Theorem — the formula behind this
            </p>

            {/* general form */}
            <div className="text-sm font-mono text-slate-600 space-y-1">
              <p className="font-semibold text-slate-400 text-xs">General form:</p>
              <div className="flex flex-wrap items-center gap-2">
                <span>P(ill | +) =</span>
                <div className="inline-flex flex-col items-center">
                  <span>P(+ | ill) × P(ill)</span>
                  <div className="w-full border-t border-slate-400 my-0.5" />
                  <span>P(+ | ill) × P(ill) + P(+ | healthy) × P(healthy)</span>
                </div>
              </div>
            </div>

            {/* plugged in */}
            <div className="text-sm font-mono text-violet-700 font-semibold space-y-1">
              <p className="font-semibold text-slate-400 text-xs">Plugging in our numbers:</p>
              <div className="flex flex-wrap items-center gap-2">
                <span>P(ill | +) =</span>
                <div className="inline-flex flex-col items-center">
                  <span>0.99 × 0.01</span>
                  <div className="w-full border-t border-violet-400 my-0.5" />
                  <span>0.99 × 0.01 + 0.02 × 0.99</span>
                </div>
                <span>=</span>
                <div className="inline-flex flex-col items-center">
                  <span>0.0099</span>
                  <div className="w-full border-t border-violet-400 my-0.5" />
                  <span>0.0297</span>
                </div>
                <span>≈ <strong className="text-2xl">33.3%</strong></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── multiple choice options ──────────────────────────────────────────────────
const OPTIONS = ["99%", "98%", "approx. 95%", "approx. 33%", "approx. 5%", "2%", "1%"];
const CORRECT = 3; // index of correct option

// ─── main scene ───────────────────────────────────────────────────────────────
export function BayesScene() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const showLevel1   = step >= 0;
  const showLevel2   = step >= 1;
  const showHealthy  = step >= 2;
  const highlightPos = step >= 3;
  const showBar      = step >= 3;
  const showAnswer   = step >= 4;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL_STEPS - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 1600);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <>
      {/* ── page header ── */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Bayes' Theorem</h1>
        <p className="mt-2 text-slate-600">
          Why a positive medical test doesn't mean what you think — and how to calculate the real probability.
        </p>
      </div>

      {/* ── scenario card ── */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 space-y-3">
        <h2 className="font-bold text-amber-900 text-base">🏥 The scenario (from your slides)</h2>
        <ul className="text-sm text-amber-800 space-y-1 list-none">
          <li>📊 A <strong>rare disease</strong> affects <strong>1%</strong> of the population (no obvious symptoms).</li>
          <li>🔴 The test is <strong>positive for 99%</strong> of ill people — <em>sensitivity = 99%</em>.</li>
          <li>🟢 The test is <strong>negative for 98%</strong> of healthy people — <em>specificity = 98%</em>.</li>
        </ul>

        <p className="font-bold text-amber-900 pt-1">
          ❓ You tested positive. How likely is it that you are actually ill?
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {OPTIONS.map((opt, i) => (
            <span
              key={i}
              className={`rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
                showAnswer && i === CORRECT
                  ? "border-emerald-400 bg-emerald-100 text-emerald-800 font-bold ring-2 ring-emerald-300"
                  : "border-amber-200 bg-white text-amber-800"
              }`}
            >
              {i + 1}) {opt}
              {showAnswer && i === CORRECT && " ✓"}
            </span>
          ))}
        </div>
      </div>

      {/* ── main animated card ── */}
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">

          {/* controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Step through the reasoning:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setPlaying((p) => !p)}
                disabled={step >= TOTAL_STEPS - 1 && !playing}
                variant="outline"
              >
                {playing ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={() => { setStep((s) => Math.max(-1, s - 1)); setPlaying(false); }}
                disabled={step < 0}
                variant="outline"
              >
                ← Back
              </Button>
              <Button
                onClick={() => { setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1)); setPlaying(false); }}
                disabled={step >= TOTAL_STEPS - 1}
                variant="outline"
              >
                Next →
              </Button>
              <Button onClick={() => { setStep(-1); setPlaying(false); }} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {/* progress bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: i <= step ? "rgb(15,23,42)" : "rgb(226,232,240)" }}
                transition={{ duration: 0.2 }}
                className="h-2 flex-1 rounded-full"
              />
            ))}
            <span className="ml-2 text-xs text-slate-400 whitespace-nowrap">
              {step < 0 ? "not started" : `${step + 1} / ${TOTAL_STEPS}`}
            </span>
          </div>

          {/* step banner */}
          <AnimatePresence mode="wait">
            {step >= 0 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {STEP_LABELS[step]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── tree diagram ── */}
          <div className="rounded-3xl bg-slate-100 p-5 space-y-3">

            {/* L0 — population */}
            <div className="flex justify-center">
              <div className="w-56">
                <TreeBox
                  show
                  count={POP}
                  label="Total population"
                  sublabel="our imaginary group of 10,000"
                  bg="bg-slate-200"
                  border="border-slate-400"
                />
              </div>
            </div>

            <Connectors show={showLevel1} left="1% are ill ↙" right="↘ 99% are healthy" />

            {/* L1 — ill / healthy */}
            <div className="grid grid-cols-2 gap-4">
              <TreeBox
                show={showLevel1}
                count={ILL}
                label="Ill"
                sublabel="100 people (1%)"
                bg="bg-red-100"
                border="border-red-300"
              />
              <TreeBox
                show={showLevel1}
                count={HEALTHY}
                label="Healthy"
                sublabel="9,900 people (99%)"
                bg="bg-slate-100"
                border="border-slate-300"
              />
            </div>

            {/* connectors row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <Connectors show={showLevel2}   left="99% test + ↙" right="↘ 1% test −" />
              <Connectors show={showHealthy}  left="2% test + ↙"  right="↘ 98% test −" />
            </div>

            {/* L2 — test results */}
            <div className="grid grid-cols-4 gap-2">
              <TreeBox
                show={showLevel2}
                count={TRUE_POS}
                label="Test +"
                sublabel="true positive"
                bg={highlightPos ? "bg-violet-200" : "bg-red-200"}
                border={highlightPos ? "border-violet-500" : "border-red-400"}
                ring={highlightPos}
              />
              <TreeBox
                show={showLevel2}
                count={FALSE_NEG}
                label="Test −"
                sublabel="false negative"
                bg="bg-red-50"
                border="border-red-200"
              />
              <TreeBox
                show={showHealthy}
                count={FALSE_POS}
                label="Test +"
                sublabel="false positive"
                bg={highlightPos ? "bg-violet-200" : "bg-amber-100"}
                border={highlightPos ? "border-violet-500" : "border-amber-300"}
                ring={highlightPos}
              />
              <TreeBox
                show={showHealthy}
                count={TRUE_NEG}
                label="Test −"
                sublabel="true negative"
                bg="bg-slate-100"
                border="border-slate-300"
              />
            </div>

            {/* highlight label */}
            <AnimatePresence>
              {highlightPos && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm font-semibold text-violet-700"
                >
                  These two purple boxes are everyone who tested positive: {TRUE_POS} + {FALSE_POS} = {TOTAL_POS} people
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* stacked bar */}
          <StackedBar show={showBar} />

          {/* answer + formula */}
          <AnswerBox show={showAnswer} />

          {/* R code */}
          <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner whitespace-pre">{`# Define the probabilities
p_ill      <- 0.01   # 1%  of population is ill
p_healthy  <- 0.99   # 99% are healthy
p_pos_ill  <- 0.99   # sensitivity  (P(+ | ill))
p_pos_hlth <- 0.02   # false-positive rate  (P(+ | healthy))

# Bayes' theorem: P(ill | positive test)
numerator   <- p_pos_ill * p_ill
denominator <- p_pos_ill * p_ill + p_pos_hlth * p_healthy

p_ill_given_pos <- numerator / denominator
cat(round(p_ill_given_pos * 100, 1), "%")
#> 33.3 %

# ─── Natural frequency version (same answer, easier to see) ────────────────
# Out of 10,000 people:
true_pos  <- 10000 * p_ill     * p_pos_ill   # 99  (truly ill, test +)
false_pos <- 10000 * p_healthy * p_pos_hlth  # 198 (healthy,   test +)

true_pos / (true_pos + false_pos)
#> [1] 0.3333...`}
          </pre>
        </CardContent>
      </Card>

      {/* ── key idea ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-lg font-bold">The key idea — base rate neglect</h2>
        <p className="text-slate-600 text-sm">
          Our gut says <em>"the test is 99% accurate, so I must be 99% likely to be ill."</em> That ignores how rare the disease is. Because only 1 in 100 people are ill, there are vastly more healthy people to generate false positives from — and those swamp the true positives.
        </p>
        <p className="text-slate-600 text-sm">
          <strong>Bayes' theorem</strong> is the maths that correctly combines two pieces of information: the accuracy of the test <em>and</em> how common the disease is in the first place (the <em>prior probability</em> or base rate).
        </p>

        {/* compact legend */}
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          {[
            { term: "True Positive (TP)", desc: "Ill person, test says positive — correct alarm.", color: "bg-red-100 border-red-300" },
            { term: "False Positive (FP)", desc: "Healthy person, test says positive — false alarm.", color: "bg-amber-100 border-amber-300" },
            { term: "True Negative (TN)", desc: "Healthy person, test says negative — correct clear.", color: "bg-slate-100 border-slate-300" },
            { term: "False Negative (FN)", desc: "Ill person, test says negative — missed case.", color: "bg-red-50 border-red-200" },
          ].map(({ term, desc, color }) => (
            <div key={term} className={`rounded-xl border p-3 ${color}`}>
              <p className="font-semibold text-slate-800">{term}</p>
              <p className="text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
