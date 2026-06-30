import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import {
  generateNetwork,
  solveNetwork,
  layoutNetwork,
  successorMap,
} from "../data/networkGenerator.js";

// ── geometry ──
const COL_W = 185;
const ROW_H = 135;
const NODE_W = 120;
const NODE_H = 76;

const EDITABLE = ["es", "ef", "ls", "float", "lf"];

const blankInputs = (activities) =>
  Object.fromEntries(
    activities.map((a) => [a.id, { es: "", ef: "", ls: "", float: "", lf: "" }])
  );

function normaliseLetters(str) {
  return (str.toUpperCase().match(/[A-J]/g) || []).join("");
}

export function NetworkDiagramTrainer() {
  const [network, setNetwork] = useState(() => generateNetwork());
  const [inputs, setInputs] = useState(() => blankInputs(network.activities));
  const [critInput, setCritInput] = useState("");
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const layout = useMemo(() => layoutNetwork(network.activities), [network]);
  const succ = useMemo(() => successorMap(network.activities), [network]);

  // solutions for both conventions (used for display/validation)
  const sol0 = useMemo(() => solveNetwork(network.activities, "day0"), [network]);
  const sol1 = useMemo(() => solveNetwork(network.activities, "day1"), [network]);

  function newExercise() {
    const net = generateNetwork();
    setNetwork(net);
    setInputs(blankInputs(net.activities));
    setCritInput("");
    setResult(null);
    setShowSolution(false);
  }

  function setField(id, field, value) {
    if (!/^-?\d*$/.test(value)) return; // integers only
    setInputs((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setResult(null);
    setShowSolution(false);
  }

  function check() {
    const starts = network.activities.filter((a) => a.preds.length === 0);
    const firstStartEs = Number(inputs[starts[0].id].es);
    // detect convention from where the schedule begins
    const method = firstStartEs === 1 ? "day1" : "day0";
    const sol = method === "day1" ? sol1 : sol0;

    const cellResults = {};
    let correct = 0;
    let total = 0;
    let filled = 0;

    network.activities.forEach((a) => {
      cellResults[a.id] = {};
      EDITABLE.forEach((field) => {
        total += 1;
        const raw = inputs[a.id][field];
        const expected = sol.cells[a.id][field];
        const ok = raw !== "" && Number(raw) === expected;
        if (raw !== "") filled += 1;
        if (ok) correct += 1;
        cellResults[a.id][field] = ok ? "ok" : raw === "" ? "empty" : "wrong";
      });
    });

    const critExpected = normaliseLetters(sol.critical.join(""));
    const critGot = normaliseLetters(critInput);
    const critOk = critGot === critExpected;

    setResult({
      method,
      sol,
      cellResults,
      correct,
      total,
      filled,
      critOk,
      critExpected: sol.critical.join(" → "),
      allCorrect: correct === total && critOk,
    });
    setShowSolution(false);
  }

  function reveal() {
    const sol = result ? result.sol : sol0;
    setResult((r) => ({ ...(r || {}), sol, method: r?.method ?? "day0" }));
    setShowSolution(true);
  }

  const activeSol = result?.sol ?? sol0;

  // canvas size
  const drawnCols = layout.cols + 2; // + start + finish
  const canvasW = drawnCols * COL_W + 20;
  const canvasH = Math.max(layout.rows, 1) * ROW_H + 30;
  const midY = canvasH / 2;

  // node top-left positions
  const nodeXY = (id) => ({
    x: (layout.pos[id].col + 1) * COL_W + 10,
    y: layout.pos[id].row * ROW_H + 15,
  });
  const sources = network.activities.filter((a) => a.preds.length === 0);
  const sinks = network.activities.filter((a) => succ[a.id].length === 0);

  // align terminals with the central source / sink nodes
  const startCenterY = sources.length
    ? nodeXY(sources[0].id).y + NODE_H / 2
    : midY;
  const finishCenterY = sinks.length
    ? nodeXY(sinks[0].id).y + NODE_H / 2
    : midY;
  const startXY = { x: 14, y: startCenterY - 26 };
  const finishXY = { x: (layout.cols + 1) * COL_W + 18, y: finishCenterY - 26 };

  return (
    <div className="space-y-5">
      {/* ── header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Network Activity Diagram Training
          </h2>
          <p className="text-sm text-slate-500">
            Complete the forward &amp; backward pass, then name the critical path.
          </p>
        </div>
        <Button variant="outline" onClick={newExercise}>
          ↻ New exercise
        </Button>
      </div>

      {/* ── task ── */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm text-slate-700">
            <strong>Task A.</strong> Fill in each node: <em>Early Start/Finish</em>,{" "}
            <em>Late Start/Finish</em> and <em>Float</em> (Duration is given).{" "}
            <strong>Task B.</strong> Name the <em>critical path</em>.
          </p>
          <p className="text-xs text-slate-500">
            Both conventions are accepted — start at <strong>0</strong> (zero-based)
            or <strong>1</strong> (one-based). The checker auto-detects which you
            used and grades by its rules.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">Activity</th>
                  <th className="px-4 py-2 font-semibold">Predecessors</th>
                  <th className="px-4 py-2 font-semibold">Expected Duration</th>
                </tr>
              </thead>
              <tbody>
                {network.activities.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100">
                    <td className="px-4 py-1.5 font-semibold text-slate-800">{a.id}</td>
                    <td className="px-4 py-1.5 text-slate-600">
                      {a.preds.length ? a.preds.join("; ") : "—"}
                    </td>
                    <td className="px-4 py-1.5 text-slate-600">{a.dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── diagram ── */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div
              className="relative mx-auto"
              style={{ width: canvasW, height: canvasH }}
            >
              {/* arrows */}
              <svg
                className="absolute inset-0"
                width={canvasW}
                height={canvasH}
                style={{ pointerEvents: "none" }}
              >
                <defs>
                  <marker
                    id="arrow"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L7,3 L0,6 Z" fill="#94a3b8" />
                  </marker>
                  <marker
                    id="arrowCrit"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L7,3 L0,6 Z" fill="#e11d48" />
                  </marker>
                </defs>

                {/* start → sources */}
                {sources.map((a) => {
                  const t = nodeXY(a.id);
                  const onCrit =
                    showSolution && result && result.sol.critical.includes(a.id);
                  return (
                    <Edge
                      key={`s-${a.id}`}
                      x1={startXY.x + 80}
                      y1={startXY.y + 26}
                      x2={t.x}
                      y2={t.y + NODE_H / 2}
                      crit={onCrit}
                    />
                  );
                })}

                {/* activity → successors */}
                {network.activities.map((a) =>
                  succ[a.id].map((sId) => {
                    const f = nodeXY(a.id);
                    const t = nodeXY(sId);
                    const onCrit =
                      showSolution &&
                      result &&
                      result.sol.critical.includes(a.id) &&
                      result.sol.critical.includes(sId);
                    return (
                      <Edge
                        key={`${a.id}-${sId}`}
                        x1={f.x + NODE_W}
                        y1={f.y + NODE_H / 2}
                        x2={t.x}
                        y2={t.y + NODE_H / 2}
                        crit={onCrit}
                      />
                    );
                  })
                )}

                {/* sinks → finish */}
                {sinks.map((a) => {
                  const f = nodeXY(a.id);
                  const onCrit =
                    showSolution && result && result.sol.critical.includes(a.id);
                  return (
                    <Edge
                      key={`f-${a.id}`}
                      x1={f.x + NODE_W}
                      y1={f.y + NODE_H / 2}
                      x2={finishXY.x}
                      y2={finishXY.y + 26}
                      crit={onCrit}
                    />
                  );
                })}
              </svg>

              {/* start / finish */}
              <Terminal label="Start" x={startXY.x} y={startXY.y} />
              <Terminal label="Finish" x={finishXY.x} y={finishXY.y} />

              {/* activity nodes */}
              {network.activities.map((a) => {
                const { x, y } = nodeXY(a.id);
                const onCrit =
                  showSolution && result && result.sol.critical.includes(a.id);
                return (
                  <NodeBox
                    key={a.id}
                    a={a}
                    x={x}
                    y={y}
                    values={inputs[a.id]}
                    cellResult={result?.cellResults?.[a.id]}
                    solution={activeSol.cells[a.id]}
                    showSolution={showSolution}
                    critical={onCrit}
                    onChange={(field, v) => setField(a.id, field, v)}
                  />
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── critical path + actions ── */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex-1">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Critical path
              </span>
              <input
                value={critInput}
                onChange={(e) => {
                  setCritInput(e.target.value);
                  setResult(null);
                }}
                placeholder="e.g. A - B - D - G - H"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <div className="flex gap-2">
              <Button onClick={check}>Check answers</Button>
              <Button variant="outline" onClick={reveal}>
                Show solution
              </Button>
            </div>
          </div>

          {result && !showSolution && (
            <ResultBanner result={result} />
          )}

          {showSolution && (
            <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100">
              <p>
                <span className="font-semibold text-emerald-400">Solution shown.</span>{" "}
                Project duration ={" "}
                <strong>{activeSol.projectDuration}</strong> · Critical path:{" "}
                <strong className="text-rose-300">
                  {activeSol.critical.join(" → ")}
                </strong>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Displayed using the {result?.method === "day1" ? "one-based (day 1)" : "zero-based (day 0)"} convention.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Legend />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Edge({ x1, y1, x2, y2, crit }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={crit ? "#e11d48" : "#94a3b8"}
      strokeWidth={crit ? 2.5 : 1.5}
      markerEnd={`url(#${crit ? "arrowCrit" : "arrow"})`}
    />
  );
}

function Terminal({ label, x, y }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full border-2 border-slate-300 bg-white text-xs font-semibold text-slate-600"
      style={{ left: x, top: y, width: 80, height: 52 }}
    >
      {label}
    </div>
  );
}

function Cell({ value, result, solution, showSolution, onChange, readOnly, label }) {
  let tone = "bg-white";
  if (showSolution) tone = "bg-emerald-50 text-emerald-700";
  else if (result === "ok") tone = "bg-emerald-50 text-emerald-700";
  else if (result === "wrong") tone = "bg-rose-50 text-rose-600";

  const shown = showSolution ? solution : value;

  if (readOnly) {
    return (
      <div className="flex h-7 items-center justify-center border-r border-slate-300 bg-slate-100 text-xs font-bold text-slate-700 last:border-r-0">
        {shown}
      </div>
    );
  }
  return (
    <input
      aria-label={label}
      value={shown}
      readOnly={showSolution}
      onChange={(e) => onChange(e.target.value)}
      className={`h-7 w-full border-r border-slate-300 text-center text-xs font-semibold outline-none last:border-r-0 focus:bg-indigo-50 ${tone}`}
    />
  );
}

function NodeBox({ a, x, y, values, cellResult, solution, showSolution, critical, onChange }) {
  const border = critical ? "border-rose-500" : "border-slate-400";
  return (
    <div
      className={`absolute rounded-md border-2 ${border} bg-white shadow-sm`}
      style={{ left: x, top: y, width: NODE_W }}
    >
      {/* top row: ES | Dur | EF */}
      <div className="grid grid-cols-3 border-b border-slate-300">
        <Cell
          label={`${a.id} ES`}
          value={values.es}
          result={cellResult?.es}
          solution={solution.es}
          showSolution={showSolution}
          onChange={(v) => onChange("es", v)}
        />
        <Cell readOnly value={a.dur} solution={a.dur} showSolution={showSolution} />
        <Cell
          label={`${a.id} EF`}
          value={values.ef}
          result={cellResult?.ef}
          solution={solution.ef}
          showSolution={showSolution}
          onChange={(v) => onChange("ef", v)}
        />
      </div>
      {/* id row */}
      <div className="border-b border-slate-300 bg-slate-50 py-0.5 text-center text-sm font-bold text-slate-800">
        {a.id}
      </div>
      {/* bottom row: LS | Float | LF */}
      <div className="grid grid-cols-3">
        <Cell
          label={`${a.id} LS`}
          value={values.ls}
          result={cellResult?.ls}
          solution={solution.ls}
          showSolution={showSolution}
          onChange={(v) => onChange("ls", v)}
        />
        <Cell
          label={`${a.id} Float`}
          value={values.float}
          result={cellResult?.float}
          solution={solution.float}
          showSolution={showSolution}
          onChange={(v) => onChange("float", v)}
        />
        <Cell
          label={`${a.id} LF`}
          value={values.lf}
          result={cellResult?.lf}
          solution={solution.lf}
          showSolution={showSolution}
          onChange={(v) => onChange("lf", v)}
        />
      </div>
    </div>
  );
}

function ResultBanner({ result }) {
  const pct = Math.round((result.correct / result.total) * 100);
  const tone = result.allCorrect
    ? "bg-emerald-100 text-emerald-800"
    : pct >= 60
    ? "bg-amber-100 text-amber-800"
    : "bg-rose-100 text-rose-800";
  return (
    <div className={`space-y-1 rounded-xl px-4 py-3 text-sm ${tone}`}>
      <p className="font-semibold">
        {result.allCorrect
          ? "Perfect — every value and the critical path are correct!"
          : `${result.correct}/${result.total} cells correct (${pct}%).`}
      </p>
      <p className="text-xs">
        Detected convention:{" "}
        <strong>
          {result.method === "day1" ? "one-based (start at 1)" : "zero-based (start at 0)"}
        </strong>
        . Critical path:{" "}
        <strong>{result.critOk ? "correct ✓" : "not yet right ✕"}</strong>
        {result.filled < result.total && " · some cells are still empty"}
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="grid gap-4 rounded-2xl bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
      <div>
        <h4 className="mb-2 font-semibold text-slate-800">Node layout</h4>
        <div className="mb-2 inline-block rounded-md border-2 border-slate-400">
          <div className="grid grid-cols-3 border-b border-slate-300 text-[11px] font-semibold">
            <span className="border-r border-slate-300 px-2 py-1">ES</span>
            <span className="border-r border-slate-300 px-2 py-1">Dur</span>
            <span className="px-2 py-1">EF</span>
          </div>
          <div className="border-b border-slate-300 bg-slate-50 px-2 py-0.5 text-center text-[11px] font-bold">
            ID
          </div>
          <div className="grid grid-cols-3 text-[11px] font-semibold">
            <span className="border-r border-slate-300 px-2 py-1">LS</span>
            <span className="border-r border-slate-300 px-2 py-1">Float</span>
            <span className="px-2 py-1">LF</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-xs text-slate-600">
        <p>
          <strong className="text-slate-800">Zero-based (day 0):</strong> start ES = 0;
          EF = ES + Dur; ES = max(predecessor EF). LS = LF − Dur; LF = min(successor LS);
          Float = LS − ES.
        </p>
        <p>
          <strong className="text-slate-800">One-based (day 1):</strong> start ES = 1;
          EF = ES + Dur − 1; ES = max(pred EF) + 1. LS = LF − Dur + 1;
          LF = min(successor LS) − 1; Float = LS − ES.
        </p>
        <p>
          The <strong className="text-rose-600">critical path</strong> is the longest
          chain with zero float.
        </p>
      </div>
    </div>
  );
}
