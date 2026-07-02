// PMI Process Groups — mixes concept (choice) questions with drag-and-drop
// matching/ordering exercises. Shows the "dnd" question format in action.

const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });
const dnd = (id, prompt, targets, items, explanation = "") => ({
  id,
  type: "dnd",
  prompt,
  targets,
  items,
  explanation,
});

// The five PMBOK® process groups, reused across drag-and-drop questions.
const GROUPS = [
  { id: "ini", label: "Initiating" },
  { id: "pla", label: "Planning" },
  { id: "exe", label: "Executing" },
  { id: "mon", label: "Monitoring & Controlling" },
  { id: "clo", label: "Closing" },
];

export const processGroupsQuiz = {
  id: "process-groups",
  title: "PMI Process Groups",
  subtitle: "Initiating · Planning · Executing · Monitoring & Controlling · Closing",
  description:
    "Understand the five Project Management Process Groups from the PMBOK® Guide. " +
    "Concept questions cover their purpose, and drag-and-drop exercises let you match " +
    "activities and artifacts to the right group and order the groups correctly.",
  sections: [
    // ── concepts ───────────────────────────────────────────────────────────
    {
      id: "concept",
      title: "Process Group Concepts",
      questions: [
        {
          id: "q1",
          prompt: "How many Process Groups does the PMBOK® Guide define?",
          options: [
            o("A", "Four", false, "There are five, not four — a common trap."),
            o("B", "Five", true,
              "Initiating, Planning, Executing, Monitoring & Controlling, and Closing."),
            o("C", "Ten", false, "Ten is the number of Knowledge Areas, not Process Groups."),
            o("D", "Forty-nine", false,
              "49 is the classic count of individual processes, not the groups."),
          ],
        },
        {
          id: "q2",
          prompt: "What is the primary purpose of the Monitoring & Controlling group?",
          options: [
            o("A", "To authorise the project and define initial scope.", false,
              "Authorising the project is Initiating."),
            o("B", "To track, review and regulate progress and performance, and manage changes.", true,
              "M&C measures performance against the plan and drives corrective/preventive action and change control."),
            o("C", "To produce the project's deliverables.", false,
              "Producing deliverables is Executing."),
            o("D", "To formally finish the project and release resources.", false,
              "Formal finish and closure is the Closing group."),
          ],
        },
        {
          id: "q3",
          prompt: "How do Process Groups relate to project phases?",
          options: [
            o("A", "They are the same thing as phases.", false,
              "Phases are stages of the life cycle; process groups are recurring activity types."),
            o("B", "Process Groups repeat within each phase and are not the project life-cycle phases themselves.", true,
              "Every phase can run through Initiating→…→Closing; the groups are not sequential life-cycle phases."),
            o("C", "A project can only pass through the groups once, in strict order.", false,
              "Groups overlap and iterate, especially Planning with M&C and Executing."),
            o("D", "Closing must happen before Executing.", false,
              "Closing is last; this ordering is invalid."),
          ],
        },
        {
          id: "q4",
          prompt: "Which Process Group does 'Develop Project Charter' belong to?",
          options: [
            o("A", "Planning", false, "Planning builds the plan after the charter authorises the project."),
            o("B", "Initiating", true,
              "The charter formally authorises the project and names the PM — an Initiating process."),
            o("C", "Executing", false, "Executing carries out the plan; the charter precedes it."),
            o("D", "Closing", false, "Closing ends the project; the charter starts it."),
          ],
        },
      ],
    },

    // ── drag & drop ─────────────────────────────────────────────────────────
    {
      id: "match",
      title: "Match & Order",
      questions: [
        dnd(
          "q1",
          "Drag each activity into the Process Group it belongs to.",
          GROUPS,
          [
            { id: "i1", text: "Develop Project Charter", target: "ini",
              explanation: "Authorises the project — Initiating." },
            { id: "i2", text: "Identify Stakeholders", target: "ini",
              explanation: "Early stakeholder identification is Initiating." },
            { id: "i3", text: "Develop Project Management Plan", target: "pla",
              explanation: "The integrated plan is a Planning output." },
            { id: "i4", text: "Create WBS", target: "pla",
              explanation: "Decomposing scope into a WBS is Planning." },
            { id: "i5", text: "Direct and Manage Project Work", target: "exe",
              explanation: "Performing the work to create deliverables is Executing." },
            { id: "i6", text: "Manage Communications", target: "exe",
              explanation: "Distributing information to stakeholders is Executing." },
            { id: "i7", text: "Control Scope", target: "mon",
              explanation: "Monitoring scope and managing baseline changes is M&C." },
            { id: "i8", text: "Perform Integrated Change Control", target: "mon",
              explanation: "Reviewing and deciding on change requests is M&C." },
            { id: "i9", text: "Close Project or Phase", target: "clo",
              explanation: "Formal finalisation of work is Closing." },
          ]
        ),
        dnd(
          "q2",
          "Put the five Process Groups in their typical order of first occurrence.",
          [
            { id: "p1", label: "1st" },
            { id: "p2", label: "2nd" },
            { id: "p3", label: "3rd" },
            { id: "p4", label: "4th" },
            { id: "p5", label: "5th" },
          ],
          [
            { id: "g1", text: "Initiating", target: "p1",
              explanation: "Projects start by being authorised." },
            { id: "g2", text: "Planning", target: "p2",
              explanation: "Plan the work before doing it." },
            { id: "g3", text: "Executing", target: "p3",
              explanation: "Carry out the plan to produce deliverables." },
            { id: "g4", text: "Monitoring & Controlling", target: "p4",
              explanation: "Runs alongside Executing to keep work on track." },
            { id: "g5", text: "Closing", target: "p5",
              explanation: "Formally finish the project or phase last." },
          ],
          "Groups overlap in practice, but this is the standard order of first occurrence."
        ),
        dnd(
          "q3",
          "Match each artifact/output to the Process Group that produces it.",
          GROUPS,
          [
            { id: "a1", text: "Project Charter", target: "ini",
              explanation: "Produced in Initiating." },
            { id: "a2", text: "Stakeholder Register", target: "ini",
              explanation: "First created during Identify Stakeholders (Initiating)." },
            { id: "a3", text: "Scope Baseline", target: "pla",
              explanation: "Scope statement + WBS + WBS dictionary — a Planning output." },
            { id: "a4", text: "Deliverables", target: "exe",
              explanation: "Work products are created in Executing." },
            { id: "a5", text: "Work Performance Reports", target: "mon",
              explanation: "Performance analysis/reporting is M&C." },
            { id: "a6", text: "Final Report / Lessons Learned", target: "clo",
              explanation: "Compiled when closing the project or phase." },
          ]
        ),
      ],
    },
  ],
};

export default processGroupsQuiz;
