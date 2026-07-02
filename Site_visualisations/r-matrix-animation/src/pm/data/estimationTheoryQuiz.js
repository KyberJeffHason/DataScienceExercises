// Estimation Techniques — Theory quiz.
// Pure concept: no formulas, no calculations.
// Covers: what each method is, how it is used, inputs, outputs, accuracy, trade-offs.
// Mix of choice questions and drag-and-drop matching exercises.

const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });
const dnd = (id, prompt, targets, items, explanation = "") => ({
  id,
  type: "dnd",
  prompt,
  targets,
  items,
  explanation,
});

// ── reusable target sets ──────────────────────────────────────────────────────
const TECHNIQUES = [
  { id: "ana", label: "Analogous" },
  { id: "par", label: "Parametric" },
  { id: "bu",  label: "Bottom-up" },
  { id: "tp",  label: "Three-point" },
];

const ACCURACY = [
  { id: "low",  label: "Lower accuracy" },
  { id: "high", label: "Higher accuracy" },
];

export const estimationTheoryQuiz = {
  id: "estimation-theory",
  title: "Estimation Techniques — Theory",
  subtitle: "Analogous · Parametric · Bottom-up · Three-point · Reserves",
  description:
    "Build conceptual fluency in PMI estimation techniques — no maths required. " +
    "Understand what each method is, when to use it, what information it needs, " +
    "what it produces, and how accurate it tends to be.",
  sections: [
    // ── 1. What each method is ─────────────────────────────────────────────
    {
      id: "what",
      title: "What Each Method Is",
      questions: [
        {
          id: "q1",
          prompt:
            "Which technique uses the actual cost or duration of a similar past project as its starting point?",
          options: [
            o("A", "Bottom-up estimating", false,
              "Bottom-up builds an estimate from scratch by summing individual work packages — it does not start from a past project total."),
            o("B", "Analogous estimating", true,
              "Analogous (top-down) estimating uses a comparable historical project as a benchmark and adjusts for known differences. It is a form of expert judgment."),
            o("C", "Parametric estimating", false,
              "Parametric scales a unit rate by a quantity — it relies on a statistical relationship, not a whole-project reference."),
            o("D", "Three-point estimating", false,
              "Three-point combines optimistic, most-likely and pessimistic scenarios — it does not reference a past project as a single data point."),
          ],
        },
        {
          id: "q2",
          prompt:
            "A project manager multiplies a proven cost-per-unit rate by the number of units in scope. What technique is this?",
          options: [
            o("A", "Analogous estimating", false,
              "Analogous uses a whole past project as the reference, not a per-unit rate."),
            o("B", "Parametric estimating", true,
              "Parametric estimating applies a statistical relationship — typically a unit rate — to the quantity of work. Examples: cost/m², hours/drawing, lines of code/day."),
            o("C", "Bottom-up estimating", false,
              "Bottom-up decomposes work into packages and sums them; it does not rely on a single unit rate applied to a total quantity."),
            o("D", "Reserve analysis", false,
              "Reserve analysis adds a buffer for risk — it is not an estimating technique for the base work."),
          ],
        },
        {
          id: "q3",
          prompt:
            "Which technique decomposes the project into its smallest defined units, estimates each one, and then aggregates the results?",
          options: [
            o("A", "Analogous estimating", false,
              "Analogous works top-down from a past project total, not bottom-up from individual pieces."),
            o("B", "Parametric estimating", false,
              "Parametric applies a rate to a quantity; it does not require decomposition of every work package."),
            o("C", "Bottom-up estimating", true,
              "Bottom-up estimates each work package or activity individually, then rolls all values up. It requires a detailed WBS and takes the most effort — but delivers the highest accuracy."),
            o("D", "Expert judgment", false,
              "Expert judgment is a tool/technique that can support any estimate; it is not itself a decomposition-based method."),
          ],
        },
        {
          id: "q4",
          prompt:
            "A team is asked to estimate an activity's duration using three scenarios: the best case, the most likely case, and the worst case. What technique is this?",
          options: [
            o("A", "Analogous estimating", false,
              "Analogous references past data, not a three-scenario range."),
            o("B", "Reserve analysis", false,
              "Reserve analysis calculates buffers; it does not decompose duration into three scenarios."),
            o("C", "Three-point estimating", true,
              "Three-point (PERT/triangular) uses Optimistic (O), Most Likely (M) and Pessimistic (P) values to capture uncertainty and produce a weighted expected estimate."),
            o("D", "Bottom-up estimating", false,
              "Bottom-up sums individual package estimates; it can use single-point or three-point inputs per package, but the technique itself is about aggregation."),
          ],
        },
      ],
    },

    // ── 2. Inputs & outputs ────────────────────────────────────────────────
    {
      id: "io",
      title: "Inputs & Outputs",
      questions: [
        dnd(
          "q1",
          "Match each input or output to the technique that relies on it most directly.",
          TECHNIQUES,
          [
            {
              id: "i1", text: "A complete, detailed WBS", target: "bu",
              explanation:
                "Bottom-up needs a fully decomposed WBS — you estimate every work package individually.",
            },
            {
              id: "i2", text: "Historical unit rate (e.g. cost per m²)", target: "par",
              explanation:
                "Parametric's defining input is a proven per-unit metric derived from historical data.",
            },
            {
              id: "i3", text: "Actual total cost of a similar past project", target: "ana",
              explanation:
                "Analogous takes the outcome of a comparable project as its primary reference.",
            },
            {
              id: "i4", text: "Optimistic, Most Likely and Pessimistic values", target: "tp",
              explanation:
                "Three-point estimating is built entirely on O, M and P scenario inputs.",
            },
          ],
          "Each technique has a signature input that distinguishes it from the others."
        ),
        {
          id: "q2",
          prompt:
            "What is the primary OUTPUT of three-point estimating?",
          options: [
            o("A", "A single best-guess duration or cost, identical to an expert's gut feel.", false,
              "Three-point produces a statistically weighted value, not an unstructured guess."),
            o("B", "A weighted expected value and a range reflecting the degree of uncertainty.", true,
              "The output is the expected estimate (beta or triangular mean) plus an indication of spread (standard deviation / variance), which supports risk-adjusted planning."),
            o("C", "A per-unit rate to be applied to future projects.", false,
              "Producing a reusable unit rate is what parametric estimating aims at."),
            o("D", "A fully costed WBS.", false,
              "A fully costed WBS is the output of bottom-up estimating."),
          ],
        },
        {
          id: "q3",
          prompt:
            "Which statement best describes what bottom-up estimating produces?",
          options: [
            o("A", "A quick order-of-magnitude figure for gate approval.", false,
              "Quick, rough figures are the domain of analogous or ROM — not bottom-up."),
            o("B", "A single reference number borrowed from historical records.", false,
              "Borrowing a historical reference is analogous; bottom-up builds a fresh estimate from components."),
            o("C", "A detailed, rolled-up estimate with cost/effort attributed to every work package.", true,
              "Bottom-up's output is a fully broken-down cost or schedule with visibility into every component, which also becomes the basis for the cost baseline."),
            o("D", "An estimate range expressed as a percentage (e.g. −25% to +75%).", false,
              "Percentage range expressions describe the ROM concept, not bottom-up outputs."),
          ],
        },
      ],
    },

    // ── 3. Accuracy & trade-offs ───────────────────────────────────────────
    {
      id: "accuracy",
      title: "Accuracy & Trade-offs",
      questions: [
        dnd(
          "q1",
          "Sort each statement into 'Lower accuracy' or 'Higher accuracy' relative to other techniques.",
          ACCURACY,
          [
            {
              id: "s1",
              text: "Based on a single comparable past project, adjusted by judgment",
              target: "low",
              explanation:
                "Analogous is the least accurate — it relies on similarity and expert adjustment with minimal detail.",
            },
            {
              id: "s2",
              text: "Every work package is estimated individually and summed",
              target: "high",
              explanation:
                "Bottom-up yields the highest accuracy because nothing is assumed — every piece is explicitly estimated.",
            },
            {
              id: "s3",
              text: "Uses a proven unit rate × quantity relationship",
              target: "high",
              explanation:
                "Parametric can be highly accurate when the statistical relationship is validated and the work is truly scalable.",
            },
            {
              id: "s4",
              text: "Done in hours at initiation with no WBS available",
              target: "low",
              explanation:
                "Early top-down estimates (ROM, analogous) are inherently low-accuracy because scope is not yet detailed.",
            },
          ]
        ),
        {
          id: "q2",
          prompt:
            "Which technique is the FASTEST to produce but also typically the LEAST accurate?",
          options: [
            o("A", "Bottom-up estimating", false,
              "Bottom-up is the slowest and most effort-intensive, but the most accurate."),
            o("B", "Parametric estimating", false,
              "Parametric is quick when unit rates exist and can be highly accurate, but it is not the fastest by default."),
            o("C", "Analogous estimating", true,
              "Analogous is the quickest — it needs only a comparable past project and expert judgment — but accuracy is the lowest because little project detail is used."),
            o("D", "Three-point estimating", false,
              "Three-point requires defining three scenarios per activity, making it slower than analogous."),
          ],
        },
        {
          id: "q3",
          prompt:
            "Why is parametric estimating more accurate than analogous, even though both use historical data?",
          options: [
            o("A", "Parametric is always done later in the project when more detail is known.", false,
              "Timing is not what differentiates them — parametric can also be used early."),
            o("B", "Parametric models a validated statistical relationship between a driver and cost/duration, while analogous uses a whole past project as a single reference.", true,
              "A unit rate (e.g. cost/m²) derived from many data points is more defensible and scalable than scaling one past project's total."),
            o("C", "Parametric always uses three scenarios (O, M, P).", false,
              "Three scenarios define three-point estimating, not parametric."),
            o("D", "Parametric requires a WBS; analogous does not.", false,
              "Neither technique requires a fully detailed WBS — bottom-up does."),
          ],
        },
        {
          id: "q4",
          prompt:
            "A sponsor needs a budget figure today for an executive briefing, but the project charter is not yet signed and there is no WBS. Which is the MOST appropriate technique?",
          options: [
            o("A", "Bottom-up estimating", false,
              "Bottom-up requires a detailed WBS that does not exist yet."),
            o("B", "Analogous estimating delivered as a ROM", true,
              "With no scope detail, analogous estimating against a similar past project — expressed as a rough order of magnitude (−25%/+75%) — is the pragmatic choice."),
            o("C", "Parametric estimating with a tight ±5% range", false,
              "A tight range implies high confidence that doesn't exist without detail; parametric still needs reliable unit-rate data and a known quantity of work."),
            o("D", "Three-point estimating per activity", false,
              "Three-point needs defined activities; without a WBS there are no activities to assess."),
          ],
        },
      ],
    },

    // ── 4. When to use each method ────────────────────────────────────────
    {
      id: "when",
      title: "When to Use Each Method",
      questions: [
        dnd(
          "q1",
          "Match each project situation to the estimating technique that fits it best.",
          TECHNIQUES,
          [
            {
              id: "w1",
              text: "Scope is fully defined, deadline allows thorough analysis, maximum accuracy is needed",
              target: "bu",
              explanation:
                "These conditions are the ideal home for bottom-up estimating.",
            },
            {
              id: "w2",
              text: "Early stage, scope is fuzzy, a similar project was done last year",
              target: "ana",
              explanation:
                "Analogous is the go-to when detail is absent but a comparable reference exists.",
            },
            {
              id: "w3",
              text: "The work is repetitive and a validated cost-per-unit metric is available",
              target: "par",
              explanation:
                "Parametric shines when work is scalable and a reliable unit rate exists.",
            },
            {
              id: "w4",
              text: "The activity is novel and the team is uncertain about best- and worst-case outcomes",
              target: "tp",
              explanation:
                "Three-point is designed to capture uncertainty through explicit best/most-likely/worst scenarios.",
            },
          ]
        ),
        {
          id: "q2",
          prompt:
            "For which type of project is parametric estimating LEAST reliable?",
          options: [
            o("A", "Construction projects with stable unit costs.", false,
              "Construction with stable unit costs is an ideal context for parametric — reliable rates exist."),
            o("B", "Software projects where every feature is unique and no historical unit rate exists.", true,
              "Parametric breaks down when there is no validated relationship between a driver and the outcome — novel, one-off work lacks the repeatable pattern parametric needs."),
            o("C", "Projects that have been done many times before.", false,
              "Repetition is exactly what makes parametric reliable."),
            o("D", "Projects with a large number of work packages.", false,
              "Volume of work packages is a reason to prefer parametric over bottom-up, not a reason it fails."),
          ],
        },
        {
          id: "q3",
          prompt:
            "Three-point estimating is MOST valuable when which condition applies?",
          options: [
            o("A", "The project is identical to one completed last year.", false,
              "If history is clear, analogous is simpler and sufficient."),
            o("B", "All activities are well understood and risk is negligible.", false,
              "Low-risk, well-understood work does not benefit much from three scenarios."),
            o("C", "There is significant uncertainty or risk in an activity's duration or cost.", true,
              "Three-point's core value is quantifying and communicating uncertainty — it forces the team to think about the full range of possible outcomes."),
            o("D", "The sponsor wants a single, non-negotiable commitment.", false,
              "A range output conflicts with a non-negotiable commitment; a stakeholder asking for certainty wants a different approach."),
          ],
        },
      ],
    },

    // ── 5. Reserves ────────────────────────────────────────────────────────
    {
      id: "reserves",
      title: "Reserves",
      questions: [
        {
          id: "q1",
          prompt:
            "What is the purpose of a CONTINGENCY reserve?",
          options: [
            o("A", "To cover completely unknown events that cannot be anticipated.", false,
              "Unknown-unknowns are the purpose of management reserves, not contingency."),
            o("B", "To cover identified risks — known-unknowns — that have been assessed in risk planning.", true,
              "Contingency reserve addresses the residual uncertainty in known risks. It sits inside the cost baseline and is managed by the PM."),
            o("C", "To fund scope changes requested by the sponsor.", false,
              "Scope changes go through integrated change control; they are not pre-funded by contingency."),
            o("D", "To cover approved changes after the project baseline is set.", false,
              "Approved changes update the baseline via change control, not the contingency reserve."),
          ],
        },
        {
          id: "q2",
          prompt:
            "A management reserve exists OUTSIDE the cost baseline. What does this mean in practice?",
          options: [
            o("A", "It is not part of the total project budget at all.", false,
              "It is part of the total budget — just above the baseline layer."),
            o("B", "The PM can draw from it freely at any time.", false,
              "Management reserves require management authorisation to use, which is why they sit above the PM's control level."),
            o("C", "It cannot be spent without management authorisation, and using it triggers a baseline change.", true,
              "Because it sits outside the cost baseline, tapping it changes the baseline — requiring formal approval. It covers truly unforeseen work (unknown-unknowns)."),
            o("D", "It is calculated using three-point estimating.", false,
              "Management reserve is typically set as a percentage of the project budget, not derived from three-point estimates."),
          ],
        },
        dnd(
          "q3",
          "Match each description to the correct reserve type.",
          [
            { id: "con", label: "Contingency Reserve" },
            { id: "mgmt", label: "Management Reserve" },
          ],
          [
            {
              id: "r1", text: "Covers known-unknowns from the risk register", target: "con",
              explanation: "Contingency is sized to handle identified risks.",
            },
            {
              id: "r2", text: "Covers unknown-unknowns that could not be anticipated", target: "mgmt",
              explanation: "Management reserve is the buffer for truly unforeseen events.",
            },
            {
              id: "r3", text: "Sits inside the cost baseline", target: "con",
              explanation: "Contingency is included in the baseline — the PM controls it.",
            },
            {
              id: "r4", text: "Sits outside the cost baseline, requires management approval to use", target: "mgmt",
              explanation: "Using management reserve triggers a formal baseline change.",
            },
            {
              id: "r5", text: "Managed and drawn by the project manager within normal execution", target: "con",
              explanation: "The PM can draw contingency as risks materialise without escalation.",
            },
          ]
        ),
      ],
    },
  ],
};

export default estimationTheoryQuiz;
