// ─────────────────────────────────────────────────────────────────────────────
// Lightweight per-user persistence for quiz history, backed by localStorage.
// No backend needed — every user is a named local profile on this browser.
// ─────────────────────────────────────────────────────────────────────────────

const USERS_KEY = "pm_quiz_users";
const CURRENT_USER_KEY = "pm_quiz_current_user";
const historyKey = (user) => `pm_quiz_history_${user}`;

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ── users ────────────────────────────────────────────────────────────────────
export function getUsers() {
  return read(USERS_KEY, []);
}

export function getCurrentUser() {
  return read(CURRENT_USER_KEY, null);
}

export function setCurrentUser(name) {
  write(CURRENT_USER_KEY, name);
}

/** Create the user if new, set them current, and return the cleaned name. */
export function addUser(rawName) {
  const name = String(rawName || "").trim();
  if (!name) return null;
  const users = getUsers();
  if (!users.some((u) => u.toLowerCase() === name.toLowerCase())) {
    write(USERS_KEY, [...users, name]);
  }
  setCurrentUser(name);
  return name;
}

export function removeUser(name) {
  write(
    USERS_KEY,
    getUsers().filter((u) => u !== name)
  );
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(historyKey(name));
  }
  if (getCurrentUser() === name) setCurrentUser(null);
}

// ── history ──────────────────────────────────────────────────────────────────
export function getHistory(user) {
  if (!user) return [];
  return read(historyKey(user), []);
}

/**
 * Persist a finished attempt.
 * @returns the stored attempt record (with generated id/date).
 */
export function saveAttempt(user, attempt) {
  if (!user) return null;
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    ...attempt,
  };
  const history = getHistory(user);
  write(historyKey(user), [record, ...history]);
  return record;
}

export function clearHistory(user) {
  if (!user) return;
  write(historyKey(user), []);
}

/** Replace a stored attempt (matched by id) — used to persist manual overrides. */
export function updateAttempt(user, record) {
  if (!user || !record?.id) return;
  const history = getHistory(user).map((a) => (a.id === record.id ? { ...a, ...record } : a));
  write(historyKey(user), history);
}

/** Aggregate stats across a user's whole history (for the dashboard). */
export function summariseHistory(history) {
  const attempts = history.length;
  const totalCorrect = history.reduce((s, a) => s + a.correct, 0);
  const totalQuestions = history.reduce((s, a) => s + a.total, 0);
  const bestPct = history.reduce(
    (best, a) => Math.max(best, a.total ? (a.correct / a.total) * 100 : 0),
    0
  );
  const avgPct = totalQuestions ? (totalCorrect / totalQuestions) * 100 : 0;
  return { attempts, totalCorrect, totalQuestions, bestPct, avgPct };
}
