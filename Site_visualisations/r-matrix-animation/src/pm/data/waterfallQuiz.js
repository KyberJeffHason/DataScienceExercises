// Short quiz on the Waterfall approach — handy for testing the multi-quiz engine.
const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });

export const waterfallQuiz = {
  id: "waterfall",
  title: "Waterfall Approach",
  subtitle: "Predictive delivery — quick 7-question check",
  description:
    "A short revision quiz on the classic Waterfall (predictive) model: its sequential phases, " +
    "strengths, weaknesses and when to use it.",
  sections: [
    {
      id: "wf",
      title: "Waterfall Approach",
      questions: [
        {
          id: "q1",
          prompt: "What best describes the Waterfall model?",
          options: [
            o("A", "An iterative model that revisits phases continuously.", false,
              "Continuous iteration describes agile, not Waterfall."),
            o("B", "A sequential model where each phase completes before the next begins.", true,
              "Waterfall flows linearly: each phase finishes and feeds the next, like water down steps."),
            o("C", "A model with no defined phases.", false,
              "Waterfall is defined precisely by its ordered phases."),
            o("D", "A model that delivers working software every two weeks.", false,
              "Fixed short delivery cadences are an agile trait, not Waterfall."),
          ],
        },
        {
          id: "q2",
          prompt: "Which is the typical correct ordering of Waterfall phases?",
          options: [
            o("A", "Design → Requirements → Testing → Implementation → Maintenance", false,
              "Requirements must come before design — this order is scrambled."),
            o("B", "Requirements → Design → Implementation → Testing → Maintenance", true,
              "The classic Waterfall sequence: gather requirements, design, build, test, then maintain."),
            o("C", "Implementation → Testing → Requirements → Design → Maintenance", false,
              "You can't build before defining requirements and design."),
            o("D", "Testing → Design → Requirements → Maintenance → Implementation", false,
              "Testing can't precede building; this order is invalid."),
          ],
        },
        {
          id: "q3",
          prompt: "For which kind of project is Waterfall MOST suitable?",
          options: [
            o("A", "Projects with rapidly changing, unclear requirements.", false,
              "Volatile requirements suit agile; Waterfall struggles with change."),
            o("B", "Projects with stable, well-understood requirements.", true,
              "Waterfall shines when requirements are clear and unlikely to change."),
            o("C", "Experimental products needing frequent user feedback.", false,
              "Frequent feedback loops are an agile strength, not Waterfall's."),
            o("D", "Projects where scope is expected to evolve constantly.", false,
              "Evolving scope fights Waterfall's fixed, upfront plan."),
          ],
        },
        {
          id: "q4",
          prompt: "What is a key ADVANTAGE of Waterfall?",
          options: [
            o("A", "It easily accommodates late requirement changes.", false,
              "Late changes are costly in Waterfall — the opposite of an advantage."),
            o("B", "Clear structure, documentation and predictability.", true,
              "Its defined phases give strong documentation, milestones and predictable planning."),
            o("C", "It removes the need for upfront planning.", false,
              "Waterfall depends heavily on upfront planning."),
            o("D", "It guarantees continuous customer collaboration.", false,
              "Continuous collaboration is agile; Waterfall engages customers mainly at the ends."),
          ],
        },
        {
          id: "q5",
          prompt: "What is a major DISADVANTAGE of Waterfall?",
          options: [
            o("A", "Too many short iterations to manage.", false,
              "Waterfall has no short iterations; that's an agile concern."),
            o("B", "Changes are costly and hard to make once a phase is complete.", true,
              "Because phases are locked in sequence, late changes mean expensive rework."),
            o("C", "Lack of any documentation.", false,
              "Waterfall is documentation-heavy, not documentation-light."),
            o("D", "No defined milestones.", false,
              "Waterfall has very clear phase-end milestones."),
          ],
        },
        {
          id: "q6",
          prompt: "In Waterfall, when is testing typically performed?",
          options: [
            o("A", "Continuously throughout every phase.", false,
              "Continuous/parallel testing is more of an agile/DevOps practice."),
            o("B", "After the implementation phase is complete.", true,
              "Classic Waterfall tests the built product in a dedicated phase after implementation."),
            o("C", "Before requirements are gathered.", false,
              "You can't test before there's anything to test or any requirements."),
            o("D", "Only during maintenance.", false,
              "Testing is its own phase before release, not deferred to maintenance."),
          ],
        },
        {
          id: "q7",
          prompt: "Why is Waterfall often described as 'plan-driven'?",
          options: [
            o("A", "Because the plan emerges gradually as the team learns.", false,
              "Emergent planning is agile; Waterfall fixes the plan upfront."),
            o("B", "Because scope, schedule and cost are defined upfront and execution follows the plan.", true,
              "Waterfall sets the full plan early and then executes against that baseline."),
            o("C", "Because it avoids planning to stay flexible.", false,
              "Waterfall is the opposite of plan-avoiding."),
            o("D", "Because planning happens only at the end.", false,
              "Planning happens at the start, not the end, in Waterfall."),
          ],
        },
      ],
    },
  ],
};

export default waterfallQuiz;
