import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizHub } from "./components/QuizHub.jsx";
import { NetworkDiagramTrainer } from "./components/NetworkDiagramTrainer.jsx";
import { EvmTrainer } from "./components/EvmTrainer.jsx";
import { WbsTrainer } from "./components/WbsTrainer.jsx";

const subTabs = [
  { id: "quizzes", label: "Quizzes" },
  { id: "network", label: "Network Diagram" },
  { id: "evm", label: "Earned Value" },
  { id: "wbs", label: "WBS" },
];

export function ProjectManagementPage() {
  const [subTab, setSubTab] = useState("quizzes");

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="mt-2 text-slate-600">
          Self-assessment quizzes and a network-diagram trainer for project scheduling.
        </p>
      </header>

      <div className="flex justify-center">
        <div className="inline-flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {subTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-colors ${
                subTab === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {subTab === "quizzes" ? (
            <QuizHub />
          ) : subTab === "network" ? (
            <NetworkDiagramTrainer />
          ) : subTab === "evm" ? (
            <EvmTrainer />
          ) : (
            <WbsTrainer />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
