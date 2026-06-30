// ─────────────────────────────────────────────────────────────────────────────
// Earned Value Management (EVM) exercise generator + solver.
//
// Per period we GIVE the student PV, EV and AC. They must compute, per period:
//   • Cumulative PV / EV / AC   (running sums)
//   • CV  = EV − AC             (cost variance, on cumulative figures)
//   • SV  = EV − PV             (schedule variance)
//   • CPI = EV / AC             (cost performance index)
//   • SPI = EV / PV             (schedule performance index)
// …plus interpret the final cost & schedule status.
// ─────────────────────────────────────────────────────────────────────────────

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round1000 = (x) => Math.round(x / 1000) * 1000;
const round2 = (x) => Math.round(x * 100) / 100;

const SCENARIOS = [
  { title: "Solar Farm Installation", unit: "months" },
  { title: "Hospital Wing Construction", unit: "months" },
  { title: "ERP Software Migration", unit: "months" },
  { title: "Bridge Retrofit Project", unit: "months" },
  { title: "Cruise Ship Refit", unit: "months" },
  { title: "Wind Turbine Rollout", unit: "months" },
  { title: "Airport Terminal Upgrade", unit: "months" },
  { title: "Data Centre Build-out", unit: "months" },
];

/**
 * Generate a random EVM exercise spanning the full project (so the final
 * cumulative PV equals the budget at completion, BAC).
 * @returns {{ scenario, periods: Array<{label,pv,ev,ac}> }}
 */
export function generateEvm() {
  const scenario = pick(SCENARIOS);
  const months = randInt(3, 4);
  const monthlyBase = randInt(80, 220) * 1000;

  // Bias the whole project toward one of a few realistic situations so the
  // resulting KPIs tell a coherent story.
  const profile = pick([
    { ev: [0.9, 1.05], ac: [0.85, 1.0] }, // healthy
    { ev: [0.7, 0.95], ac: [1.0, 1.2] }, // behind & over budget
    { ev: [0.95, 1.1], ac: [1.05, 1.25] }, // on pace but costly
    { ev: [0.75, 0.95], ac: [0.85, 1.0] }, // behind but cost-efficient
  ]);

  const periods = [];
  for (let i = 0; i < months; i++) {
    const pv = round1000(monthlyBase * (0.9 + Math.random() * 0.2));
    const evFactor = profile.ev[0] + Math.random() * (profile.ev[1] - profile.ev[0]);
    const ev = round1000(pv * evFactor);
    const acFactor = profile.ac[0] + Math.random() * (profile.ac[1] - profile.ac[0]);
    const ac = round1000(ev * acFactor) || 1000;
    periods.push({ label: `${i + 1}`, pv, ev, ac });
  }

  const bac = periods.reduce((s, p) => s + p.pv, 0);

  return { scenario: { ...scenario, months, bac }, periods };
}

/** Solve the full table + final interpretation. */
export function solveEvm(periods) {
  let cumPV = 0;
  let cumEV = 0;
  let cumAC = 0;
  const rows = periods.map((p) => {
    cumPV += p.pv;
    cumEV += p.ev;
    cumAC += p.ac;
    return {
      cumPV,
      cumEV,
      cumAC,
      cv: cumEV - cumAC,
      sv: cumEV - cumPV,
      cpi: round2(cumEV / cumAC),
      spi: round2(cumEV / cumPV),
    };
  });

  const last = rows[rows.length - 1];
  const status = {
    cost: last.cpi > 1 ? "under" : last.cpi < 1 ? "over" : "on",
    schedule: last.spi > 1 ? "ahead" : last.spi < 1 ? "behind" : "on",
  };

  return { rows, status, final: last };
}

export const COST_STATUS = {
  under: "Under budget (cost-efficient)",
  on: "Exactly on budget",
  over: "Over budget",
};
export const SCHEDULE_STATUS = {
  ahead: "Ahead of schedule",
  on: "Exactly on schedule",
  behind: "Behind schedule",
};
