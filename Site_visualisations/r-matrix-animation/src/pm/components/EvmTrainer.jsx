import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import {
  generateEvm,
  solveEvm,
  COST_STATUS,
  SCHEDULE_STATUS,
} from "../data/evmGenerator.js";

// editable columns per period
const MONEY_FIELDS = ["cumPV", "cumEV", "cumAC", "cv", "sv"];
const RATIO_FIELDS = ["cpi", "spi"];
const FIELDS = [...MONEY_FIELDS, ...RATIO_FIELDS];

const COLS = [
  { key: "cumPV", label: "Cum. PV", hint: "Σ PV" },
  { key: "cumEV", label: "Cum. EV", hint: "Σ EV" },
  { key: "cumAC", label: "Cum. AC", hint: "Σ AC" },
  { key: "cv", label: "CV", hint: "EV − AC" },
  { key: "sv", label: "SV", hint: "EV − PV" },
  { key: "cpi", label: "CPI", hint: "EV / AC" },
  { key: "spi", label: "SPI", hint: "EV / PV" },
];

const euro = (n) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const blankRow = () =>
  Object.fromEntries(FIELDS.map((f) => [f, ""]));

export function EvmTrainer() {
  const [exercise, setExercise] = useState(() => generateEvm());
  const [inputs, setInputs] = useState(() =>
    exercise.periods.map(() => blankRow())
  );
  const [costGuess, setCostGuess] = useState("");
  const [schedGuess, setSchedGuess] = useState("");
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const sol = useMemo(() => solveEvm(exercise.periods), [exercise]);

  function newExercise() {
    const ex = generateEvm();
    setExercise(ex);
    setInputs(ex.periods.map(() => blankRow()));
    setCostGuess("");
    setSchedGuess("");
    setResult(null);
    setShowSolution(false);
  }

  function setField(rowIdx, field, value) {
    if (!/^-?\d*\.?\d*$/.test(value)) return;
    setInputs((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, [field]: value } : r))
    );
    setResult(null);
    setShowSolution(false);
  }

  function check() {
    const cellResults = exercise.periods.map(() => ({}));
    let correct = 0;
    let total = 0;

    exercise.periods.forEach((_, i) => {
      FIELDS.forEach((field) => {
        total += 1;
        const raw = inputs[i][field];
        const expected = sol.rows[i][field];
        let ok = false;
        if (raw !== "") {
          const val = Number(raw);
          ok = RATIO_FIELDS.includes(field)
            ? Math.abs(val - expected) <= 0.01
            : val === expected;
        }
        if (ok) correct += 1;
        cellResults[i][field] = ok ? "ok" : raw === "" ? "empty" : "wrong";
      });
    });

    const costOk = costGuess === sol.status.cost;
    const schedOk = schedGuess === sol.status.schedule;

    setResult({
      cellResults,
      correct,
      total,
      costOk,
      schedOk,
      allCorrect: correct === total && costOk && schedOk,
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
            Earned Value (EVM) Training
          </h2>
          <p className="text-sm text-slate-500">
            Build the cumulative figures, then compute CV, SV, CPI and SPI.
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
              Scenario
            </p>
            <p className="mt-1 text-sm">
              <strong>{exercise.scenario.title}</strong> — total budget (BAC){" "}
              <strong>{euro(exercise.scenario.bac)}</strong>, planned over{" "}
              <strong>
                {exercise.scenario.months} {exercise.scenario.unit}
              </strong>
              . Each row gives the period's <em>planned value (PV)</em>,{" "}
              <em>earned value (EV)</em> and <em>actual cost (AC)</em>. Work out the
              cumulative columns and the KPIs, then judge the project's status.
            </p>
          </div>

          {/* given data */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Month</th>
                  <th className="px-3 py-2 font-semibold">PV (period)</th>
                  <th className="px-3 py-2 font-semibold">EV (period)</th>
                  <th className="px-3 py-2 font-semibold">AC (period)</th>
                </tr>
              </thead>
              <tbody>
                {exercise.periods.map((p) => (
                  <tr key={p.label} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-left font-semibold text-slate-800">
                      {p.label}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">{euro(p.pv)}</td>
                    <td className="px-3 py-1.5 text-slate-600">{euro(p.ev)}</td>
                    <td className="px-3 py-1.5 text-slate-600">{euro(p.ac)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* answer table */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-semibold text-slate-700">
            Your calculations
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2 text-left font-semibold">Month</th>
                  {COLS.map((c) => (
                    <th key={c.key} className="px-2 py-2 text-center font-semibold">
                      {c.label}
                      <span className="block text-[10px] font-normal normal-case text-slate-400">
                        {c.hint}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exercise.periods.map((p, i) => (
                  <tr key={p.label} className="border-t border-slate-100">
                    <td className="px-2 py-1.5 font-semibold text-slate-800">
                      {p.label}
                    </td>
                    {COLS.map((c) => {
                      const state = result?.cellResults?.[i]?.[c.key];
                      let tone = "border-slate-300";
                      if (showSolution) tone = "border-emerald-400 bg-emerald-50 text-emerald-700";
                      else if (state === "ok") tone = "border-emerald-400 bg-emerald-50 text-emerald-700";
                      else if (state === "wrong") tone = "border-rose-400 bg-rose-50 text-rose-600";
                      const shown = showSolution
                        ? RATIO_FIELDS.includes(c.key)
                          ? sol.rows[i][c.key].toFixed(2)
                          : sol.rows[i][c.key]
                        : inputs[i][c.key];
                      return (
                        <td key={c.key} className="px-1 py-1">
                          <input
                            aria-label={`Month ${p.label} ${c.label}`}
                            value={shown}
                            readOnly={showSolution}
                            onChange={(e) => setField(i, c.key, e.target.value)}
                            className={`w-full rounded-lg border px-2 py-1.5 text-center text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${tone}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">
            Enter money as plain numbers (no separators). Round CPI / SPI to 2
            decimals (±0.01 accepted).
          </p>
        </CardContent>
      </Card>

      {/* interpretation */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-semibold text-slate-700">
            Final status (from the last period's CPI &amp; SPI)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatusSelect
              label="Cost status"
              value={showSolution ? sol.status.cost : costGuess}
              onChange={(v) => {
                setCostGuess(v);
                setResult(null);
              }}
              options={COST_STATUS}
              disabled={showSolution}
              ok={result?.costOk}
            />
            <StatusSelect
              label="Schedule status"
              value={showSolution ? sol.status.schedule : schedGuess}
              onChange={(v) => {
                setSchedGuess(v);
                setResult(null);
              }}
              options={SCHEDULE_STATUS}
              disabled={showSolution}
              ok={result?.schedOk}
            />
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button onClick={check}>Check answers</Button>
            <Button variant="outline" onClick={reveal}>
              Show solution
            </Button>
          </div>

          {result && (
            <ResultBanner result={result} />
          )}
          {showSolution && (
            <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100">
              Final CPI <strong>{sol.final.cpi.toFixed(2)}</strong> ·{" "}
              SPI <strong>{sol.final.spi.toFixed(2)}</strong> → cost{" "}
              <strong className="text-emerald-300">
                {COST_STATUS[sol.status.cost]}
              </strong>
              , schedule{" "}
              <strong className="text-emerald-300">
                {SCHEDULE_STATUS[sol.status.schedule]}
              </strong>
              .
            </div>
          )}
        </CardContent>
      </Card>

      <Legend />
    </div>
  );
}

function StatusSelect({ label, value, onChange, options, disabled, ok }) {
  let ring = "border-slate-300";
  if (ok === true) ring = "border-emerald-400 bg-emerald-50";
  else if (ok === false) ring = "border-rose-400 bg-rose-50";
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${ring}`}
      >
        <option value="">Select…</option>
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </label>
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
          ? "Perfect — all figures, KPIs and the status are correct!"
          : `${result.correct}/${result.total} table cells correct (${pct}%).`}
      </p>
      <p className="text-xs">
        Cost status: <strong>{result.costOk ? "correct ✓" : "not yet ✕"}</strong> ·
        Schedule status:{" "}
        <strong>{result.schedOk ? "correct ✓" : "not yet ✕"}</strong>
      </p>
    </div>
  );
}

function Legend() {
  const rows = [
    ["CV", "EV − AC", "Cost variance. Positive = under budget."],
    ["SV", "EV − PV", "Schedule variance. Positive = ahead of schedule."],
    ["CPI", "EV / AC", "> 1 under budget · = 1 on budget · < 1 over budget."],
    ["SPI", "EV / PV", "> 1 ahead · = 1 on schedule · < 1 behind."],
  ];
  return (
    <div className="rounded-2xl bg-white p-5 text-sm shadow-sm">
      <h4 className="mb-3 font-semibold text-slate-800">Formula reference</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map(([k, f, d]) => (
          <div key={k} className="rounded-xl bg-slate-50 p-3">
            <p className="font-mono text-xs font-bold text-indigo-700">
              {k} = {f}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        All KPIs use the <strong>cumulative</strong> PV / EV / AC up to and
        including that period.
      </p>
    </div>
  );
}
