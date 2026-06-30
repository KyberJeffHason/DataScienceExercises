import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { generateWbs, solveWbs } from "../data/wbsGenerator.js";

export function WbsTrainer() {
  const [exercise, setExercise] = useState(() => generateWbs());
  const [assign, setAssign] = useState({}); // { pkgId: deliverableName }
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const solution = useMemo(() => solveWbs(exercise), [exercise]);

  function newExercise() {
    const ex = generateWbs();
    setExercise(ex);
    setAssign({});
    setResult(null);
    setShowSolution(false);
  }

  function setParent(pkgId, value) {
    setAssign((prev) => ({ ...prev, [pkgId]: value }));
    setResult(null);
    setShowSolution(false);
  }

  function check() {
    let correct = 0;
    const perItem = {};
    exercise.packages.forEach((p) => {
      const ok = assign[p.id] === p.parent;
      perItem[p.id] = ok ? "ok" : assign[p.id] ? "wrong" : "empty";
      if (ok) correct += 1;
    });
    setResult({
      perItem,
      correct,
      total: exercise.packages.length,
      allCorrect: correct === exercise.packages.length,
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
            Assign every work package to the deliverable it belongs under.
          </p>
        </div>
        <Button variant="outline" onClick={newExercise}>
          ↻ New exercise
        </Button>
      </div>

      {/* scenario */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
              Project
            </p>
            <p className="mt-1 text-sm">
              <strong>{exercise.title}</strong> — decompose the work. Each level-3{" "}
              <em>work package</em> below must sit under exactly one level-2{" "}
              <em>deliverable</em> (the 100% rule: every package belongs to one,
              and only one, parent).
            </p>
          </div>

          {/* deliverable reference */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500">Deliverables:</span>
            {exercise.deliverables.map((d, i) => (
              <span
                key={d}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
              >
                1.{i + 1} {d}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* assignment list */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold text-slate-700">
            Work packages — pick the parent deliverable
          </p>
          <div className="space-y-2">
            {exercise.packages.map((p) => {
              const state = result?.perItem?.[p.id];
              let tone = "border-slate-200 bg-white";
              if (showSolution) tone = "border-emerald-300 bg-emerald-50";
              else if (state === "ok") tone = "border-emerald-300 bg-emerald-50";
              else if (state === "wrong") tone = "border-rose-300 bg-rose-50";
              return (
                <div
                  key={p.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 ${tone}`}
                >
                  <span className="text-sm font-medium text-slate-800">{p.name}</span>
                  <div className="flex items-center gap-2">
                    {showSolution && (
                      <span className="text-xs font-semibold text-emerald-700">
                        → {p.parent}
                      </span>
                    )}
                    <select
                      value={showSolution ? p.parent : assign[p.id] || ""}
                      disabled={showSolution}
                      onChange={(e) => setParent(p.id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="">Select deliverable…</option>
                      {exercise.deliverables.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button onClick={check}>Check answers</Button>
            <Button variant="outline" onClick={reveal}>
              Show solution
            </Button>
          </div>

          {result && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                result.allCorrect
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {result.allCorrect
                ? "Perfect — every work package is under the right deliverable!"
                : `${result.correct}/${result.total} correctly assigned.`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* solution tree */}
      {showSolution && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="space-y-3 p-5">
            <h3 className="text-base font-bold">Correct WBS</h3>
            <div className="font-mono text-sm">
              <p className="font-bold text-slate-900">1 · {exercise.title}</p>
              <div className="mt-1 space-y-2">
                {solution.map((d) => (
                  <div key={d.name} className="ml-4">
                    <p className="font-semibold text-indigo-700">
                      {d.code} · {d.name}
                    </p>
                    <ul className="ml-6 mt-0.5 space-y-0.5">
                      {d.packages.map((p) => (
                        <li key={p.id} className="text-slate-600">
                          {p.code} · {p.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
