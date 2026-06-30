import { useState } from "react";
import { MatrixFillScene } from "../scenes/MatrixFillScene.jsx";
import { DollarSelectionScene } from "../scenes/DollarSelectionScene.jsx";
import { ApplyScene } from "../scenes/ApplyScene.jsx";
import { CombinatoricsScene } from "../scenes/CombinatoricsScene.jsx";
import { BayesScene } from "../scenes/BayesScene.jsx";

const tabs = [
  { id: "matrix", label: "matrix() fill order" },
  { id: "dollar", label: "$ column selection" },
  { id: "apply", label: "sapply & mapply" },
  { id: "combinatorics", label: "Combinatorics" },
  { id: "bayes", label: "Bayes' Theorem" },
];

const scenes = {
  matrix: <MatrixFillScene />,
  dollar: <DollarSelectionScene />,
  apply: <ApplyScene />,
  combinatorics: <CombinatoricsScene />,
  bayes: <BayesScene />,
};

export function RVisualisationsPage() {
  const [tab, setTab] = useState("matrix");

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm">
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

      {scenes[tab]}
    </div>
  );
}
