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

/**
 * Generate a small, clean activity network: a single start activity, two
 * parallel horizontal "lanes" that chain through the middle, and a single
 * finishing activity that merges the lanes. This keeps the diagram compact
 * with very few crossing edges.
 *
 * Each activity carries a `row` hint (0 / 1, with start & finish centred) so
 * the layout can place lanes on straight horizontal tracks.
 * @returns {{activities: Array<{id,dur,preds:string[],row:number}>}}
 */
export function generateNetwork() {
  const n = randInt(5, 6); // small exercise
  const ids = ALPHABET.slice(0, n);
  const first = ids[0];
  const last = ids[n - 1];
  const middle = ids.slice(1, n - 1);

  // split the middle activities into two lanes (alternating)
  const lanes = [[], []];
  middle.forEach((id, i) => lanes[i % 2].push(id));
  // if a lane is empty, borrow from the other so we always have two branches
  if (lanes[1].length === 0 && lanes[0].length > 1) {
    lanes[1].push(lanes[0].pop());
  }

  const preds = {};
  const row = {};
  preds[first] = [];
  row[first] = 0.5; // centred

  lanes.forEach((lane, laneIdx) => {
    lane.forEach((id, i) => {
      preds[id] = [i === 0 ? first : lane[i - 1]];
      row[id] = laneIdx;
    });
  });

  // finish merges the last node of each non-empty lane
  preds[last] = lanes
    .filter((l) => l.length)
    .map((l) => l[l.length - 1]);
  if (preds[last].length === 0) preds[last] = [first];
  row[last] = 0.5; // centred

  const activities = ids.map((id) => ({
    id,
    dur: randInt(2, 9),
    preds: preds[id],
    row: row[id],
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

  // If activities carry a lane `row` hint, honour it for clean horizontal lanes;
  // otherwise stack them within each column.
  const hasRowHints = activities.every((a) => typeof a.row === "number");
  const pos = {};
  if (hasRowHints) {
    activities.forEach((a) => {
      pos[a.id] = { col: col[a.id], row: a.row };
    });
  } else {
    const rowCounter = Array(cols).fill(0);
    [...activities]
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((a) => {
        pos[a.id] = { col: col[a.id], row: rowCounter[col[a.id]] };
        rowCounter[col[a.id]] += 1;
      });
  }

  const rows = Math.max(...activities.map((a) => pos[a.id].row)) + 1;
  return { pos, cols, rows };
}

/** Build the successor map (used by the UI to draw arrows). */
export function successorMap(activities) {
  const succ = Object.fromEntries(activities.map((a) => [a.id, []]));
  activities.forEach((a) => a.preds.forEach((p) => succ[p].push(a.id)));
  return succ;
}
