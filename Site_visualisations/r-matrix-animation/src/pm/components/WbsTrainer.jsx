import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { generateWbs, solveWbs } from "../data/wbsGenerator.js";

const norm = (s) => (s || "").replace(/\s+/g, "");

export function WbsTrainer() {
  const [exercise, setExercise] = useState(() => generateWbs());
  const [codes, setCodes] = useState({}); // { itemId: typed code }
  const [excluded, setExcluded] = useState({}); // { deliverableId: bool }
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const solution = useMemo(() => solveWbs(exercise), [exercise]);

  function newExercise() {
    const ex = generateWbs();
    setExercise(ex);
    setCodes({});
    setExcluded({});
    setResult(null);
    setShowSolution(false);
  }

  function setCode(id, value) {
    setCodes((prev) => ({ ...prev, [id]: value }));
    setResult(null);
    setShowSolution(false);
  }

  function toggleExclude(id) {
    setExcluded((prev) => ({ ...prev, [id]: !prev[id] }));
    setResult(null);
    setShowSolution(false);
  }

  function check() {
    const rowState = {};
    let correct = 0;
    let total = 0;

    exercise.deliverables.forEach((d) => {
      total += 1;
      if (d.inScope) {
        const ok = !excluded[d.id] && norm(codes[d.id]) === solution.codes[d.id];
        rowState[d.id] = ok ? "ok" : excluded[d.id] || codes[d.id] ? "wrong" : "empty";
        if (ok) correct += 1;
        // packages
        d.packages.forEach((p) => {
          total += 1;
          const pOk = !excluded[d.id] && norm(codes[p.id]) === solution.codes[p.id];
          rowState[p.id] = pOk ? "ok" : codes[p.id] ? "wrong" : "empty";
          if (pOk) correct += 1;
        });
      } else {
        // out of scope: correct iff the student marked it excluded
        const ok = !!excluded[d.id];
        rowState[d.id] = ok ? "ok" : "wrong";
        if (ok) correct += 1;
      }
    });

    setResult({
      rowState,
      correct,
      total,
      allCorrect: correct === total,
    });
    setShowSolution(false);
  }

  function reveal() {
    setShowSolution(true);
    setResult(null);
  }

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Work Breakdown Structure (WBS) Training
          </h2>
          <p className="text-sm text-slate-500">
            Number every in-scope element and exclude whatever is out of scope.
          </p>
        </div>
        <Button variant="outline" onClick={newExercise}>
          ↻ New exercise
        </Button>
      </div>

      {/* scenario + scope + task */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
              Project
            </p>
            <p className="mt-1 text-sm font-semibold">{exercise.title}</p>
            <p className="mt-2 text-sm">
              <strong>The 100% Rule:</strong> The WBS must include 100% of the work
              defined by the project scope—and absolutely nothing else. It applies
              to all hierarchical levels; the sum of all "child" tasks must exactly
              equal 100% of their "parent" deliverable.
            </p>
          </div>

          {/* project scope by inclusion / exclusion */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                In scope — inclusions
              </p>
              <p className="text-sm text-emerald-900">
                The project <strong>will deliver</strong>:{" "}
                {exercise.scope.inclusions.join(", ")}.
              </p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                Out of scope — exclusions
              </p>
              <p className="text-sm text-rose-900">
                The project will <strong>not include</strong>:{" "}
                {exercise.scope.exclusions.join(", ")}.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Your task</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Type the WBS number for every element. The root project is{" "}
                <span className="font-mono font-semibold">1</span>.
              </li>
              <li>
                Number deliverables{" "}
                <span className="font-mono">1.1, 1.2, …</span> top-to-bottom, and
                their packages{" "}
                <span className="font-mono">1.x.1, 1.x.2, …</span> in the order
                shown.
              </li>
              <li>
                Some deliverables are <strong>out of scope</strong> — mark them{" "}
                <em>Out of scope</em> and do <strong>not</strong> number them. Skip
                excluded deliverables when numbering the rest.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* WBS tree */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-2 p-5 font-mono text-sm">
          {/* root */}
          <div className="flex items-center gap-3 pb-1">
            <span className="inline-flex h-8 w-20 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              1
            </span>
            <span className="font-sans font-bold text-slate-900">
              · {exercise.title}
            </span>
          </div>

          {exercise.deliverables.map((d) => {
            const dExcluded = showSolution ? solution.excluded[d.id] : !!excluded[d.id];
            const dShownCode = showSolution
              ? solution.codes[d.id] ?? ""
              : codes[d.id] || "";
            return (
              <div key={d.id} className="space-y-1.5">
                {/* deliverable row */}
                <div className="ml-6 flex flex-wrap items-center gap-3 pt-1">
                  <CodeInput
                    value={dExcluded ? "" : dShownCode}
                    disabled={showSolution || dExcluded}
                    state={result?.rowState?.[d.id]}
                    onChange={(v) => setCode(d.id, v)}
                  />
                  <span
                    className={`font-sans font-semibold ${
                      dExcluded ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                  >
                    · {d.name}
                  </span>
                  <ExcludeToggle
                    active={dExcluded}
                    disabled={showSolution}
                    onClick={() => toggleExclude(d.id)}
                  />
                </div>

                {/* packages */}
                {d.packages.map((p) => {
                  const pShownCode = showSolution
                    ? solution.codes[p.id] ?? ""
                    : codes[p.id] || "";
                  return (
                    <div key={p.id} className="ml-16 flex flex-wrap items-center gap-3">
                      <CodeInput
                        value={dExcluded ? "" : pShownCode}
                        disabled={showSolution || dExcluded}
                        state={dExcluded ? undefined : result?.rowState?.[p.id]}
                        onChange={(v) => setCode(p.id, v)}
                      />
                      <span
                        className={`font-sans ${
                          dExcluded ? "text-slate-400 line-through" : "text-slate-700"
                        }`}
                      >
                        · {p.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 font-sans">
            <Button onClick={check}>Check answers</Button>
            <Button variant="outline" onClick={reveal}>
              Show solution
            </Button>
          </div>

          {result && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-sans font-semibold ${
                result.allCorrect
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {result.allCorrect
                ? "Perfect — correct numbering and the right items excluded!"
                : `${result.correct}/${result.total} rows correct.`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CodeInput({ value, disabled, state, onChange }) {
  let tone = "border-slate-300";
  if (disabled && state === undefined) tone = "border-slate-200 bg-slate-100 text-slate-300";
  if (state === "ok") tone = "border-emerald-400 bg-emerald-50 text-emerald-700";
  else if (state === "wrong") tone = "border-rose-400 bg-rose-50 text-rose-600";
  return (
    <input
      value={value}
      disabled={disabled}
      placeholder="—"
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 w-24 rounded-lg border-2 px-2 text-center text-xs font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${tone}`}
    />
  );
}

function ExcludeToggle({ active, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold font-sans transition-colors ${
        active
          ? "border-rose-400 bg-rose-100 text-rose-700"
          : "border-slate-300 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600"
      } ${disabled ? "opacity-60" : ""}`}
    >
      {active ? "✕ Out of scope" : "Mark out of scope"}
    </button>
  );
}
