import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { generateWbs } from "../data/wbsGenerator.js";

const norm = (s) => (s || "").replace(/\s+/g, "");
const OUT = "OUT";

/**
 * Deterministic solution:
 *  • deliverable codes = 1.1, 1.2, … in display order
 *  • each in-scope package gets parentCode.k (k contiguous within its bucket)
 *  • decoy packages are out of scope
 */
function buildSolution(exercise) {
  const delCode = {};
  exercise.deliverables.forEach((d, i) => (delCode[d.id] = `1.${i + 1}`));

  const nameToDel = Object.fromEntries(
    exercise.deliverables.map((d) => [d.name, d.id])
  );

  const pkgParent = {};
  const pkgCode = {};
  const bucketSize = {};
  const counter = {};
  exercise.packages.forEach((p) => {
    if (p.parentName) {
      const did = nameToDel[p.parentName];
      counter[did] = (counter[did] || 0) + 1;
      pkgParent[p.id] = did;
      pkgCode[p.id] = `${delCode[did]}.${counter[did]}`;
    } else {
      pkgParent[p.id] = OUT;
      pkgCode[p.id] = "";
    }
  });
  Object.assign(bucketSize, counter);

  return { delCode, nameToDel, pkgParent, pkgCode, bucketSize };
}

export function WbsTrainer() {
  const [exercise, setExercise] = useState(() => generateWbs());
  const [delCodes, setDelCodes] = useState({}); // { delId: typed code }
  const [pkgParent, setPkgParent] = useState({}); // { pkgId: delId | "OUT" }
  const [pkgCodes, setPkgCodes] = useState({}); // { pkgId: typed code }
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const sol = useMemo(() => buildSolution(exercise), [exercise]);

  function newExercise() {
    setExercise(generateWbs());
    setDelCodes({});
    setPkgParent({});
    setPkgCodes({});
    setResult(null);
    setShowSolution(false);
  }

  const clearResult = () => {
    setResult(null);
    setShowSolution(false);
  };

  function check() {
    const rowState = {};
    let correct = 0;
    let total = 0;

    // deliverable codes
    exercise.deliverables.forEach((d) => {
      total += 1;
      const ok = norm(delCodes[d.id]) === sol.delCode[d.id];
      rowState[d.id] = ok ? "ok" : delCodes[d.id] ? "wrong" : "empty";
      if (ok) correct += 1;
    });

    // gather correctly-placed packages per deliverable to validate contiguous numbering
    const placed = {}; // did -> [{ id, k|null }]
    exercise.packages.forEach((p) => {
      if (!p.parentName) return;
      const did = sol.nameToDel[p.parentName];
      if (pkgParent[p.id] !== did) return;
      const prefix = `${sol.delCode[did]}.`;
      const code = norm(pkgCodes[p.id]);
      let k = null;
      if (code.startsWith(prefix)) {
        const tail = code.slice(prefix.length);
        if (/^\d+$/.test(tail)) k = Number(tail);
      }
      (placed[did] ||= []).push({ id: p.id, k });
    });

    exercise.packages.forEach((p) => {
      total += 1;
      const choice = pkgParent[p.id];
      let ok = false;
      if (!p.parentName) {
        ok = choice === OUT; // decoy must be excluded
      } else {
        const did = sol.nameToDel[p.parentName];
        if (choice === did) {
          const N = sol.bucketSize[did];
          const group = placed[did] || [];
          const entry = group.find((e) => e.id === p.id);
          const k = entry?.k;
          const dup = group.filter((e) => e.k === k).length;
          ok = k != null && k >= 1 && k <= N && dup === 1;
        }
      }
      const touched = choice != null || pkgCodes[p.id];
      rowState[p.id] = ok ? "ok" : touched ? "wrong" : "empty";
      if (ok) correct += 1;
    });

    setResult({ rowState, correct, total, allCorrect: correct === total });
    setShowSolution(false);
  }

  function reveal() {
    setShowSolution(true);
    setResult(null);
  }

  const delValue = (id) => (showSolution ? sol.delCode[id] : delCodes[id] || "");
  const parentValue = (id) =>
    showSolution ? sol.pkgParent[id] : pkgParent[id] ?? "";
  const codeValue = (id) =>
    showSolution ? sol.pkgCode[id] : pkgCodes[id] || "";

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Work Breakdown Structure (WBS) Training
          </h2>
          <p className="text-sm text-slate-500">
            Decide scope, assign each package to a deliverable, and number the WBS.
          </p>
        </div>
        <Button variant="outline" onClick={newExercise}>
          ↻ New exercise
        </Button>
      </div>

      {/* scenario + scope */}
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Scope — inclusion
              </p>
              <p className="text-sm text-emerald-900">{exercise.scope.includes}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                Scope — exclusion
              </p>
              <p className="text-sm text-rose-900">{exercise.scope.excludes}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Your task</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Number the deliverables{" "}
                <span className="font-mono">1.1, 1.2, …</span> in the order shown
                (root project = <span className="font-mono">1</span>).
              </li>
              <li>
                Assign every work package to the deliverable it belongs under, and
                number it <span className="font-mono">1.x.1, 1.x.2, …</span>{" "}
                (contiguous within each deliverable; sibling order is up to you).
              </li>
              <li>
                Some packages are <strong>out of scope</strong> — decide which from
                the scope statement above and assign them{" "}
                <em>Out of scope</em> (the scope won't name them for you).
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* deliverables */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-2 p-5">
          <p className="text-sm font-semibold text-slate-700">
            Deliverables (level 2) — type the WBS code
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 pb-1">
              <span className="inline-flex h-8 w-24 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                1
              </span>
              <span className="font-semibold text-slate-900">· {exercise.title}</span>
            </div>
            {exercise.deliverables.map((d) => (
              <div key={d.id} className="ml-6 flex items-center gap-3">
                <CodeInput
                  value={delValue(d.id)}
                  disabled={showSolution}
                  state={result?.rowState?.[d.id]}
                  onChange={(v) => {
                    setDelCodes((p) => ({ ...p, [d.id]: v }));
                    clearResult();
                  }}
                />
                <span className="font-semibold text-slate-800">· {d.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* work packages */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold text-slate-700">
            Work packages — assign a parent and type the code
          </p>
          <div className="space-y-2">
            {exercise.packages.map((p) => {
              const choice = parentValue(p.id);
              const isOut = choice === OUT;
              const state = result?.rowState?.[p.id];
              let tone = "border-slate-200 bg-white";
              if (showSolution) tone = "border-emerald-300 bg-emerald-50";
              else if (state === "ok") tone = "border-emerald-300 bg-emerald-50";
              else if (state === "wrong") tone = "border-rose-300 bg-rose-50";
              return (
                <div
                  key={p.id}
                  className={`flex flex-wrap items-center gap-2.5 rounded-xl border-2 px-3 py-2 ${tone}`}
                >
                  <span className="min-w-[150px] flex-1 text-sm font-medium text-slate-800">
                    {p.name}
                  </span>
                  <select
                    value={choice}
                    disabled={showSolution}
                    onChange={(e) => {
                      setPkgParent((prev) => ({ ...prev, [p.id]: e.target.value }));
                      clearResult();
                    }}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Assign to…</option>
                    {exercise.deliverables.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                    <option value={OUT}>Out of scope</option>
                  </select>
                  <CodeInput
                    value={isOut ? "" : codeValue(p.id)}
                    disabled={showSolution || isOut || !choice}
                    state={isOut ? undefined : state}
                    onChange={(v) => {
                      setPkgCodes((prev) => ({ ...prev, [p.id]: v }));
                      clearResult();
                    }}
                  />
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
                ? "Perfect — scope, placement and numbering are all correct!"
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
  if (disabled && state === undefined)
    tone = "border-slate-200 bg-slate-100 text-slate-300";
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
