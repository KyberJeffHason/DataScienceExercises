import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RVisualisationsPage } from "./pages/RVisualisationsPage.jsx";
import { ProjectManagementPage } from "./pm/ProjectManagementPage.jsx";

const pages = [
  { id: "r", label: "R Visualisations", icon: "📈" },
  { id: "pm", label: "Project Management", icon: "📋" },
];

export default function App() {
  const [page, setPage] = useState("r");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* top-level page navigation */}
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Data Science Exercises
          </span>
          <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setPage(p.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  page === p.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="mr-1">{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {page === "r" ? <RVisualisationsPage /> : <ProjectManagementPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
