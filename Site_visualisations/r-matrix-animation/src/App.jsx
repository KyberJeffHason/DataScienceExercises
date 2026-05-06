import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Card({ className = "", children, ...rest }) {
  return (
    <div className={`bg-white ${className}`} {...rest}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

function Button({ variant = "default", className = "", children, ...rest }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

const values = [1, 2, 3, 4, 5, 6];
const rows = 2;
const cols = 3;

function getCellPosition(index, byrow) {
  if (byrow) {
    return {
      row: Math.floor(index / cols),
      col: index % cols,
    };
  }
  return {
    row: index % rows,
    col: Math.floor(index / rows),
  };
}

function makeMatrix(step, byrow) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (let i = 0; i < step; i++) {
    const { row, col } = getCellPosition(i, byrow);
    grid[row][col] = values[i];
  }
  return grid;
}

function finalMatrix(byrow) {
  return makeMatrix(values.length, byrow);
}

function MatrixGrid({ step, byrow }) {
  const grid = useMemo(() => makeMatrix(step, byrow), [step, byrow]);
  const active = step > 0 && step <= values.length ? getCellPosition(step - 1, byrow) : null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {grid.flatMap((row, r) =>
        row.map((value, c) => {
          const isActive = active && active.row === r && active.col === c;
          return (
            <motion.div
              key={`${r}-${c}-${byrow}`}
              layout
              className={`h-20 w-20 rounded-2xl border flex items-center justify-center text-2xl font-bold shadow-sm ${
                isActive ? "bg-slate-900 text-white" : value ? "bg-white" : "bg-slate-100"
              }`}
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <AnimatePresence mode="wait">
                {value !== null ? (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {value}
                  </motion.span>
                ) : (
                  <span className="text-slate-300">·</span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

function VectorStrip({ step }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-medium text-slate-500">Input vector:</span>
      {values.map((v, i) => (
        <motion.div
          key={v}
          className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold shadow-sm ${
            i === step - 1 ? "bg-slate-900 text-white" : i < step ? "bg-white" : "bg-slate-100 text-slate-400"
          }`}
          animate={{ y: i === step - 1 ? -6 : 0, scale: i === step - 1 ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          {v}
        </motion.div>
      ))}
    </div>
  );
}

function ArrowPath({ byrow }) {
  const order = values.map((_, i) => getCellPosition(i, byrow));
  return (
    <div className="mt-5 rounded-2xl bg-slate-100 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-600">Fill order</div>
      <div className="flex flex-wrap gap-2">
        {order.map(({ row, col }, i) => (
          <React.Fragment key={i}>
            <div className="rounded-xl bg-white px-3 py-2 text-sm shadow-sm">
              {values[i]} → [{row + 1}, {col + 1}]
            </div>
            {i < order.length - 1 && <div className="self-center text-slate-400">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function RCode({ byrow }) {
  const matrix = finalMatrix(byrow);
  return (
    <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner">
{`matrix(1:6, nrow = 2, ncol = 3${byrow ? ", byrow = TRUE" : ""})

     [,1] [,2] [,3]
[1,]   ${matrix[0][0]}    ${matrix[0][1]}    ${matrix[0][2]}
[2,]   ${matrix[1][0]}    ${matrix[1][1]}    ${matrix[1][2]}`}
    </pre>
  );
}

function MatrixFillScene() {
  const [byrow, setByrow] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((current) => (current >= values.length ? 0 : current + 1));
    }, 900);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    setStep(0);
    setPlaying(true);
  }, [byrow]);

  const title = byrow ? "byrow = TRUE: fill across each row" : "Default in R: fill down each column";
  const explanation = byrow
    ? "With byrow = TRUE, R places 1, 2, 3 across the first row, then 4, 5, 6 across the second row."
    : "By default, R fills matrices column by column: 1, 2 go down the first column, then 3, 4, then 5, 6.";

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">How R fills a matrix</h1>
        <p className="mt-2 text-slate-600">Same vector, same dimensions — different fill direction.</p>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <VectorStrip step={step} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setByrow(false)} variant={!byrow ? "default" : "outline"}>
                Default
              </Button>
              <Button onClick={() => setByrow(true)} variant={byrow ? "default" : "outline"}>
                byrow = TRUE
              </Button>
              <Button onClick={() => setPlaying((p) => !p)} variant="outline">
                {playing ? "Pause" : "Play"}
              </Button>
              <Button onClick={() => setStep(0)} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_1.05fr] md:items-start">
            <div className="flex justify-center rounded-3xl bg-slate-100 p-6">
              <MatrixGrid step={step} byrow={byrow} />
            </div>

            <div className="space-y-4">
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-2 text-slate-600">{explanation}</p>
                <p className="mt-3 text-sm text-slate-500">
                  The active number is highlighted in both the input vector and the matrix cell where R places it.
                </p>
              </motion.div>

              <RCode byrow={byrow} />
            </div>
          </div>

          <ArrowPath byrow={byrow} />
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Key idea</h2>
        <p className="mt-2 text-slate-600">
          In R, <code className="rounded bg-slate-100 px-1 py-0.5">matrix()</code> fills by column unless you add
          <code className="rounded bg-slate-100 px-1 py-0.5"> byrow = TRUE</code>. This is why the same values can appear in different positions.
        </p>
      </div>
    </>
  );
}

const dfRows = [
  { name: "Ada", age: 30, score: 88 },
  { name: "Lin", age: 24, score: 92 },
  { name: "Mia", age: 41, score: 75 },
  { name: "Sam", age: 19, score: 81 },
];
const dfColumns = [
  { key: "name", type: "chr", quoted: true },
  { key: "age", type: "num", quoted: false },
  { key: "score", type: "num", quoted: false },
];

function formatRValue(value, quoted) {
  return quoted ? `"${value}"` : String(value);
}

function DataFrameTable({ selected }) {
  return (
    <div className="inline-block rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-[auto_repeat(3,_minmax(0,_1fr))] gap-x-4 gap-y-2 text-sm">
        <div />
        {dfColumns.map((col) => {
          const isActive = col.key === selected;
          return (
            <motion.div
              key={col.key}
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`rounded-lg px-3 py-1 text-center font-mono font-semibold ${
                isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {col.key}
            </motion.div>
          );
        })}

        {dfRows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="self-center pr-1 text-right font-mono text-xs text-slate-400">
              [{rowIndex + 1},]
            </div>
            {dfColumns.map((col) => {
              const isActive = col.key === selected;
              return (
                <motion.div
                  key={col.key}
                  animate={{
                    backgroundColor: isActive ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)",
                    color: isActive ? "rgb(255, 255, 255)" : "rgb(15, 23, 42)",
                    scale: isActive ? 1.03 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="min-w-[72px] rounded-lg border border-slate-200 px-3 py-1.5 text-center font-mono"
                >
                  {formatRValue(row[col.key], col.quoted)}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ResultVector({ selected }) {
  const col = dfColumns.find((c) => c.key === selected);
  const items = dfRows.map((row) => formatRValue(row[selected], col.quoted));

  return (
    <div className="rounded-2xl bg-slate-100 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <code className="rounded bg-white px-2 py-1 font-mono text-slate-900 shadow-sm">
          df$<span className="text-violet-600">{selected}</span>
        </code>
        <span className="text-slate-400">returns a vector of</span>
        <code className="rounded bg-white px-2 py-1 font-mono text-slate-900 shadow-sm">
          {col.type}
        </code>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="flex flex-col gap-2"
        >
          {items.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-center font-mono text-white shadow-sm"
            >
              {value}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DollarRCode({ selected }) {
  const col = dfColumns.find((c) => c.key === selected);
  const formatted = dfRows.map((row) => formatRValue(row[selected], col.quoted)).join(" ");
  return (
    <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner">
{`df <- data.frame(
  name  = c("Ada", "Lin", "Mia", "Sam"),
  age   = c(30, 24, 41, 19),
  score = c(88, 92, 75, 81)
)

> df$${selected}
[1] ${formatted}`}
    </pre>
  );
}

function DollarSelectionScene() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const selected = dfColumns[selectedIndex].key;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setSelectedIndex((current) => (current + 1) % dfColumns.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          What does <code className="rounded bg-slate-200 px-2 py-1 font-mono text-2xl">$</code> do in R?
        </h1>
        <p className="mt-2 text-slate-600">
          It pulls a single column out of a data frame and returns it as a vector.
        </p>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Pick a column or watch the auto-cycle:
            </div>
            <div className="flex flex-wrap gap-2">
              {dfColumns.map((col, i) => (
                <Button
                  key={col.key}
                  onClick={() => {
                    setSelectedIndex(i);
                    setPlaying(false);
                  }}
                  variant={selectedIndex === i ? "default" : "outline"}
                >
                  df${col.key}
                </Button>
              ))}
              <Button onClick={() => setPlaying((p) => !p)} variant="outline">
                {playing ? "Pause" : "Play"}
              </Button>
            </div>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_auto]">
            <div className="flex justify-center rounded-3xl bg-slate-100 p-6">
              <DataFrameTable selected={selected} />
            </div>
            <motion.div
              key={`arrow-${selected}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden text-3xl text-slate-400 md:block"
            >
              →
            </motion.div>
            <ResultVector selected={selected} />
          </div>

          <div className="grid gap-4 md:grid-cols-[1.05fr_1fr] md:items-start">
            <motion.div
              key={`explain-${selected}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">df${selected}</code>{" "}
                extracts the <span className="font-mono">{selected}</span> column
              </h2>
              <p className="mt-2 text-slate-600">
                The result is a plain vector that keeps the column's original type
                (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                  {dfColumns.find((c) => c.key === selected).type}
                </code>
                ). The data frame itself is not modified.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">$</code> looks up the column by name —
                so you write the name unquoted, exactly as it appears in the data frame.
              </p>
            </motion.div>

            <DollarRCode selected={selected} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Key idea & alternatives</h2>
        <p className="mt-2 text-slate-600">
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">$</code> works on data frames and lists. For
          column names with spaces or special characters, use one of these instead — they all return the same vector:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li>
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">df${selected}</code>
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{`df[["${selected}"]]`}</code>
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{`df[, "${selected}"]`}</code>
          </li>
        </ul>
      </div>
    </>
  );
}

const tabs = [
  { id: "matrix", label: "matrix() fill order" },
  { id: "dollar", label: "$ column selection" },
];

export default function App() {
  const [tab, setTab] = useState("matrix");

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-1 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "matrix" ? <MatrixFillScene /> : <DollarSelectionScene />}
      </div>
    </div>
  );
}
