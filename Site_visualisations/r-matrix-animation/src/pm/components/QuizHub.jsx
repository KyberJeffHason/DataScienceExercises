import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/Card.jsx";
import { Button } from "../../components/Button.jsx";
import { quizzes, countQuestions } from "../data/quizzes.js";
import {
  getUsers,
  getCurrentUser,
  addUser,
  setCurrentUser,
  removeUser,
  getHistory,
  saveAttempt,
  clearHistory,
  summariseHistory,
} from "../storage.js";
import { QuizRunner } from "./QuizRunner.jsx";
import { QuizResults } from "./QuizResults.jsx";

// view: "browse" (pick quiz) → "config" (set feedback) → "running" → "results"
export function QuizHub() {
  // hydrate from localStorage lazily on first render
  const [users, setUsers] = useState(() => getUsers());
  const [user, setUser] = useState(() => getCurrentUser());
  const [history, setHistory] = useState(() => getHistory(getCurrentUser()));

  const [view, setView] = useState("browse");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [feedbackMode, setFeedbackMode] = useState("immediate");
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [runKey, setRunKey] = useState(0); // bump to force a fresh runner
  const [lastResult, setLastResult] = useState(null);

  function refreshHistory(u) {
    setHistory(getHistory(u));
  }

  function handleSwitchUser(name) {
    setCurrentUser(name);
    setUser(name);
    refreshHistory(name);
  }

  function handleFinish(result) {
    saveAttempt(user, {
      quizId: result.quizId,
      quizTitle: result.quizTitle,
      feedbackMode: result.feedbackMode,
      total: result.total,
      correct: result.correct,
      wrong: result.wrong,
      durationMs: result.durationMs,
    });
    refreshHistory(user);
    setLastResult(result);
    setView("results");
  }

  function startQuiz() {
    setRunKey((k) => k + 1);
    setView("running");
  }

  // ── no user yet ──
  if (!user) {
    return <UserGate onCreate={(name) => {
      const created = addUser(name);
      if (created) {
        setUsers(getUsers());
        setUser(created);
        refreshHistory(created);
      }
    }} />;
  }

  // ── running a quiz ──
  if (view === "running" && activeQuiz) {
    return (
      <QuizRunner
        key={runKey}
        quiz={activeQuiz}
        feedbackMode={feedbackMode}
        shuffleQuestions={shuffleQuestions}
        shuffleAnswers={shuffleAnswers}
        onFinish={handleFinish}
        onExit={() => setView("browse")}
      />
    );
  }

  // ── results ──
  if (view === "results" && lastResult) {
    return (
      <QuizResults
        result={lastResult}
        onRetry={startQuiz}
        onHome={() => setView("browse")}
      />
    );
  }

  // ── pre-quiz config ──
  if (view === "config" && activeQuiz) {
    return (
      <ConfigScreen
        quiz={activeQuiz}
        feedbackMode={feedbackMode}
        setFeedbackMode={setFeedbackMode}
        shuffleQuestions={shuffleQuestions}
        setShuffleQuestions={setShuffleQuestions}
        shuffleAnswers={shuffleAnswers}
        setShuffleAnswers={setShuffleAnswers}
        onStart={startQuiz}
        onCancel={() => setView("browse")}
      />
    );
  }

  // ── browse (default) ──
  return (
    <div className="space-y-6">
      <UserBar
        users={users}
        user={user}
        onSwitch={handleSwitchUser}
        onAdd={(name) => {
          const created = addUser(name);
          if (created) {
            setUsers(getUsers());
            handleSwitchUser(created);
          }
        }}
        onRemove={(name) => {
          removeUser(name);
          const remaining = getUsers();
          setUsers(remaining);
          const next = getCurrentUser();
          setUser(next);
          refreshHistory(next);
        }}
      />

      <HistoryDashboard
        history={history}
        onClear={() => {
          clearHistory(user);
          refreshHistory(user);
        }}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Available quizzes
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes.map((q) => {
            const attempts = history.filter((h) => h.quizId === q.id);
            const best = attempts.reduce(
              (m, a) => Math.max(m, a.total ? (a.correct / a.total) * 100 : 0),
              0
            );
            return (
              <QuizCard
                key={q.id}
                quiz={q}
                attempts={attempts.length}
                best={best}
                onSelect={() => {
                  setActiveQuiz(q);
                  setView("config");
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function UserGate({ onCreate }) {
  const [name, setName] = useState("");
  return (
    <Card className="mx-auto max-w-md rounded-3xl shadow-lg">
      <CardContent className="space-y-4 p-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
          🎓
        </div>
        <div>
          <h2 className="text-xl font-bold">Welcome to the PM Quiz</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter a name to track your quiz history on this device.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(name);
            setName("");
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <Button type="submit" disabled={!name.trim()}>
            Start
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function UserBar({ users, user, onSwitch, onAdd, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
      <span className="px-1 text-sm font-medium text-slate-500">Profile:</span>
      {users.map((u) => (
        <button
          key={u}
          onClick={() => onSwitch(u)}
          className={`group flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
            u === user
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {u}
          {u === user && users.length > 1 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete profile "${u}" and its history?`)) onRemove(u);
              }}
              className="ml-0.5 rounded-full px-1 text-xs text-indigo-200 hover:text-white"
            >
              ✕
            </span>
          )}
        </button>
      ))}

      {adding ? (
        <form
          className="flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd(name);
            setName("");
            setAdding(false);
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New name"
            className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <Button type="submit" className="px-2 py-1 text-xs" disabled={!name.trim()}>
            Add
          </Button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
        >
          + Profile
        </button>
      )}
    </div>
  );
}

function HistoryDashboard({ history, onClear }) {
  const stats = summariseHistory(history);
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Your history</h3>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all attempt history for this profile?")) onClear();
              }}
              className="text-xs font-medium text-slate-400 hover:text-rose-500"
            >
              Clear history
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Attempts" value={stats.attempts} />
          <MiniStat label="Best score" value={`${Math.round(stats.bestPct)}%`} />
          <MiniStat label="Avg score" value={`${Math.round(stats.avgPct)}%`} />
          <MiniStat
            label="Total correct"
            value={`${stats.totalCorrect}/${stats.totalQuestions}`}
          />
        </div>

        {history.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            No attempts yet — pick a quiz below to get started.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-semibold">Quiz</th>
                  <th className="px-4 py-2 font-semibold">Date</th>
                  <th className="px-4 py-2 text-center font-semibold">Correct</th>
                  <th className="px-4 py-2 text-center font-semibold">Wrong</th>
                  <th className="px-4 py-2 text-center font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => {
                  const pct = a.total ? Math.round((a.correct / a.total) * 100) : 0;
                  return (
                    <tr key={a.id} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-medium text-slate-700">
                        {a.quizTitle}
                      </td>
                      <td className="px-4 py-2 text-slate-500">
                        {new Date(a.date).toLocaleDateString()}{" "}
                        <span className="text-slate-300">
                          {new Date(a.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-emerald-600">
                        {a.correct}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-rose-600">
                        {a.wrong}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            pct >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : pct >= 50
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function QuizCard({ quiz, attempts, best, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={onSelect}
      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg font-bold text-slate-900">{quiz.title}</h4>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {countQuestions(quiz)} Q
        </span>
      </div>
      <p className="mt-1 text-xs font-medium text-slate-500">{quiz.subtitle}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {quiz.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">
          {attempts > 0
            ? `${attempts} attempt${attempts > 1 ? "s" : ""} · best ${Math.round(best)}%`
            : "Not attempted yet"}
        </span>
        <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors group-hover:bg-indigo-600">
          Start →
        </span>
      </div>
    </motion.button>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
        checked ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-300"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function ConfigScreen({
  quiz,
  feedbackMode,
  setFeedbackMode,
  shuffleQuestions,
  setShuffleQuestions,
  shuffleAnswers,
  setShuffleAnswers,
  onStart,
  onCancel,
}) {
  const modes = [
    {
      id: "immediate",
      icon: "⚡",
      title: "Immediate feedback",
      desc: "See whether each answer is right or wrong — with explanations — the moment you answer.",
    },
    {
      id: "end",
      icon: "🏁",
      title: "Feedback at the end",
      desc: "Answer everything exam-style, then review all answers and explanations on the results screen.",
    },
  ];
  return (
    <Card className="mx-auto max-w-2xl rounded-3xl shadow-lg">
      <CardContent className="space-y-6 p-7">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{quiz.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{quiz.subtitle}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            How would you like feedback?
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {modes.map((m) => {
              const active = feedbackMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setFeedbackMode(m.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                    active
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-semibold text-slate-900">{m.title}</span>
                    {active && (
                      <span className="ml-auto text-indigo-600">✓</span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Randomise</p>
          <div className="space-y-2">
            <ToggleRow
              label="Shuffle question order"
              desc="Present the questions in a random sequence."
              checked={shuffleQuestions}
              onChange={() => setShuffleQuestions((v) => !v)}
            />
            <ToggleRow
              label="Shuffle answer order"
              desc="Randomise the order of options within each question."
              checked={shuffleAnswers}
              onChange={() => setShuffleAnswers((v) => !v)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <Button variant="outline" onClick={onCancel}>
            ← Back
          </Button>
          <Button onClick={onStart}>Begin quiz →</Button>
        </div>
      </CardContent>
    </Card>
  );
}
