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
 * Generate a small but varied activity network: a single start activity, a
 * random number of parallel horizontal "lanes" (2–3) of uneven length, an
 * occasional merge between adjacent lanes, and a single finishing activity that
 * merges the lane ends.
 *
 * The randomness is bounded so the diagram stays compact and readable (lanes
 * are straight horizontal tracks; the only diagonals are short merges).
 *
 * Each activity carries a `row` hint so the layout can keep lanes on tracks.
 * @returns {{activities: Array<{id,dur,preds:string[],row:number}>}}
 */
export function generateNetwork() {
  // pick a lane structure with 3–5 middle activities total
  const laneLengths = pickLaneLengths();
  const laneCount = laneLengths.length;

  // grid[lane][col] = activity id; ids assigned column-major so the table reads
  // A, then the first column of each lane, then the next column, etc.
  const grid = laneLengths.map(() => []);
  const maxLen = Math.max(...laneLengths);

  let next = 0;
  const id = () => ALPHABET[next++];
  const first = id(); // A = start

  for (let col = 0; col < maxLen; col++) {
    for (let lane = 0; lane < laneCount; lane++) {
      if (col < laneLengths[lane]) grid[lane][col] = id();
    }
  }
  const last = id(); // finish

  const preds = {};
  const row = {};
  preds[first] = [];
  row[first] = (laneCount - 1) / 2; // centred

  grid.forEach((lane, laneIdx) => {
    lane.forEach((nodeId, col) => {
      preds[nodeId] = [col === 0 ? first : lane[col - 1]];
      row[nodeId] = laneIdx;
    });
  });

  // optional single merge: an adjacent lane feeds into one node (short diagonal)
  if (laneCount >= 2 && Math.random() < 0.5) {
    const candidates = [];
    grid.forEach((lane, laneIdx) => {
      lane.forEach((nodeId, col) => {
        if (col === 0) return; // keep the start fan-out clean
        const adj = laneIdx + (Math.random() < 0.5 ? -1 : 1);
        const source = grid[adj]?.[col - 1]; // earlier column → no cycle
        if (source && !preds[nodeId].includes(source)) {
          candidates.push([nodeId, source]);
        }
      });
    });
    if (candidates.length) {
      const [nodeId, source] = candidates[randInt(0, candidates.length - 1)];
      preds[nodeId].push(source);
    }
  }

  // finish merges the last node of each lane
  preds[last] = grid.map((lane) => lane[lane.length - 1]);
  row[last] = (laneCount - 1) / 2; // centred

  const ids = ALPHABET.slice(0, next);
  const activities = ids.map((aId) => ({
    id: aId,
    dur: randInt(2, 9),
    preds: preds[aId],
    row: row[aId],
  }));

  return { activities };
}

/** Random lane lengths giving 3–5 middle activities, varied each time. */
function pickLaneLengths() {
  const shapes = [
    [2, 2], // 4 middle
    [2, 1], // 3
    [1, 2], // 3
    [3, 2], // 5
    [2, 3], // 5
    [3, 1], // 4
    [2, 1, 1], // 3 lanes, 4
    [1, 2, 1], // 3 lanes, 4
    [2, 2, 1], // 3 lanes, 5
  ];
  return shapes[randInt(0, shapes.length - 1)];
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
