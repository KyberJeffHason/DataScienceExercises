import { useState } from "react";
import { MatrixFillScene } from "./scenes/MatrixFillScene.jsx";
import { DollarSelectionScene } from "./scenes/DollarSelectionScene.jsx";

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
