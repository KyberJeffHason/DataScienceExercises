import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

// ─── shared item data ─────────────────────────────────────────────────────────
const ITEMS = ["A", "B", "C", "D"];
const COLORS = [
  { bg: "bg-violet-500", text: "text-white", light: "bg-violet-100", ltext: "text-violet-700" },
  { bg: "bg-sky-500",    text: "text-white", light: "bg-sky-100",    ltext: "text-sky-700"    },
  { bg: "bg-emerald-500",text: "text-white", light: "bg-emerald-100",ltext: "text-emerald-700"},
  { bg: "bg-amber-500",  text: "text-white", light: "bg-amber-100",  ltext: "text-amber-700"  },
];

// All C(4,2)=6 pairs for the combinations animation
const COMBO_PAIRS = [];
for (let i = 0; i < 4; i++)
  for (let j = i + 1; j < 4; j++)
    COMBO_PAIRS.push([i, j]);

const spring = { type: "spring", stiffness: 260, damping: 20 };

// ─── reusable item badge ──────────────────────────────────────────────────────
function ItemBadge({ idx, active, dim, size = "md" }) {
  const c = COLORS[idx];
  const sz = size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-base";
  return (
    <motion.div
      animate={{ opacity: dim ? 0.25 : 1, scale: active ? 1.15 : 1 }}
      transition={spring}
      className={`${sz} rounded-xl flex items-center justify-center font-bold shadow-sm ${
        active ? `${c.bg} ${c.text}` : dim ? "bg-slate-200 text-slate-400" : `${c.light} ${c.ltext}`
      }`}
    >
      {ITEMS[idx]}
    </motion.div>
  );
}

// ─── formula display (fraction or linear) ────────────────────────────────────
function MathFormula({ formula }) {
  if (formula.type === "linear") {
    return (
      <p className="text-center font-mono text-lg font-bold text-slate-800 py-2">
        {formula.expr}
      </p>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-2 font-mono font-bold text-slate-800">
      <span className="text-lg">{formula.lhs} =</span>
      <div className="flex flex-col items-center leading-tight">
        <span className="text-base">{formula.top}</span>
        <div className="w-full border-t-2 border-slate-800 my-1" />
        <span className="text-base">{formula.bottom}</span>
      </div>
    </div>
  );
}

// ─── running multiply bar ─────────────────────────────────────────────────────
function MultiplyBar({ factors, activeIdx }) {
  const running = factors.slice(0, activeIdx + 1).reduce((a, b) => a * b, 1);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
        Running total
      </p>
      {activeIdx < 0 ? (
        <p className="text-sm text-slate-400">Press Play or Next →</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
          {factors.slice(0, activeIdx + 1).map((f, i) => (
            <React.Fragment key={i}>
              <span
                className={`rounded-lg px-2 py-1 font-bold ${
                  i === activeIdx ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {f}
              </span>
              {i < activeIdx && <span className="text-slate-400">×</span>}
            </React.Fragment>
          ))}
          <span className="text-slate-400 ml-1">=</span>
          <span className="rounded-lg bg-violet-600 px-2 py-1 font-bold text-white ml-1">
            {running}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── FACTORIAL visualisation (4 slots on a shelf) ────────────────────────────
// step 0‥3: fill slot 0‥3, choices = [4,3,2,1]
const FACT_PICKS = [0, 1, 2, 3];
const FACT_CHOICES = [4, 3, 2, 1];

function FactorialViz({ step }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Books (4 total)
        </p>
        <div className="flex gap-2">
          {ITEMS.map((_, i) => (
            <ItemBadge key={i} idx={i} active={i === step} dim={i < step} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Shelf positions (left → right)
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => {
            const filled = i < step;
            const current = i === step;
            const c = COLORS[FACT_PICKS[i]];
            return (
              <motion.div
                key={i}
                animate={{ scale: current ? 1.1 : 1 }}
                transition={spring}
                className={`h-11 w-11 rounded-xl border-2 flex items-center justify-center font-bold text-base ${
                  filled
                    ? `${c.bg} ${c.text} border-transparent shadow-sm`
                    : current
                    ? "border-dashed border-violet-400 bg-violet-50 text-violet-400"
                    : "border-dashed border-slate-300 bg-slate-50 text-slate-300"
                }`}
              >
                {filled ? ITEMS[FACT_PICKS[i]] : current ? "→" : "·"}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Choices at each position
        </p>
        <div className="flex gap-2 flex-wrap text-sm font-mono">
          {FACT_CHOICES.map((c, i) => (
            <span
              key={i}
              className={`rounded-lg px-2 py-1 ${
                i < step
                  ? "bg-slate-100 text-slate-500"
                  : i === step
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-50 text-slate-300"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <MultiplyBar factors={FACT_CHOICES} activeIdx={step} />
    </div>
  );
}

// ─── PERMUTATIONS visualisation (4 runners → gold & silver) ──────────────────
// step 0: pick gold (4 choices), step 1: pick silver (3 left)
const PERM_PICKS = [0, 2]; // A wins gold, C wins silver
const PERM_MEDALS = ["🥇 Gold", "🥈 Silver"];
const PERM_CHOICES = [4, 3];

function PermutationsViz({ step }) {
  const usedIdxs = PERM_PICKS.slice(0, Math.max(0, step));

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Runners (4 total)
        </p>
        <div className="flex gap-2">
          {ITEMS.map((_, i) => (
            <ItemBadge
              key={i}
              idx={i}
              active={step >= 0 && PERM_PICKS[step] === i}
              dim={usedIdxs.includes(i)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Podium</p>
        <div className="flex gap-3">
          {PERM_MEDALS.map((medal, i) => {
            const filled = i < step;
            const current = i === step;
            const c = COLORS[PERM_PICKS[i]];
            return (
              <div
                key={i}
                className={`flex-1 rounded-2xl border-2 p-3 text-center transition-colors ${
                  filled
                    ? `border-transparent ${c.bg}`
                    : current
                    ? "border-dashed border-violet-400 bg-violet-50"
                    : "border-dashed border-slate-200 bg-slate-50"
                }`}
              >
                <p className={`text-xs mb-1 ${filled ? "text-white/80" : "text-slate-400"}`}>
                  {medal}
                </p>
                <motion.p
                  animate={{ scale: current ? 1.1 : 1 }}
                  className={`font-bold text-xl font-mono ${
                    filled ? "text-white" : current ? "text-violet-500" : "text-slate-300"
                  }`}
                >
                  {filled ? ITEMS[PERM_PICKS[i]] : "?"}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm text-sm space-y-1 font-mono">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Available choices
        </p>
        {step < 0 ? (
          <p className="text-slate-400 text-sm font-sans">Press Play or Next →</p>
        ) : (
          PERM_CHOICES.slice(0, step + 1).map((avail, i) => (
            <p key={i} className="text-slate-600">
              {PERM_MEDALS[i]}:{" "}
              <span className={`font-bold ${i === step ? "text-violet-600" : "text-slate-800"}`}>
                {avail}
              </span>{" "}
              {i === 0 ? "runners to choose from" : "runners still available"}
            </p>
          ))
        )}
        {step >= 1 && (
          <p className="font-bold text-slate-900 pt-2 border-t border-slate-100">
            4 × 3 = <span className="text-violet-600">12</span> different podium results
          </p>
        )}
      </div>
    </div>
  );
}

// ─── COMBINATIONS visualisation (all 6 pairs shown, stepped through) ─────────
function CombinationsViz({ step }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Toppings (4 total)
        </p>
        <div className="flex gap-2">
          {ITEMS.map((_, i) => (
            <ItemBadge
              key={i}
              idx={i}
              active={step >= 0 && COMBO_PAIRS[step]?.includes(i)}
              dim={false}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          All possible pairs — {step < 0 ? "?" : step + 1} of 6 revealed
        </p>
        <div className="grid grid-cols-3 gap-2">
          {COMBO_PAIRS.map(([a, b], i) => {
            const isActive = i === step;
            const isPast = i < step;
            const ca = COLORS[a];
            const cb = COLORS[b];
            return (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: isActive
                    ? "rgb(15,23,42)"
                    : isPast
                    ? "rgb(226,232,240)"
                    : "rgb(249,250,251)",
                  scale: isActive ? 1.06 : 1,
                }}
                transition={spring}
                className="rounded-xl p-2 flex items-center justify-center gap-1"
              >
                <span
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive ? `${ca.bg} ${ca.text}` : `${ca.light} ${ca.ltext}`
                  }`}
                >
                  {ITEMS[a]}
                </span>
                <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-400"}`}>
                  +
                </span>
                <span
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive ? `${cb.bg} ${cb.text}` : `${cb.light} ${cb.ltext}`
                  }`}
                >
                  {ITEMS[b]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step >= 0 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-white p-4 shadow-sm text-sm"
          >
            <span className="font-mono font-bold">
              {ITEMS[COMBO_PAIRS[step][0]]} + {ITEMS[COMBO_PAIRS[step][1]]}
            </span>
            <span className="text-slate-500"> — pair {step + 1} of 6</span>
            <span className="ml-2 text-xs text-slate-400">
              (same as {ITEMS[COMBO_PAIRS[step][1]]}+{ITEMS[COMBO_PAIRS[step][0]]} — order doesn't matter!)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── formula definitions ──────────────────────────────────────────────────────
const MODES = ["factorial", "permutations", "combinations"];

const FORMULA_DATA = {
  factorial: {
    label: "n!",
    name: "Factorial",
    question: "In how many different orders can you arrange all n items?",
    mathFormula: { type: "linear", expr: "n! = n × (n−1) × (n−2) × … × 1" },
    plugIn: "4! = 4 × 3 × 2 × 1 = 24",
    what: "Factorial answers the question: if I have n things, how many ways can I line them all up? It multiplies every whole number from n down to 1.",
    example: "📚 4 books can be arranged on a shelf in 4! = 24 different orders.",
    keyIdea: "Factorial grows surprisingly fast — 10! = 3,628,800. Even 10 items can be arranged in over 3 million different ways!",
    rCode: `# R has a built-in function for this:
factorial(4)
#> [1] 24

# It's the same as writing it out:
4 * 3 * 2 * 1
#> [1] 24`,
    totalSteps: 4,
  },
  permutations: {
    label: "P(n,r)",
    name: "Permutations (no repetition)",
    question: "How many ways can you pick r items from n, where the order matters?",
    mathFormula: { type: "fraction", lhs: "P(n, r)", top: "n!", bottom: "(n − r)!" },
    plugIn: "P(4, 2) = 4! ÷ (4−2)! = 24 ÷ 2 = 12",
    what: "Use this when you pick a few items from a larger group and the order matters. Picking A first then B is different from picking B first then A.",
    example: "🏅 Awarding gold & silver to 2 of 4 runners: P(4,2) = 12 different podium results.",
    keyIdea: "The difference from factorial: you only fill r slots, not all n. The (n−r)! on the bottom cancels out the slots you don't use.",
    rCode: `n <- 4
r <- 2

# Divide out the unused slots:
factorial(n) / factorial(n - r)
#> [1] 12

# Or step by step:
# Slot 1: 4 choices, Slot 2: 3 left
4 * 3
#> [1] 12`,
    totalSteps: 2,
  },
  combinations: {
    label: "C(n,r)",
    name: "Combinations (no repetition)",
    question: "How many ways can you choose r items from n, where order does NOT matter?",
    mathFormula: { type: "fraction", lhs: "C(n, r)", top: "n!", bottom: "r! × (n − r)!" },
    plugIn: "C(4, 2) = 4! ÷ (2! × 2!) = 24 ÷ 4 = 6",
    what: "Like permutations, but picking mushroom+olive is the same as olive+mushroom — they're one combination, not two. We divide by r! to remove duplicate orderings.",
    example: "🍕 Choosing 2 pizza toppings from 4: C(4,2) = 6 possible combinations.",
    keyIdea: "Combinations are always fewer than permutations of the same n and r. The extra r! in the denominator removes every duplicate caused by ordering.",
    rCode: `n <- 4
r <- 2

# R has a built-in: choose()
choose(n, r)
#> [1] 6

# Manual calculation:
factorial(n) / (factorial(r) * factorial(n - r))
#> [1] 6`,
    totalSteps: 6,
  },
};

// ─── comparison table (all 5 formulas including with-repetition) ──────────────
const ALL_FORMULAS = [
  {
    name: "Factorial",
    symbol: "n!",
    formula: "n × (n−1) × … × 1",
    r: "factorial(n)",
    example: "4! = 24",
    note: "All orderings of n items",
    order: "Yes",
    repeat: "No",
  },
  {
    name: "Permutations",
    symbol: "P(n, r)",
    formula: "n! / (n−r)!",
    r: "factorial(n) / factorial(n-r)",
    example: "P(4,2) = 12",
    note: "Ordered selection of r from n",
    order: "Yes",
    repeat: "No",
  },
  {
    name: "Perm. with repetition",
    symbol: "nʳ",
    formula: "n × n × … × n  (r times)",
    r: "n^r",
    example: "4² = 16",
    note: "Ordered selection, same item can be picked again",
    order: "Yes",
    repeat: "Yes",
  },
  {
    name: "Combinations",
    symbol: "C(n, r)",
    formula: "n! / (r! × (n−r)!)",
    r: "choose(n, r)",
    example: "C(4,2) = 6",
    note: "Unordered selection of r from n",
    order: "No",
    repeat: "No",
  },
  {
    name: "Comb. with repetition",
    symbol: "C(n+r−1, r)",
    formula: "(n+r−1)! / (r! × (n−1)!)",
    r: "choose(n + r - 1, r)",
    example: "C(5,2) = 10",
    note: "Unordered selection, same item can appear multiple times",
    order: "No",
    repeat: "Yes",
  },
];

// ─── main scene ───────────────────────────────────────────────────────────────
export function CombinatoricsScene() {
  const [mode, setMode] = useState("factorial");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const f = FORMULA_DATA[mode];
  const totalSteps = f.totalSteps;

  useEffect(() => {
    setStep(-1);
    setPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, totalSteps]);

  return (
    <>
      {/* ── page header ── */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Combinatorics in R</h1>
        <p className="mt-2 text-slate-600">
          Counting how many ways things can be arranged or chosen — with the maths formula and the R code side by side.
        </p>
      </div>

      {/* ── main card ── */}
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">

          {/* formula selector + controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
              {MODES.map((id) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium font-mono transition-colors ${
                    mode === id
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {FORMULA_DATA[id].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setPlaying((p) => !p)}
                disabled={step >= totalSteps - 1 && !playing}
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
                onClick={() => { setStep((s) => Math.min(totalSteps - 1, s + 1)); setPlaying(false); }}
                disabled={step >= totalSteps - 1}
                variant="outline"
              >
                Next →
              </Button>
              <Button onClick={() => { setStep(-1); setPlaying(false); }} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {/* title + question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold">
                {f.name}{" "}
                <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xl">
                  {f.label}
                </code>
              </h2>
              <p className="mt-1 text-slate-600">{f.question}</p>
            </motion.div>
          </AnimatePresence>

          {/* progress bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={`${mode}-${i}`}
                animate={{ backgroundColor: i <= step ? "rgb(15,23,42)" : "rgb(226,232,240)" }}
                transition={{ duration: 0.2 }}
                className="h-2 flex-1 rounded-full"
              />
            ))}
            <span className="ml-2 text-xs text-slate-400 whitespace-nowrap">
              {step < 0 ? "not started" : `${step + 1} / ${totalSteps}`}
            </span>
          </div>

          {/* visualisation + explanation grid */}
          <div className="grid gap-6 md:grid-cols-2 md:items-start">

            {/* left: animated viz */}
            <div className="rounded-3xl bg-slate-100 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === "factorial"    && <FactorialViz    step={step} />}
                  {mode === "permutations" && <PermutationsViz step={step} />}
                  {mode === "combinations" && <CombinationsViz step={step} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* right: formula + explanation + R code */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* formula box */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Formula
                  </p>
                  <MathFormula formula={f.mathFormula} />
                  <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 font-mono text-sm font-semibold text-violet-700">
                    {f.plugIn}
                  </p>
                </div>

                {/* plain-English explanation */}
                <div className="rounded-2xl bg-white p-5 shadow-sm space-y-2">
                  <p className="text-sm text-slate-700">{f.what}</p>
                  <p className="text-sm text-slate-500 italic">{f.example}</p>
                </div>

                {/* R code */}
                <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner whitespace-pre">
                  {f.rCode}
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* ── key idea footer ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">The key thing to remember</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-slate-600"
          >
            {f.keyIdea}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── all 5 formulas reference table ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">All 5 combinatorics formulas at a glance</h2>
        <p className="mt-1 text-sm text-slate-500 mb-4">
          The two questions to ask: does order matter? Can you pick the same item more than once?
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Formula</th>
                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Maths</th>
                <th className="text-left py-2 pr-4 font-semibold text-slate-700">R code</th>
                <th className="text-center py-2 pr-4 font-semibold text-slate-700">Order?</th>
                <th className="text-center py-2 pr-4 font-semibold text-slate-700">Repeat?</th>
                <th className="text-left py-2 font-semibold text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody>
              {ALL_FORMULAS.map((row, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50" : ""}`}>
                  <td className="py-2.5 pr-4">
                    <span className="font-semibold text-slate-900">{row.name}</span>
                    <br />
                    <code className="text-xs font-mono text-violet-700">{row.symbol}</code>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-slate-600">{row.formula}</td>
                  <td className="py-2.5 pr-4">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">
                      {row.r}
                    </code>
                  </td>
                  <td className="py-2.5 pr-4 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.order === "Yes"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {row.order}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.repeat === "Yes"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {row.repeat}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">
                    <code className="font-mono text-xs">{row.example}</code>
                    <br />
                    <span className="text-xs">{row.note}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
