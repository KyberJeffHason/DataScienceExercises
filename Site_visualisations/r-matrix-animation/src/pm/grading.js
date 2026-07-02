// ─────────────────────────────────────────────────────────────────────────────
// Shared grading helpers used by QuizRunner (scoring at finish) and QuizResults
// (manual overrides / self-grading). Keeping them here guarantees the run-time
// and review-time logic stay in sync.
// ─────────────────────────────────────────────────────────────────────────────

/** Normalize a free-text answer: trim, collapse inner whitespace, lowercase. */
export function normalizeText(s, { caseSensitive = false, trim = true } = {}) {
  let v = String(s ?? "");
  if (trim) v = v.trim();
  v = v.replace(/\s+/g, " ");
  if (!caseSensitive) v = v.toLowerCase();
  return v;
}

/** True if `value` matches any accepted answer, using the normalization opts. */
export function textMatches(accepted, value, opts = {}) {
  const norm = normalizeText(value, opts);
  if (norm === "") return false;
  return (accepted || []).some((a) => normalizeText(a, opts) === norm);
}

/** Parse a cloze prompt into segments: { text } | { blank: id }. */
export function parseCloze(prompt) {
  const parts = [];
  const re = /\{\{(\w+)\}\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(prompt)) !== null) {
    if (m.index > last) parts.push({ text: prompt.slice(last, m.index) });
    parts.push({ blank: m[1] });
    last = m.index + m[0].length;
  }
  if (last < prompt.length) parts.push({ text: prompt.slice(last) });
  return parts;
}

// ── auto-graders (return a boolean) ──────────────────────────────────────────

export function gradeMulti(q, selected = []) {
  const correctIds = q.options
    .filter((o) => o.correct)
    .map((o) => o.id)
    .sort();
  const sel = [...new Set(selected)].sort();
  return (
    correctIds.length > 0 &&
    correctIds.length === sel.length &&
    correctIds.every((id, i) => id === sel[i])
  );
}

export function gradeText(q, value) {
  return textMatches(q.answers, value, {
    caseSensitive: q.caseSensitive,
    trim: q.trim,
  });
}

export function gradeCloze(q, map = {}) {
  const ids = Object.keys(q.blanks || {});
  return (
    ids.length > 0 &&
    ids.every((bid) =>
      textMatches(q.blanks[bid], map[bid], {
        caseSensitive: q.caseSensitive,
        trim: q.trim,
      })
    )
  );
}

export function gradeMatrix(q, placements = {}) {
  return q.items.every((it) => {
    const p = placements[it.id];
    return p && p.row === it.row && p.col === it.column;
  });
}

// ── grading model ────────────────────────────────────────────────────────────
// Every graded breakdown item carries:
//   autoCorrect   — system result (null for recall / malformed manual-only)
//   manualCorrect — user override / self-grade (null if none)
//   finalCorrect  — what counts toward the score
//   gradingMode   — "auto" | "manual" | "self"

export function buildGrading({ type, autoCorrect, manualCorrect = null }) {
  if (type === "recall") {
    return {
      autoCorrect: null,
      manualCorrect,
      finalCorrect: manualCorrect,
      gradingMode: "self",
    };
  }
  const finalCorrect = manualCorrect != null ? manualCorrect : autoCorrect;
  const gradingMode = manualCorrect != null ? "manual" : "auto";
  return { autoCorrect, manualCorrect, finalCorrect, gradingMode };
}

// ── validation (dev-friendly guardrails) ─────────────────────────────────────

export function validateQuestion(q) {
  switch (q.type) {
    case "multi":
      if (!Array.isArray(q.options) || q.options.length < 2)
        return "multi: needs at least two options.";
      if (!q.options.some((o) => o.correct))
        return "multi: needs at least one correct option.";
      return null;
    case "text":
      if (!Array.isArray(q.answers) || q.answers.length === 0)
        return "text: needs an answers[] array with at least one accepted answer.";
      return null;
    case "cloze": {
      if (!q.blanks || typeof q.blanks !== "object")
        return "cloze: needs a blanks{} object.";
      const ids = parseCloze(q.prompt || "")
        .filter((p) => p.blank)
        .map((p) => p.blank);
      if (ids.length === 0) return "cloze: prompt has no {{blank}} placeholders.";
      for (const id of ids) {
        if (!Array.isArray(q.blanks[id]) || q.blanks[id].length === 0)
          return `cloze: blank "${id}" has no accepted answers.`;
      }
      return null;
    }
    case "matrix": {
      if (!q.rows?.length || !q.columns?.length || !q.items?.length)
        return "matrix: needs at least one row, one column and one item.";
      const rowIds = new Set(q.rows.map((r) => r.id));
      const colIds = new Set(q.columns.map((c) => c.id));
      for (const it of q.items) {
        if (!rowIds.has(it.row))
          return `matrix: item "${it.id}" has an unknown row "${it.row}".`;
        if (!colIds.has(it.column))
          return `matrix: item "${it.id}" has an unknown column "${it.column}".`;
      }
      return null;
    }
    case "recall":
      if (!q.modelAnswer) return "recall: needs a modelAnswer.";
      return null;
    default:
      return null; // choice / numeric / dnd validated implicitly by the runner
  }
}
