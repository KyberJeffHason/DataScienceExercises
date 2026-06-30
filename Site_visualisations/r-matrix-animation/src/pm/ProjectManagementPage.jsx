import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizHub } from "./components/QuizHub.jsx";
import { quizzes, countQuestions } from "./data/quizzes.js";

const subTabs = [
  { id: "overview", label: "Overview" },
  { id: "quizzes", label: "Quizzes" },
];

export function ProjectManagementPage() {
  const [subTab, setSubTab] = useState("overview");

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="mt-2 text-slate-600">
          Core concepts, frameworks and self-assessment quizzes for predictive, agile and hybrid delivery.
        </p>
      </header>

      {/* sub navigation */}
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
          {subTab === "overview" ? <Overview onGoQuizzes={() => setSubTab("quizzes")} /> : <QuizHub />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const TOPICS = [
  { icon: "🧭", title: "Management & Project Basics", desc: "Plan, organise, lead, control. Projects vs. processes and the value of PM." },
  { icon: "📘", title: "PMBOK, Lifecycle & Process Groups", desc: "Best practices, phases and the five process groups." },
  { icon: "📝", title: "Business Case, SOW & Charter", desc: "Justify, scope and authorise a project the right way." },
  { icon: "🎯", title: "Requirements, Scope & WBS", desc: "Capture needs, set boundaries and beat scope creep." },
  { icon: "📅", title: "Activities, Dependencies & Scheduling", desc: "Define work, sequence it and find the critical path." },
  { icon: "💶", title: "Cost & Earned Value Management", desc: "Estimate cost and read CPI/SPI like a pro." },
  { icon: "🌀", title: "Agile Fundamentals", desc: "VUCA, iterative delivery and the agile mindset." },
  { icon: "🏉", title: "SCRUM Framework", desc: "Roles, events and artefacts of empirical delivery." },
  { icon: "🔀", title: "Hybrid & Modern PM", desc: "Blend predictive and agile; leverage digital tools and AI." },
];

function Overview({ onGoQuizzes }) {
  const total = quizzes.reduce((s, q) => s + countQuestions(q), 0);
  return (
    <div className="space-y-6">
      {/* hero */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Master project management, one quiz at a time</h2>
        <p className="mt-2 max-w-2xl text-indigo-100">
          Work through {total} curated questions spanning the full project lifecycle. Choose instant or
          end-of-quiz feedback, get an explanation for every option — right and wrong — and track your
          progress across sessions.
        </p>
        <button
          onClick={onGoQuizzes}
          className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
        >
          Go to quizzes →
        </button>
      </div>

      {/* topic grid */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Topics covered
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-2xl">{t.icon}</div>
              <h4 className="mt-2 font-semibold text-slate-900">{t.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* feature strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Feature icon="⚡" title="Two feedback modes" desc="Learn as you go, or test exam-style and review at the end." />
        <Feature icon="💡" title="Explained answers" desc="Every option tells you why it's right or wrong." />
        <Feature icon="📊" title="Tracked history" desc="Per-profile scores, attempts and best results saved locally." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
