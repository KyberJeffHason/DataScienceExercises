import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function RMatrixByRowAnimation() {
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
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">How R fills a matrix</h1>
          <p className="mt-2 text-slate-600">Same vector, same dimensions — different fill direction.</p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <VectorStrip step={step} />
              <div className="flex gap-2">
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
      </div>
    </div>
  );
}
