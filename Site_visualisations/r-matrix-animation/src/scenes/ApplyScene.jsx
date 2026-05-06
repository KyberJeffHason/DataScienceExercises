import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

// ─── sapply data ──────────────────────────────────────────────────────────────
const sapplyInput = [1, 2, 3, 4, 5];
function sapplyFn(x) { return x * x; }
const sapplyOutput = sapplyInput.map(sapplyFn);
const SAPPLY_CODE =
`x <- c(1, 2, 3, 4, 5)

sapply(x, function(n) n^2)
#> [1]  1  4  9 16 25`;

// ─── mapply data ──────────────────────────────────────────────────────────────
const mapplyA = [1, 2, 3, 4];
const mapplyB = [10, 20, 30, 40];
function mapplyFn(a, b) { return a + b; }
const mapplyOutput = mapplyA.map((a, i) => mapplyFn(a, mapplyB[i]));
const MAPPLY_CODE =
`a <- c(1, 2, 3, 4)
b <- c(10, 20, 30, 40)

mapply(function(x, y) x + y, a, b)
#> [1] 11 22 33 44`;

// ─── shared spring config ────────────────────────────────────────────────────
const spring = { type: "spring", stiffness: 260, damping: 20 };

// ─── RCode block ─────────────────────────────────────────────────────────────
function RCode({ code }) {
  return (
    <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner whitespace-pre">
      {code}
    </pre>
  );
}

// ─── sapply visualisation ────────────────────────────────────────────────────
function SapplyViz({ activeIndex }) {
  return (
    <div className="space-y-6">
      {/* input vector */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Input vector x</p>
        <div className="flex gap-2">
          {sapplyInput.map((v, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === activeIndex ? 1.15 : 1,
                backgroundColor: i === activeIndex
                  ? "rgb(15,23,42)"
                  : i < activeIndex
                    ? "rgb(226,232,240)"
                    : "rgb(255,255,255)",
                color: i === activeIndex ? "rgb(255,255,255)" : "rgb(15,23,42)",
              }}
              transition={spring}
              className="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center font-mono font-bold text-lg shadow-sm"
            >
              {v}
            </motion.div>
          ))}
        </div>
      </div>

      {/* function box */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ opacity: activeIndex >= 0 ? 1 : 0.35 }}
          className="flex-1 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">function</p>
          <code className="font-mono text-slate-800">n ↦ n²</code>
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && activeIndex < sapplyInput.length && (
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-slate-500"
              >
                {sapplyInput[activeIndex]}² = <span className="font-semibold text-slate-800">{sapplyOutput[activeIndex]}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* output vector */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Output vector</p>
        <div className="flex gap-2">
          {sapplyOutput.map((v, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === activeIndex ? 1.15 : 1,
                backgroundColor: i < activeIndex
                  ? "rgb(15,23,42)"
                  : i === activeIndex
                    ? "rgb(99,102,241)"
                    : "rgb(241,245,249)",
                color: i <= activeIndex ? "rgb(255,255,255)" : "rgb(148,163,184)",
              }}
              transition={{ ...spring, delay: i === activeIndex ? 0.18 : 0 }}
              className="h-12 w-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg shadow-sm"
            >
              {i <= activeIndex ? v : "·"}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── mapply visualisation ────────────────────────────────────────────────────
function MapplyViz({ activeIndex }) {
  return (
    <div className="space-y-6">
      {/* two input vectors side by side */}
      <div className="grid grid-cols-2 gap-4">
        {[{ label: "Vector a", data: mapplyA }, { label: "Vector b", data: mapplyB }].map(({ label, data }) => (
          <div key={label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <div className="flex gap-2">
              {data.map((v, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i === activeIndex ? 1.15 : 1,
                    backgroundColor: i === activeIndex
                      ? "rgb(15,23,42)"
                      : i < activeIndex
                        ? "rgb(226,232,240)"
                        : "rgb(255,255,255)",
                    color: i === activeIndex ? "rgb(255,255,255)" : "rgb(15,23,42)",
                  }}
                  transition={spring}
                  className="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center font-mono font-bold text-lg shadow-sm"
                >
                  {v}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* function box */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ opacity: activeIndex >= 0 ? 1 : 0.35 }}
          className="flex-1 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">function</p>
          <code className="font-mono text-slate-800">(x, y) ↦ x + y</code>
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && activeIndex < mapplyA.length && (
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-slate-500"
              >
                {mapplyA[activeIndex]} + {mapplyB[activeIndex]} ={" "}
                <span className="font-semibold text-slate-800">{mapplyOutput[activeIndex]}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* output vector */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Output vector</p>
        <div className="flex gap-2">
          {mapplyOutput.map((v, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === activeIndex ? 1.15 : 1,
                backgroundColor: i < activeIndex
                  ? "rgb(15,23,42)"
                  : i === activeIndex
                    ? "rgb(99,102,241)"
                    : "rgb(241,245,249)",
                color: i <= activeIndex ? "rgb(255,255,255)" : "rgb(148,163,184)",
              }}
              transition={{ ...spring, delay: i === activeIndex ? 0.18 : 0 }}
              className="h-12 w-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg shadow-sm"
            >
              {i <= activeIndex ? v : "·"}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── explanations ─────────────────────────────────────────────────────────────
const explanations = {
  sapply: {
    title: "sapply — do something to every item",
    what: "You give it a list of values and a function (a recipe). It runs that function on each value one by one and gives you back a new list of results. The 's' stands for 'simplify' — it tidies up the output into a plain vector for you.",
    when: "Use it whenever you want to transform every item in a list the same way. For example: squaring every number, or converting every name to upper case.",
    gotcha: "If each result has a different size, sapply returns a messier structure instead of a clean vector. If that surprises you, use vapply which always gives back a vector of the type you expect.",
    signature: "sapply(X, FUN, ...)",
  },
  mapply: {
    title: "mapply — do something using two lists at once",
    what: "Like sapply, but your function needs two (or more) lists as input. It picks the first item from each list, runs the function, then the second item from each list, and so on — like a zip.",
    when: "Use it when your calculation needs a value from list A and a value from list B at the same time. For example: adding matching numbers from two lists.",
    gotcha: "The function comes first, then the lists — the opposite order to sapply. If one list is shorter than the other, R will repeat (recycle) the shorter one from the beginning.",
    signature: "mapply(FUN, ..., MoreArgs = NULL)",
  },
};

// ─── main scene ───────────────────────────────────────────────────────────────
export function ApplyScene() {
  const [mode, setMode] = useState("sapply");
  const totalSteps = mode === "sapply" ? sapplyInput.length : mapplyA.length;
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  // reset when switching modes
  useEffect(() => {
    setStep(-1);
    setPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= totalSteps - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [playing, totalSteps]);

  const info = explanations[mode];

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <code className="rounded bg-slate-200 px-2 py-1 font-mono">sapply</code>
          {" & "}
          <code className="rounded bg-slate-200 px-2 py-1 font-mono">mapply</code>
          {" in R"}
        </h1>
        <p className="mt-2 text-slate-600">Instead of writing a loop yourself, these functions do the looping for you — once per item in your list.</p>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          {/* mode + playback controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {["sapply", "mapply"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                    mode === m ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {m}
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
                onClick={() => {
                  setStep((s) => Math.max(-1, s - 1));
                  setPlaying(false);
                }}
                disabled={step < 0}
                variant="outline"
              >
                ← Back
              </Button>
              <Button
                onClick={() => {
                  setStep((s) => Math.min(totalSteps - 1, s + 1));
                  setPlaying(false);
                }}
                disabled={step >= totalSteps - 1}
                variant="outline"
              >
                Next →
              </Button>
              <Button
                onClick={() => {
                  setStep(-1);
                  setPlaying(false);
                }}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* step counter */}
          <div className="flex gap-2 items-center">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: i <= step ? "rgb(15,23,42)" : "rgb(226,232,240)" }}
                transition={{ duration: 0.2 }}
                className="h-2 flex-1 rounded-full"
              />
            ))}
            <span className="ml-2 text-xs text-slate-400 whitespace-nowrap">
              {step < 0 ? "not started" : `step ${step + 1} / ${totalSteps}`}
            </span>
          </div>

          {/* visualisation + explanation side by side */}
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            <div className="rounded-3xl bg-slate-100 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === "sapply"
                    ? <SapplyViz activeIndex={step} />
                    : <MapplyViz activeIndex={step} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-5 shadow-sm space-y-3"
              >
                <h2 className="text-xl font-bold">{info.title}</h2>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">What it does</p>
                  <p className="text-slate-600 text-sm">{info.what}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">When would I use it?</p>
                  <p className="text-slate-600 text-sm">{info.when}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Common beginner trip-up</p>
                  <p className="text-slate-600 text-sm">{info.gotcha}</p>
                </div>
                <code className="block rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800">
                  {info.signature}
                </code>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RCode code={mode === "sapply" ? SAPPLY_CODE : MAPPLY_CODE} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">The apply family — what's the difference?</h2>
        <p className="mt-1 mb-3 text-sm text-slate-500">All three do the same core job (run a function on every item) — they just differ in what they return and how many inputs they take.</p>
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          {[
            { fn: "sapply(X, f)", desc: "One list in → gives back a clean vector of results. Great for beginners." },
            { fn: "lapply(X, f)", desc: "One list in → always gives back a list, even if results are simple numbers." },
            { fn: "mapply(f, ...)", desc: "Two or more lists in → pairs up items and gives back one result per pair." },
          ].map(({ fn, desc }) => (
            <div key={fn} className="rounded-xl bg-slate-100 p-3">
              <code className="font-mono text-slate-900 font-semibold">{fn}</code>
              <p className="mt-1 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
