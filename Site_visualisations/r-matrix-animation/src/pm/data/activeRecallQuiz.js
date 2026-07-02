// Demo quiz showcasing the five active-recall question types:
// multi · text · cloze · matrix · recall — all in one section.
export const activeRecallQuiz = {
  id: "active-recall",
  title: "Active Recall Sampler",
  subtitle: "multi · text · cloze · matrix · recall",
  description:
    "A short mixed quiz that demonstrates every active-recall question type. Great for " +
    "checking the new formats — and a genuine mini-review of core PMI concepts.",
  sections: [
    {
      id: "sampler",
      title: "One of each type",
      questions: [
        {
          id: "multi1",
          type: "multi",
          prompt: "Which of these are PMBOK knowledge areas? (select all)",
          options: [
            { id: "A", text: "Scope Management", correct: true, explanation: "A knowledge area." },
            { id: "B", text: "Cost Management", correct: true, explanation: "A knowledge area." },
            { id: "C", text: "Initiating", correct: false, explanation: "A process group, not a knowledge area." },
            { id: "D", text: "Risk Management", correct: true, explanation: "A knowledge area." },
            { id: "E", text: "Closing", correct: false, explanation: "A process group, not a knowledge area." },
          ],
        },
        {
          id: "text1",
          type: "text",
          prompt: "What document formally authorizes the project and empowers the project manager?",
          answers: ["project charter", "charter"],
          explanation: "The Project Charter authorizes the project and names the PM.",
        },
        {
          id: "cloze1",
          type: "cloze",
          prompt:
            "A project is a temporary endeavor undertaken to create a {{b1}}, {{b2}}, or {{b3}}.",
          blanks: {
            b1: ["unique product", "product"],
            b2: ["unique service", "service"],
            b3: ["unique result", "result"],
          },
          explanation: "PMI defines a project as creating a unique product, service, or result.",
        },
        {
          id: "matrix1",
          type: "matrix",
          prompt: "Place each process into its Process Group and Knowledge Area.",
          rows: [
            { id: "initiating", label: "Initiating" },
            { id: "planning", label: "Planning" },
            { id: "monitoring", label: "Monitoring & Controlling" },
          ],
          columns: [
            { id: "integration", label: "Integration" },
            { id: "scope", label: "Scope" },
            { id: "cost", label: "Cost" },
          ],
          items: [
            { id: "charter", text: "Develop Project Charter", row: "initiating", column: "integration",
              explanation: "Initiating + Integration Management." },
            { id: "wbs", text: "Create WBS", row: "planning", column: "scope",
              explanation: "Planning + Scope Management." },
            { id: "control-costs", text: "Control Costs", row: "monitoring", column: "cost",
              explanation: "Monitoring & Controlling + Cost Management." },
          ],
          explanation: "The PMBOK matrix pairs when a process happens with its expertise area.",
        },
        {
          id: "recall1",
          type: "recall",
          prompt: "Without looking, write the five project process groups in order.",
          modelAnswer:
            "Initiating → Planning → Executing → Monitoring & Controlling → Closing",
          explanation: "The five PMBOK process groups in their usual logical order.",
          allowTypedAnswer: true,
        },
      ],
    },
  ],
};
