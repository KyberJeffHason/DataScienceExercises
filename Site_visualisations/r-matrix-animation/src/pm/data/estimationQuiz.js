// Estimation Techniques (PMI) — concept questions plus hands-on calculation
// exercises. Demonstrates the two supported question formats:
//   • choice  — o(id, text, correct, explanation)   (legacy default)
//   • numeric — num(id, prompt, answer, explanation, { unit, tolerance, hint })

const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });
const num = (id, prompt, answer, explanation, extra = {}) => ({
  id,
  type: "numeric",
  prompt,
  answer,
  explanation,
  ...extra,
});

export const estimationQuiz = {
  id: "estimation",
  title: "Estimation Techniques — Hard (Calculations)",
  subtitle: "PERT · Parametric · Analogous · Reserves — number crunching",
  description:
    "Hands-on calculation practice for PMI estimation techniques. Work out PERT " +
    "expected values and standard deviations, scale parametric and analogous estimates, " +
    "and compute cost baselines with contingency and management reserves.",
  sections: [
    // ── 1. Fundamentals (concept) ──────────────────────────────────────────
    {
      id: "fund",
      title: "Estimation Fundamentals",
      questions: [
        {
          id: "q1",
          prompt: "What best describes ANALOGOUS (top-down) estimating?",
          options: [
            o("A", "Estimating each work package in detail and summing the results.", false,
              "That describes bottom-up estimating, not analogous."),
            o("B", "Using the actual cost/duration of a similar past project as the basis for the current estimate.", true,
              "Analogous estimating uses historical data from a comparable project — fast and cheap, but less accurate. It is a form of expert judgment."),
            o("C", "Multiplying a unit rate by the number of units.", false,
              "Multiplying a rate by a quantity is parametric estimating."),
            o("D", "Averaging optimistic, most likely and pessimistic values.", false,
              "Combining three scenario values is three-point estimating."),
          ],
        },
        {
          id: "q2",
          prompt: "What defines PARAMETRIC estimating?",
          options: [
            o("A", "A statistical relationship between historical data and variables, e.g. a unit rate × quantity.", true,
              "Parametric estimating scales a proven per-unit metric (cost/m², hours/drawing) by the amount of work — accurate when the data is reliable and the work is scalable."),
            o("B", "A gut-feel guess from a senior manager.", false,
              "An unstructured guess is not parametric; parametric relies on quantified relationships."),
            o("C", "Breaking the work down and estimating the smallest pieces.", false,
              "That is bottom-up estimating."),
            o("D", "Using the whole of a past project as a single reference point.", false,
              "Using a whole past project as one reference is analogous estimating."),
          ],
        },
        {
          id: "q3",
          prompt: "Which statement about BOTTOM-UP estimating is correct?",
          options: [
            o("A", "It is the quickest and cheapest technique.", false,
              "It is the most time-consuming and costly because every component is estimated."),
            o("B", "It ignores the work breakdown structure.", false,
              "It depends on a detailed WBS — each work package is estimated individually."),
            o("C", "It estimates individual work packages and aggregates them, giving the highest accuracy.", true,
              "Estimating each low-level component and rolling the values up generally yields the most accurate estimate, at the cost of the most effort."),
            o("D", "It can only be used before the scope is known.", false,
              "It requires a well-defined scope/WBS, so it is used once detail is available."),
          ],
        },
        {
          id: "q4",
          prompt: "Why use THREE-POINT estimating instead of a single-point estimate?",
          options: [
            o("A", "To make the estimate a round number.", false,
              "It is about modelling uncertainty, not rounding."),
            o("B", "To account for uncertainty and risk by weighting optimistic, most likely and pessimistic outcomes.", true,
              "Using O, M and P produces an expected value that reflects the range of possible outcomes rather than a single optimistic guess."),
            o("C", "To avoid needing any historical data.", false,
              "It still relies on informed O/M/P inputs; it does not remove the need for data or judgment."),
            o("D", "Because PMI forbids single-point estimates.", false,
              "Single-point estimates are allowed; three-point is chosen when uncertainty matters."),
          ],
        },
        {
          id: "q5",
          prompt: "A Rough Order of Magnitude (ROM) estimate typically has which accuracy range?",
          options: [
            o("A", "−5% to +10%", false,
              "−5% to +10% is the range of a definitive (detailed) estimate, made later with more information."),
            o("B", "−25% to +75%", true,
              "A ROM is an early, low-detail estimate; PMI commonly cites a −25% to +75% range."),
            o("C", "0% (always exact)", false,
              "No estimate is exact — that defeats the purpose of a range."),
            o("D", "−50% to +50%", false,
              "This symmetric range is not the standard PMI figure for ROM."),
          ],
        },
        {
          id: "q6",
          prompt: "How do CONTINGENCY reserves differ from MANAGEMENT reserves?",
          options: [
            o("A", "Contingency covers unknown-unknowns; management covers known risks.", false,
              "It is the reverse — contingency handles identified (known) risks."),
            o("B", "Contingency covers identified risks and sits inside the cost baseline; management reserve covers unknown-unknowns and sits outside the baseline.", true,
              "Contingency is calculated from known risks and is part of the cost baseline; management reserve addresses unforeseen work and is added on top, controlled by management."),
            o("C", "They are two names for the same thing.", false,
              "They serve different risk categories and live in different places in the budget."),
            o("D", "Both are excluded from the project budget.", false,
              "Both are part of the total project budget, just at different levels."),
          ],
        },
      ],
    },

    // ── 2. Three-point & PERT (calculations) ───────────────────────────────
    {
      id: "pert",
      title: "Three-point & PERT",
      questions: [
        {
          id: "q1",
          prompt: "Which formula gives the PERT (beta) expected value?",
          options: [
            o("A", "(O + M + P) / 3", false,
              "That is the triangular (simple average) three-point estimate, which weights all three equally."),
            o("B", "(O + 4M + P) / 6", true,
              "The beta/PERT distribution weights the most likely value four times: (O + 4M + P) / 6."),
            o("C", "(P − O) / 6", false,
              "That is the standard deviation of a PERT activity, not the expected value."),
            o("D", "(O + P) / 2", false,
              "Averaging only optimistic and pessimistic ignores the most likely value."),
          ],
        },
        num("q2",
          "Three-point (PERT/beta) estimate.\nOptimistic O = 4, Most Likely M = 6, Pessimistic P = 14 days.\nWhat is the expected duration?",
          7,
          "PERT = (O + 4M + P) / 6 = (4 + 4·6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7 days.",
          { unit: "days", hint: "Beta PERT weights M by 4: (O + 4M + P) / 6." }
        ),
        num("q3",
          "Three-point (PERT/beta) estimate.\nO = 10, M = 15, P = 26 hours.\nWhat is the expected effort?",
          16,
          "PERT = (10 + 4·15 + 26) / 6 = (10 + 60 + 26) / 6 = 96 / 6 = 16 hours.",
          { unit: "hours" }
        ),
        num("q4",
          "Triangular (simple) three-point estimate.\nO = 6, M = 9, P = 18 days.\nWhat is the estimate?",
          11,
          "Triangular = (O + M + P) / 3 = (6 + 9 + 18) / 3 = 33 / 3 = 11 days. Unlike PERT it weights all three values equally.",
          { unit: "days", hint: "Triangular is the plain average of the three values." }
        ),
        num("q5",
          "Activity standard deviation.\nO = 4, P = 22 days.\nWhat is the standard deviation (σ)?",
          3,
          "σ = (P − O) / 6 = (22 − 4) / 6 = 18 / 6 = 3 days.",
          { unit: "days", hint: "σ = (P − O) / 6." }
        ),
        num("q6",
          "Activity variance.\nO = 8, P = 20 days.\nWhat is the variance (σ²)?",
          4,
          "σ = (P − O) / 6 = (20 − 8) / 6 = 12 / 6 = 2, so variance = σ² = 2² = 4.",
          { hint: "Variance is the square of the standard deviation, ((P − O)/6)²." }
        ),
        num("q7",
          "Confidence range.\nA PERT estimate has an expected duration of 20 days and σ = 2 days.\nAbout 95% of outcomes fall within ±2σ. What is the UPPER bound (mean + 2σ)?",
          24,
          "Upper bound = mean + 2σ = 20 + 2·2 = 20 + 4 = 24 days (±2σ ≈ 95% of the beta distribution).",
          { unit: "days", hint: "Add two standard deviations to the mean." }
        ),
      ],
    },

    // ── 3. Parametric & analogous (calculations) ───────────────────────────
    {
      id: "param",
      title: "Parametric & Analogous",
      questions: [
        num("q1",
          "Parametric cost estimate.\nHistorical rate = $450 per unit. The order is for 20 units.\nWhat is the estimated cost (in $)?",
          9000,
          "Cost = rate × quantity = $450 × 20 = $9,000.",
          { unit: "$", tolerance: 0, hint: "Multiply the unit rate by the number of units." }
        ),
        num("q2",
          "Parametric duration estimate.\nProductivity = 3 hours per drawing. There are 25 drawings.\nWhat is the estimated effort?",
          75,
          "Effort = 3 hours/drawing × 25 drawings = 75 hours.",
          { unit: "hours" }
        ),
        num("q3",
          "Analogous (scaled) estimate.\nA similar 5,000 m² building cost $200,000. The new building is 8,000 m² and comparable.\nScale the cost by area. What is the estimate (in $)?",
          320000,
          "Scale by size: $200,000 × (8,000 / 5,000) = $200,000 × 1.6 = $320,000. Analogous estimates adjust a past actual by a ratio of the driving parameter.",
          { unit: "$", tolerance: 0, hint: "Multiply the past cost by (new size / old size)." }
        ),
        {
          id: "q4",
          prompt: "You have a fully decomposed WBS and time before the deadline, and you need the most accurate estimate possible. Which technique fits best?",
          options: [
            o("A", "Analogous estimating", false,
              "Analogous is fast but the least accurate — better for early, low-detail stages."),
            o("B", "Rough Order of Magnitude", false,
              "A ROM is deliberately low-accuracy and used when little detail exists."),
            o("C", "Bottom-up estimating", true,
              "With a detailed WBS and available time, estimating each work package and aggregating gives the highest accuracy."),
            o("D", "Single expert guess", false,
              "A single guess lacks the rigour of a bottom-up roll-up."),
          ],
        },
      ],
    },

    // ── 4. Ranges & reserves (calculations + scenario) ─────────────────────
    {
      id: "ranges",
      title: "Ranges & Reserves",
      questions: [
        num("q1",
          "ROM upper bound.\nBase estimate = $120,000, ROM range = −25% to +75%.\nWhat is the UPPER bound of the ROM (in $)?",
          210000,
          "Upper bound = $120,000 × (1 + 0.75) = $120,000 × 1.75 = $210,000.",
          { unit: "$", tolerance: 0, hint: "Add 75% to the base: base × 1.75." }
        ),
        num("q2",
          "Definitive estimate lower bound.\nBase estimate = $120,000, definitive range = −5% to +10%.\nWhat is the LOWER bound (in $)?",
          114000,
          "Lower bound = $120,000 × (1 − 0.05) = $120,000 × 0.95 = $114,000.",
          { unit: "$", tolerance: 0, hint: "Subtract 5% from the base: base × 0.95." }
        ),
        num("q3",
          "Cost baseline with contingency.\nBase cost of work = $90,000. Contingency reserves for identified risks are $4,000, $2,500 and $3,500.\nWhat is the cost baseline (in $)?",
          100000,
          "Contingency total = $4,000 + $2,500 + $3,500 = $10,000. Cost baseline = base cost + contingency = $90,000 + $10,000 = $100,000. (Contingency sits inside the cost baseline.)",
          { unit: "$", tolerance: 0, hint: "Cost baseline = base cost + total contingency reserve." }
        ),
        num("q4",
          "Total project budget.\nThe cost baseline is $100,000 and a management reserve of 8% is added.\nWhat is the total project budget (in $)?",
          108000,
          "Management reserve = 8% × $100,000 = $8,000. Total budget = cost baseline + management reserve = $100,000 + $8,000 = $108,000. (Management reserve sits outside the baseline.)",
          { unit: "$", tolerance: 0, hint: "Total budget = cost baseline + management reserve." }
        ),
        {
          id: "q5",
          prompt: "In the initiation phase a sponsor asks for a quick budget figure. There is no WBS yet, only a similar past project. Which approach is most appropriate?",
          options: [
            o("A", "Bottom-up estimating", false,
              "Bottom-up needs a detailed WBS, which does not exist yet."),
            o("B", "Analogous estimating for a ROM figure", true,
              "With only a comparable past project and no detail, an analogous estimate delivered as a ROM (−25% to +75%) is the pragmatic early choice."),
            o("C", "A definitive −5%/+10% estimate", false,
              "A definitive estimate requires detailed information that is not available at initiation."),
            o("D", "Refuse to give any number", false,
              "Sponsors legitimately need an early ballpark; that is exactly what a ROM provides."),
          ],
        },
      ],
    },
  ],
};

export default estimationQuiz;
