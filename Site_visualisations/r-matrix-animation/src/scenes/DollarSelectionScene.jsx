import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

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

export function DollarSelectionScene() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
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
          Think of a data frame like a spreadsheet. <code className="rounded bg-slate-200 px-1 font-mono">$</code> lets you grab one whole column from it by name.
        </p>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Pick a column or press Play to auto-cycle:
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
                You get back a simple list of all the values in that column — here they are{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                  {dfColumns.find((c) => c.key === selected).type}
                </code>{" "}
                values. The original data frame stays exactly as it was, nothing is deleted or changed.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Just write the column name after <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">$</code> — no quotes needed, exactly as it appears in the table.
              </p>
            </motion.div>

            <DollarRCode selected={selected} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">The key thing to remember</h2>
        <p className="mt-2 text-slate-600">
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">$</code> is the quickest way to grab a column.
          If your column name has a space or a special character in it, use double brackets instead.
          All three lines below do exactly the same thing:
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
