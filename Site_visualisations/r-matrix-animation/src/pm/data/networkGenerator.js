// ─────────────────────────────────────────────────────────────────────────────
// Activity-on-node network generator + solver.
//
// Supports BOTH scheduling conventions:
//   • "day0" (zero-based):  start ES = 0,  EF = ES + Dur,      ES = max(pred.EF)
//                           LS = LF - Dur,  LF = min(succ.LS),  Float = LS - ES
//   • "day1" (one-based):   start ES = 1,  EF = ES + Dur - 1,  ES = max(pred.EF)+1
//                           LS = LF - Dur + 1, LF = min(succ.LS)-1, Float = LS - ES
//
// Float (and therefore the critical path) is identical under both conventions.
// ─────────────────────────────────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHIJ".split("");
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

/**
 * Generate a random, well-formed activity network with a single start and a
 * single finishing activity (so the diagram always lays out cleanly).
 * @returns {{activities: Array<{id,dur,preds:string[]}>}}
 */
export function generateNetwork() {
  const n = randInt(7, 8); // small–medium
  const ids = ALPHABET.slice(0, n);
  const preds = {};
  ids.forEach((id) => (preds[id] = []));

  // A = single start (no predecessors)
  // Two branches spring from A
  preds[ids[1]] = [ids[0]];
  preds[ids[2]] = [ids[0]];

  // middle activities (everything except the last) chain from earlier ones
  for (let i = 3; i < n - 1; i++) {
    const earlier = ids.slice(1, i); // not A, not itself
    const count = earlier.length >= 2 && Math.random() < 0.4 ? 2 : 1;
    const chosen = new Set();
    while (chosen.size < count) chosen.add(pick(earlier));
    preds[ids[i]] = [...chosen];
  }

  // last activity = single sink: depends on every node that has no successor
  const last = ids[n - 1];
  const hasSuccessor = new Set();
  ids.forEach((id) => preds[id].forEach((p) => hasSuccessor.add(p)));
  const leaves = ids.filter(
    (id) => id !== last && !hasSuccessor.has(id)
  );
  preds[last] = leaves.length ? leaves : [ids[n - 2]];

  const activities = ids.map((id) => ({
    id,
    dur: randInt(2, 9),
    preds: preds[id],
  }));

  return { activities };
}

/** Topological order (Kahn's algorithm). */
function topoOrder(activities) {
  const byId = Object.fromEntries(activities.map((a) => [a.id, a]));
  const indeg = Object.fromEntries(activities.map((a) => [a.id, a.preds.length]));
  const queue = activities.filter((a) => a.preds.length === 0).map((a) => a.id);
  const succ = Object.fromEntries(activities.map((a) => [a.id, []]));
  activities.forEach((a) => a.preds.forEach((p) => succ[p].push(a.id)));

  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    succ[id].forEach((s) => {
      indeg[s] -= 1;
      if (indeg[s] === 0) queue.push(s);
    });
  }
  return { order, succ, byId };
}

/**
 * Solve forward & backward pass for a given convention.
 * @returns {{ cells: Record<id,{es,ef,ls,lf,float}>, projectDuration:number, critical:string[] }}
 */
export function solveNetwork(activities, method = "day0") {
  const one = method === "day1" ? 1 : 0;
  const { order, succ, byId } = topoOrder(activities);
  const cells = {};

  // forward pass
  order.forEach((id) => {
    const a = byId[id];
    const es = a.preds.length
      ? Math.max(...a.preds.map((p) => cells[p].ef)) + one
      : one;
    const ef = es + a.dur - one;
    cells[id] = { es, ef };
  });

  const projectDuration = Math.max(...order.map((id) => cells[id].ef));

  // backward pass (reverse topological)
  [...order].reverse().forEach((id) => {
    const a = byId[id];
    const successors = succ[id];
    const lf = successors.length
      ? Math.min(...successors.map((s) => cells[s].ls)) - one
      : projectDuration;
    const ls = lf - a.dur + one;
    cells[id] = { ...cells[id], lf, ls, float: ls - cells[id].es };
  });

  const critical = order.filter((id) => cells[id].float === 0);

  return { cells, projectDuration, critical };
}

/**
 * Assign a column (longest path from start) and a row to each activity so the
 * UI can position the nodes left→right by dependency depth.
 * @returns {{ pos: Record<id,{col,row}>, cols:number, rows:number }}
 */
export function layoutNetwork(activities) {
  const { order, byId } = topoOrder(activities);
  const col = {};
  order.forEach((id) => {
    const a = byId[id];
    col[id] = a.preds.length ? Math.max(...a.preds.map((p) => col[p])) + 1 : 0;
  });

  const cols = Math.max(...Object.values(col)) + 1;
  const rowCounter = Array(cols).fill(0);
  const pos = {};
  // keep activities in alphabetical order within a column for stable layout
  [...activities]
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach((a) => {
      const c = col[a.id];
      pos[a.id] = { col: c, row: rowCounter[c] };
      rowCounter[c] += 1;
    });

  const rows = Math.max(...rowCounter);
  return { pos, cols, rows };
}

/** Build the successor map (used by the UI to draw arrows). */
export function successorMap(activities) {
  const succ = Object.fromEntries(activities.map((a) => [a.id, []]));
  activities.forEach((a) => a.preds.forEach((p) => succ[p].push(a.id)));
  return succ;
}
