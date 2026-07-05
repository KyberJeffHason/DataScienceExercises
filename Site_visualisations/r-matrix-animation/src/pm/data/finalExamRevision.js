// Final overall Project Management exam revision quiz.
// Covers modules 1–10: fundamentals, PMI, initiation, scope, WBS, schedule,
// cost/EVM, Agile, Scrum, hybrid/tailoring, digital tools and success factors.

const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });

const num = (id, prompt, answer, explanation, extra = {}) => ({
  id,
  type: "numeric",
  prompt,
  answer,
  explanation,
  ...extra,
});

const dnd = (id, prompt, targets, items, explanation = "") => ({
  id,
  type: "dnd",
  prompt,
  targets,
  items,
  explanation,
});

export const finalExamRevision = {
  id: "final-overall-exam-revision",
  title: "Final Overall PM Exam Revision",
  subtitle: "Modules 1–10 — active recall, calculations and scenario practice",
  description:
    "A large final revision quiz for Project Management. It uses active recall, cloze, text, " +
    "multi-select, drag-and-drop, matrix and numeric questions to test understanding of the full course: " +
    "PM fundamentals, PMI, initiation documents, scope, WBS, scheduling, EVM, Agile, Scrum, hybrid methods and success factors.",
  sections: [
    {
      id: "fundamentals",
      title: "1. Management, Projects and Processes",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Without looking: define management in one sentence.",
          modelAnswer:
            "Management is the process of planning, organizing, leading and controlling organizational resources to achieve goals efficiently and effectively.",
          explanation:
            "Key words to remember: planning, organizing, leading, controlling, resources, goals, efficiency and effectiveness.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "Efficiency means using resources with less {{b1}}. Effectiveness means achieving the intended {{b2}}.",
          blanks: {
            b1: ["waste", "resource waste"],
            b2: ["goal", "result", "outcome"],
          },
          explanation:
            "Efficiency = doing things with minimum waste. Effectiveness = achieving the goal.",
        },
        {
          id: "q3",
          prompt: "Which statement best defines a project?",
          options: [
            o("A", "An ongoing repeated operation with no final endpoint.", false,
              "That describes a process or operation."),
            o("B", "A temporary endeavor that creates a unique product, service or result.", true,
              "Correct. Temporary and unique are the core PMI ideas."),
            o("C", "Any organized task done by a company.", false,
              "Not every organized task is a project. Routine work is often a process."),
            o("D", "A daily activity repeated to maintain normal performance.", false,
              "That describes operations, not a project."),
          ],
        },
        {
          id: "q4",
          type: "multi",
          prompt: "Which are project signals rather than process signals?",
          options: [
            o("A", "Defined start and end", true,
              "Correct. Projects are temporary."),
            o("B", "Unique deliverable or change", true,
              "Correct. Projects create something distinctive."),
            o("C", "Ongoing repetitive routine", false,
              "Incorrect. That is a process signal."),
            o("D", "Higher uncertainty and risk", true,
              "Correct. Projects create change and often involve risk."),
            o("E", "Maintains routine service output", false,
              "Incorrect. That belongs to operations/processes."),
          ],
        },
        dnd(
          "q5",
          "Classify each example as a Project or a Process.",
          [
            { id: "project", label: "Project" },
            { id: "process", label: "Process / Operation" },
          ],
          [
            {
              id: "i1",
              text: "Develop a new online booking platform",
              target: "project",
              explanation: "Temporary, unique and creates a new deliverable.",
            },
            {
              id: "i2",
              text: "Use the booking platform daily to process reservations",
              target: "process",
              explanation: "Ongoing and repetitive operational work.",
            },
            {
              id: "i3",
              text: "Run a one-time Green Cruise pilot evaluation",
              target: "project",
              explanation: "A temporary pilot with a unique result.",
            },
            {
              id: "i4",
              text: "Clean hotel rooms every day",
              target: "process",
              explanation: "Routine repeated work.",
            },
          ],
          "Projects create or change something; processes keep operations running."
        ),
        {
          id: "q6",
          type: "recall",
          prompt: "Recall four reasons why project management is needed.",
          modelAnswer:
            "Project management provides clear direction, coordination, communication, risk management, resource efficiency and learning. It helps align departments, avoid surprises, use budgets and people realistically, and improve future projects through lessons learned.",
          explanation:
            "Strong answers mention direction, coordination, communication, risk, resources and learning.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "pmi-framework",
      title: "2. PMI, Process Groups and Knowledge Areas",
      questions: [
        {
          id: "q1",
          type: "text",
          prompt: "What does PMBOK stand for?",
          answers: [
            "project management body of knowledge",
            "the project management body of knowledge",
          ],
          explanation:
            "PMBOK = Project Management Body of Knowledge, a recognized reference framework and shared language.",
        },
        {
          id: "q2",
          type: "recall",
          prompt: "List the five PMI process groups in order.",
          modelAnswer:
            "Initiating → Planning → Executing → Monitoring & Controlling → Closing",
          explanation:
            "These are management work categories, not necessarily the same as lifecycle phases.",
          allowTypedAnswer: true,
        },
        dnd(
          "q3",
          "Put each PMI process group into its typical order.",
          [
            { id: "first", label: "1st" },
            { id: "second", label: "2nd" },
            { id: "third", label: "3rd" },
            { id: "fourth", label: "4th" },
            { id: "fifth", label: "5th" },
          ],
          [
            {
              id: "init",
              text: "Initiating",
              target: "first",
              explanation: "Define and authorize the project or phase.",
            },
            {
              id: "plan",
              text: "Planning",
              target: "second",
              explanation: "Create the roadmap: scope, WBS, schedule, budget, risk, communication.",
            },
            {
              id: "exec",
              text: "Executing",
              target: "third",
              explanation: "Perform the work and manage people/resources.",
            },
            {
              id: "mc",
              text: "Monitoring & Controlling",
              target: "fourth",
              explanation: "Track performance, handle changes and correct deviations.",
            },
            {
              id: "close",
              text: "Closing",
              target: "fifth",
              explanation: "Formal acceptance, handover, final report and lessons learned.",
            },
          ],
          "The standard memory chain is Initiating → Planning → Executing → Monitoring & Controlling → Closing."
        ),
        {
          id: "q4",
          type: "multi",
          prompt: "Which are PMBOK knowledge areas?",
          options: [
            o("A", "Scope Management", true,
              "Correct. Scope is one of the knowledge areas."),
            o("B", "Schedule Management", true,
              "Correct. Schedule is one of the knowledge areas."),
            o("C", "Initiating", false,
              "Incorrect. Initiating is a process group."),
            o("D", "Cost Management", true,
              "Correct. Cost is one of the knowledge areas."),
            o("E", "Stakeholder Management", true,
              "Correct. Stakeholder is one of the knowledge areas."),
            o("F", "Closing", false,
              "Incorrect. Closing is a process group."),
          ],
        },
        {
          id: "q5",
          prompt: "What is the difference between lifecycle phases and process groups?",
          options: [
            o("A", "They are exactly the same thing.", false,
              "Incorrect. They are related but not identical."),
            o("B", "Lifecycle phases describe the technical journey; process groups describe management work categories.", true,
              "Correct. A design phase can include planning, executing and monitoring work."),
            o("C", "Lifecycle phases exist only in Agile, while process groups exist only in Waterfall.", false,
              "Incorrect. Both concepts can be discussed across project approaches."),
            o("D", "Process groups describe departments; lifecycle phases describe employees.", false,
              "Incorrect. That is not the PMBOK distinction."),
          ],
        },
        {
          id: "q6",
          type: "matrix",
          prompt: "Place each example into the correct Process Group and Knowledge Area.",
          rows: [
            { id: "initiating", label: "Initiating" },
            { id: "planning", label: "Planning" },
            { id: "monitoring", label: "Monitoring & Controlling" },
            { id: "closing", label: "Closing" },
          ],
          columns: [
            { id: "integration", label: "Integration" },
            { id: "scope", label: "Scope" },
            { id: "cost", label: "Cost" },
            { id: "stakeholder", label: "Stakeholder" },
          ],
          items: [
            {
              id: "charter",
              text: "Develop Project Charter",
              row: "initiating",
              column: "integration",
              explanation: "The charter authorizes the project and integrates high-level information.",
            },
            {
              id: "wbs",
              text: "Create WBS",
              row: "planning",
              column: "scope",
              explanation: "WBS creation is planning work in Scope Management.",
            },
            {
              id: "budget",
              text: "Approve cost baseline",
              row: "planning",
              column: "cost",
              explanation: "Budgeting and cost baselines belong to Cost Management in planning.",
            },
            {
              id: "change",
              text: "Evaluate change request impact",
              row: "monitoring",
              column: "integration",
              explanation: "Integrated change control is Monitoring & Controlling plus Integration.",
            },
            {
              id: "lessons",
              text: "Document final lessons learned",
              row: "closing",
              column: "stakeholder",
              explanation: "Lessons learned and closure communication support stakeholder/project learning.",
            },
          ],
          explanation:
            "Matrix questions train you to connect management timing with knowledge area expertise.",
        },
      ],
    },

    {
      id: "success-lifecycle",
      title: "3. Project Success and Lifecycle",
      questions: [
        {
          id: "q1",
          type: "multi",
          prompt: "Which dimensions can define project success beyond the triple constraint?",
          options: [
            o("A", "Stakeholder satisfaction", true,
              "Correct. Stakeholder acceptance is a major success dimension."),
            o("B", "Business value and outcomes", true,
              "Correct. Delivering outputs is not enough if no value is created."),
            o("C", "Strategic alignment", true,
              "Correct. The project should still support organizational goals."),
            o("D", "Learning and future readiness", true,
              "Correct. Modern success also includes learning and adaptability."),
            o("E", "Only finishing fast, regardless of value", false,
              "Incorrect. Speed alone does not equal success."),
          ],
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "An output is a tangible {{b1}}. An outcome is a lasting {{b2}} or value created by that output.",
          blanks: {
            b1: ["deliverable", "result", "output"],
            b2: ["effect", "benefit", "impact", "outcome"],
          },
          explanation:
            "Output = what is produced. Outcome = the lasting effect or value.",
        },
        {
          id: "q3",
          prompt: "Which example best shows an outcome rather than an output?",
          options: [
            o("A", "A completed software prototype", false,
              "That is an output."),
            o("B", "A final project report", false,
              "That is an output."),
            o("C", "Reduced passenger waiting time after the new system is used", true,
              "Correct. This is a lasting effect/value."),
            o("D", "A training manual", false,
              "That is a deliverable/output."),
          ],
        },
        dnd(
          "q4",
          "Match each lifecycle phase to its main question.",
          [
            { id: "why", label: "Why should this project exist?" },
            { id: "how", label: "How will it succeed?" },
            { id: "deliver", label: "How do we turn the plan into deliverables?" },
            { id: "track", label: "Are we following the plan?" },
            { id: "accepted", label: "Has the project been accepted and learned from?" },
          ],
          [
            {
              id: "initiation",
              text: "Initiation",
              target: "why",
              explanation: "Justify and authorize the project.",
            },
            {
              id: "planning",
              text: "Planning",
              target: "how",
              explanation: "Plan scope, WBS, schedule, cost, quality, resources, communication and risk.",
            },
            {
              id: "execution",
              text: "Execution",
              target: "deliver",
              explanation: "Perform work and coordinate people/resources.",
            },
            {
              id: "control",
              text: "Monitoring & Control",
              target: "track",
              explanation: "Compare actual performance to plan and correct deviations.",
            },
            {
              id: "closing",
              text: "Closing",
              target: "accepted",
              explanation: "Handover, acceptance, evaluation and lessons learned.",
            },
          ],
          "Lifecycle phases describe the project journey from idea to closure."
        ),
        {
          id: "q5",
          type: "recall",
          prompt:
            "Explain this exam sentence: “A project can be efficient but ineffective.”",
          modelAnswer:
            "A project can be efficient if it uses time and money well, but ineffective if the delivered output does not create the intended value or outcome. For example, a project may finish within budget but produce a system that users do not adopt.",
          explanation:
            "Efficiency is resource use; effectiveness is achieving the intended result.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "initiation-documents",
      title: "4. Business Case, SOW, Charter and Approval",
      questions: [
        dnd(
          "q1",
          "Put the core document flow in order.",
          [
            { id: "first", label: "1st" },
            { id: "second", label: "2nd" },
            { id: "third", label: "3rd" },
            { id: "fourth", label: "4th" },
            { id: "fifth", label: "5th" },
            { id: "sixth", label: "6th" },
            { id: "seventh", label: "7th" },
          ],
          [
            {
              id: "bc",
              text: "Business Case",
              target: "first",
              explanation: "Why/value/feasibility.",
            },
            {
              id: "sow",
              text: "Statement of Work",
              target: "second",
              explanation: "High-level what, deliverables and timeline.",
            },
            {
              id: "charter",
              text: "Project Charter",
              target: "third",
              explanation: "Formal authorization and PM authority.",
            },
            {
              id: "req",
              text: "Requirements",
              target: "fourth",
              explanation: "Stakeholder needs and expectations.",
            },
            {
              id: "scope",
              text: "Scope Statement",
              target: "fifth",
              explanation: "In scope, out of scope and acceptance criteria.",
            },
            {
              id: "wbs",
              text: "WBS",
              target: "sixth",
              explanation: "Deliverable breakdown into work packages.",
            },
            {
              id: "schedule",
              text: "Schedule",
              target: "seventh",
              explanation: "Activities, dependencies, estimates and baseline.",
            },
          ],
          "Memory chain: Business Case → SOW → Charter → Requirements → Scope Statement → WBS → Schedule."
        ),
        {
          id: "q2",
          type: "cloze",
          prompt:
            "Business Case = {{b1}}. SOW = high-level {{b2}}. Project Charter = formal {{b3}}.",
          blanks: {
            b1: ["why", "why/value", "value", "justification"],
            b2: ["what", "output", "deliverables"],
            b3: ["authorization", "authority", "approval"],
          },
          explanation:
            "This is the key initiation memory formula.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which items normally belong in a Business Case?",
          options: [
            o("A", "Problem or opportunity", true,
              "Correct. The business case explains the need."),
            o("B", "Expected benefits", true,
              "Correct. Benefits justify the investment."),
            o("C", "Costs and financial analysis", true,
              "Correct. Costs help compare options."),
            o("D", "Risks and assumptions", true,
              "Correct. Uncertainty must be made visible."),
            o("E", "Strategic alignment", true,
              "Correct. The project should support organizational goals."),
            o("F", "A detailed task list for every day", false,
              "Incorrect. Detailed planning comes later."),
          ],
        },
        {
          id: "q4",
          type: "text",
          prompt: "Which document formally gives the project manager authority?",
          answers: ["project charter", "charter", "the project charter"],
          explanation:
            "The Project Charter authorizes the existence of the project and gives the PM authority to apply resources.",
        },
        {
          id: "q5",
          type: "multi",
          prompt: "Which elements belong in a Project Charter?",
          options: [
            o("A", "Purpose/background", true,
              "Correct. It explains why the project exists."),
            o("B", "Objectives and success criteria", true,
              "Correct. Ideally SMART and measurable."),
            o("C", "High-level scope and deliverables", true,
              "Correct. It sets early boundaries."),
            o("D", "Roles and responsibilities", true,
              "Correct. It names sponsor, PM and major stakeholders."),
            o("E", "Milestones, high-level budget and constraints", true,
              "Correct. These create time, money and boundary anchors."),
            o("F", "Only final lessons learned", false,
              "Incorrect. Lessons learned belong mainly to closing and continuous learning."),
          ],
        },
        {
          id: "q6",
          type: "cloze",
          prompt:
            "Charter approval requires {{b1}}, {{b2}}, and {{b3}}.",
          blanks: {
            b1: ["clarity"],
            b2: ["authority"],
            b3: ["commitment"],
          },
          explanation:
            "Clarity = what will/will not be done. Authority = PM can act. Commitment = organization supports funding, staff and attention.",
        },
        {
          id: "q7",
          type: "recall",
          prompt:
            "Recall four stakeholder-alignment techniques you can mention in an exam answer.",
          modelAnswer:
            "Pre-approval briefings, kick-off dialogue, framing benefits in stakeholder language, open discussion of risks and open discussion of constraints. For example, financial benefits for executives, operational benefits for staff and compliance benefits for regulators.",
          explanation:
            "Stakeholder alignment means shared understanding of purpose, outcomes, boundaries and constraints.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "requirements-scope-wbs",
      title: "5. Requirements, Scope Statement and WBS",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Define a requirement and explain how it differs from scope.",
          modelAnswer:
            "A requirement is a stakeholder need or testable condition the product or service should satisfy. Scope is the selected project boundary: what will and will not be delivered. Requirements describe needs; scope decides which needs are included in the project mandate.",
          explanation:
            "Requirement = need. Scope = chosen boundaries and deliverables.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "matrix",
          prompt: "Classify each requirement example.",
          rows: [
            { id: "business", label: "Business" },
            { id: "stakeholder", label: "Stakeholder" },
            { id: "functional", label: "Solution - Functional" },
            { id: "nonfunctional", label: "Solution - Non-functional" },
            { id: "transition", label: "Transition" },
          ],
          columns: [
            { id: "example", label: "Example" },
          ],
          items: [
            {
              id: "delay",
              text: "Reduce port delays",
              row: "business",
              column: "example",
              explanation: "This expresses the strategic/business reason.",
            },
            {
              id: "workflow",
              text: "Operations staff need a simpler check-in workflow",
              row: "stakeholder",
              column: "example",
              explanation: "This describes a stakeholder group need.",
            },
            {
              id: "booking",
              text: "System shall allow online booking changes",
              row: "functional",
              column: "example",
              explanation: "This describes what the system must do.",
            },
            {
              id: "speed",
              text: "Response time must be under 2 seconds",
              row: "nonfunctional",
              column: "example",
              explanation: "This is a performance/quality constraint.",
            },
            {
              id: "training",
              text: "Training and data migration are required before go-live",
              row: "transition",
              column: "example",
              explanation: "This supports movement from old to new state.",
            },
          ],
          explanation:
            "Requirement types help structure stakeholder needs and avoid vague scope.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which are useful requirement collection methods?",
          options: [
            o("A", "Interviews", true,
              "Correct. Good for deep insight and tacit knowledge."),
            o("B", "Workshops/focus groups", true,
              "Correct. Good for surfacing conflicts and aligning stakeholders."),
            o("C", "Document analysis", true,
              "Correct. Uses regulations, complaints, reports and strategies."),
            o("D", "Observation", true,
              "Correct. Shows what users actually do."),
            o("E", "Prototypes/mock-ups", true,
              "Correct. Useful when needs are unclear."),
            o("F", "Guessing without stakeholder input", false,
              "Incorrect. That increases misunderstanding and rework."),
          ],
        },
        {
          id: "q4",
          type: "cloze",
          prompt:
            "A scope statement should include in-scope work, out-of-scope {{b1}}, deliverables and {{b2}} criteria.",
          blanks: {
            b1: ["exclusions", "boundaries"],
            b2: ["acceptance"],
          },
          explanation:
            "Exclusions and acceptance criteria are important because they reduce misunderstanding and scope creep.",
        },
        {
          id: "q5",
          prompt: "Which WBS item is written correctly?",
          options: [
            o("A", "Collect passenger feedback", false,
              "This is an activity because it uses a verb."),
            o("B", "Analyze emissions data", false,
              "This is an activity, not a deliverable."),
            o("C", "Validated emissions dataset", true,
              "Correct. WBS items should be deliverable-oriented nouns."),
            o("D", "Train staff", false,
              "This is an activity. A WBS version could be 'staff training package'."),
          ],
        },
        {
          id: "q6",
          type: "cloze",
          prompt:
            "The WBS follows the {{b1}} rule: it includes 100% of project scope and nothing {{b2}} it.",
          blanks: {
            b1: ["100%", "100 percent", "100% rule", "100 percent rule"],
            b2: ["outside", "beyond"],
          },
          explanation:
            "The 100% rule means no gaps, no overlaps and no extra work outside scope.",
        },
        {
          id: "q7",
          type: "recall",
          prompt: "Explain the difference between deliverables and activities.",
          modelAnswer:
            "A deliverable is what is produced, such as a pilot evaluation report or training package. An activity is the work done to create it, such as collecting data, analyzing results or conducting a workshop. WBS is deliverable-based; the schedule is activity-based.",
          explanation:
            "This is a common exam distinction: WBS = deliverables; schedule = activities.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "scope-creep-change",
      title: "6. Scope Creep and Change Control",
      questions: [
        {
          id: "q1",
          type: "text",
          prompt: "What is uncontrolled expansion of project scope without approved adjustment called?",
          answers: ["scope creep"],
          explanation:
            "Scope creep means extra work is added without formal approval or corresponding changes to time, cost and resources.",
        },
        {
          id: "q2",
          type: "multi",
          prompt: "Which are common causes of scope creep?",
          options: [
            o("A", "Poorly defined scope", true,
              "Correct. Vague language leads to different interpretations."),
            o("B", "Incomplete requirements", true,
              "Correct. Missing needs reappear later as additions."),
            o("C", "Informal stakeholder requests", true,
              "Correct. Small unapproved additions accumulate."),
            o("D", "Weak change control", true,
              "Correct. Without evaluation, changes bypass governance."),
            o("E", "Gold plating", true,
              "Correct. The team adds features without authorization."),
            o("F", "Clearly documented exclusions", false,
              "Incorrect. Exclusions help prevent scope creep."),
          ],
        },
        dnd(
          "q3",
          "Put the change request handling process in order.",
          [
            { id: "first", label: "1st" },
            { id: "second", label: "2nd" },
            { id: "third", label: "3rd" },
            { id: "fourth", label: "4th" },
            { id: "fifth", label: "5th" },
          ],
          [
            {
              id: "capture",
              text: "Capture the request in writing",
              target: "first",
              explanation: "Informal requests must become documented requests.",
            },
            {
              id: "impact",
              text: "Analyze impact on scope, schedule, cost, quality, resources and risk",
              target: "second",
              explanation: "The PM must understand consequences before decision.",
            },
            {
              id: "present",
              text: "Present impact to sponsor or change control board",
              target: "third",
              explanation: "Decision makers need impact information.",
            },
            {
              id: "decision",
              text: "Document approval or rejection",
              target: "fourth",
              explanation: "The decision must be traceable.",
            },
            {
              id: "update",
              text: "If approved, update scope, WBS, schedule and budget",
              target: "fifth",
              explanation: "Approved change must update baselines and planning documents.",
            },
          ],
          "A change is not automatically bad; it becomes scope creep when it bypasses formal evaluation."
        ),
        {
          id: "q4",
          prompt: "Which sentence is best for the exam?",
          options: [
            o("A", "All change is bad and must be rejected.", false,
              "Incorrect. Change can be valuable if controlled."),
            o("B", "A change becomes scope creep when it bypasses formal evaluation and approved adjustment of constraints.", true,
              "Correct. This is the strongest exam wording."),
            o("C", "Stakeholders should add features whenever they want.", false,
              "Incorrect. That creates uncontrolled scope."),
            o("D", "Scope creep only affects quality, never time or cost.", false,
              "Incorrect. Scope creep often damages time, cost, resources and trust."),
          ],
        },
        {
          id: "q5",
          type: "recall",
          prompt: "Recall at least three warning signs of scope creep.",
          modelAnswer:
            "Warning signs include phrases like 'couldn’t you just add...', team-added enhancements, deliverables becoming larger or more complex, frequent rework/redesign, and unexplained schedule slips.",
          explanation:
            "Warning signs show that expectations or deliverables are growing without formal control.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "schedule-management",
      title: "7. Activities, Dependencies, Estimates and Schedule",
      questions: [
        dnd(
          "q1",
          "Put the flow from scope to executable schedule in order.",
          [
            { id: "first", label: "1st" },
            { id: "second", label: "2nd" },
            { id: "third", label: "3rd" },
            { id: "fourth", label: "4th" },
            { id: "fifth", label: "5th" },
            { id: "sixth", label: "6th" },
          ],
          [
            {
              id: "scope",
              text: "Scope Statement",
              target: "first",
              explanation: "Defines boundaries and deliverables.",
            },
            {
              id: "wbs",
              text: "WBS",
              target: "second",
              explanation: "Breaks deliverables into work packages.",
            },
            {
              id: "activities",
              text: "Activities",
              target: "third",
              explanation: "Specific work needed to create work packages.",
            },
            {
              id: "sequence",
              text: "Sequencing",
              target: "fourth",
              explanation: "Defines dependencies and workflow.",
            },
            {
              id: "estimates",
              text: "Estimates",
              target: "fifth",
              explanation: "Estimate resources and durations.",
            },
            {
              id: "schedule",
              text: "Schedule",
              target: "sixth",
              explanation: "Dates, baseline and monitoring.",
            },
          ],
          "Memory chain: Scope → WBS → Activities → Sequencing → Estimates → Schedule."
        ),
        {
          id: "q2",
          type: "matrix",
          prompt: "Classify each dependency type.",
          rows: [
            { id: "fs", label: "Finish-to-Start" },
            { id: "ss", label: "Start-to-Start" },
            { id: "ff", label: "Finish-to-Finish" },
            { id: "mandatory", label: "Mandatory" },
            { id: "discretionary", label: "Discretionary" },
          ],
          columns: [
            { id: "meaning", label: "Meaning" },
          ],
          items: [
            {
              id: "fsitem",
              text: "Activity B cannot start until Activity A finishes",
              row: "fs",
              column: "meaning",
              explanation: "FS is the most common dependency.",
            },
            {
              id: "ssitem",
              text: "Activity B can start when Activity A starts",
              row: "ss",
              column: "meaning",
              explanation: "SS means starts are linked.",
            },
            {
              id: "ffitem",
              text: "Activity B can finish only when Activity A finishes",
              row: "ff",
              column: "meaning",
              explanation: "FF means finishes are linked.",
            },
            {
              id: "manditem",
              text: "Inherent to the work and cannot easily be changed",
              row: "mandatory",
              column: "meaning",
              explanation: "Mandatory dependencies are hard logic.",
            },
            {
              id: "discitem",
              text: "Chosen by the team as best practice and can be challenged",
              row: "discretionary",
              column: "meaning",
              explanation: "Discretionary dependencies are soft logic.",
            },
          ],
          explanation:
            "Dependency logic is the basis for network diagrams and critical path thinking.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which statements about activities are correct?",
          options: [
            o("A", "Activities are specific pieces of work required to produce work packages.", true,
              "Correct. Activities are schedule-level work."),
            o("B", "Activities should have clear start and end points.", true,
              "Correct. This makes them schedulable."),
            o("C", "Activities should be traceable to approved deliverables.", true,
              "Correct. This keeps schedule linked to scope."),
            o("D", "Activities are the same as WBS deliverables.", false,
              "Incorrect. WBS = deliverables; activities = work done."),
            o("E", "Activities should be vague, such as 'manage improvements'.", false,
              "Incorrect. Use specific action verbs."),
          ],
        },
        {
          id: "q4",
          prompt: "Which estimation method is best when detailed WBS work packages are available?",
          options: [
            o("A", "Bottom-up estimating", true,
              "Correct. It estimates detailed work packages and rolls them up."),
            o("B", "Analogous estimating", false,
              "Analogous is useful early with similar past projects."),
            o("C", "Random guessing", false,
              "Not a valid estimation method."),
            o("D", "Ignoring assumptions", false,
              "Assumptions should be documented."),
          ],
        },
        {
          id: "q5",
          type: "cloze",
          prompt:
            "A milestone is a significant point in time with {{b1}} duration.",
          blanks: {
            b1: ["zero", "0", "no"],
          },
          explanation:
            "Milestones show key points like approval completed or pilot report accepted; they are not work activities.",
        },
        {
          id: "q6",
          type: "recall",
          prompt: "Explain what the critical path is.",
          modelAnswer:
            "The critical path is the longest dependent sequence of activities that determines the shortest possible project duration. Critical activities have no float; delaying them delays the whole project.",
          explanation:
            "Critical path = longest path + zero float + controls finish date.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "network-1day",
      title: "8. Network Diagram and 1-Day Methodology",
      questions: [
        {
          id: "q1",
          type: "cloze",
          prompt:
            "In 1-day methodology, EF = ES + Duration - {{b1}}.",
          blanks: {
            b1: ["1", "one"],
          },
          explanation:
            "Because the first working day counts as day 1, EF = ES + duration - 1.",
        },
        num(
          "q2",
          "1-day methodology.\nActivity A has ES = 1 and duration = 6 days.\nWhat is EF?",
          6,
          "EF = ES + duration - 1 = 1 + 6 - 1 = 6.",
          { unit: "days", tolerance: 0, hint: "Use EF = ES + Dur - 1." }
        ),
        num(
          "q3",
          "1-day methodology.\nA predecessor finishes on day 13.\nWhat is the ES of its finish-to-start successor?",
          14,
          "A successor starts on the next day: ES(successor) = predecessor EF + 1 = 13 + 1 = 14.",
          { unit: "day", tolerance: 0, hint: "Successor ES = predecessor EF + 1." }
        ),
        num(
          "q4",
          "Backward pass with 1-day methodology.\nAn activity has LF = 16 and duration = 3.\nWhat is LS?",
          14,
          "LS = LF - duration + 1 = 16 - 3 + 1 = 14.",
          { unit: "day", tolerance: 0, hint: "Use LS = LF - Dur + 1." }
        ),
        num(
          "q5",
          "Float calculation.\nActivity has ES = 7 and LS = 8.\nWhat is Float?",
          1,
          "Float = LS - ES = 8 - 7 = 1 day. Also Float = LF - EF.",
          { unit: "day", tolerance: 0, hint: "Float = LS - ES." }
        ),
        {
          id: "q6",
          type: "matrix",
          prompt: "Classify each network diagram concept.",
          rows: [
            { id: "burst", label: "Burst" },
            { id: "merge", label: "Merge" },
            { id: "parallel", label: "Parallel" },
            { id: "critical", label: "Critical Activity" },
          ],
          columns: [
            { id: "meaning", label: "Meaning" },
          ],
          items: [
            {
              id: "burstitem",
              text: "One predecessor has several successors",
              row: "burst",
              column: "meaning",
              explanation: "A burst splits into multiple outgoing paths.",
            },
            {
              id: "mergeitem",
              text: "Several predecessors feed into one successor",
              row: "merge",
              column: "meaning",
              explanation: "A merge waits for several incoming paths.",
            },
            {
              id: "parallelitem",
              text: "Activities can run at the same time because no dependency blocks them",
              row: "parallel",
              column: "meaning",
              explanation: "Parallel work can overlap.",
            },
            {
              id: "crititem",
              text: "Float = 0; delay delays the project",
              row: "critical",
              column: "meaning",
              explanation: "Critical activities control the finish date.",
            },
          ],
          explanation:
            "Network vocabulary helps explain diagrams clearly in the exam.",
        },
      ],
    },

    {
      id: "cost-evm",
      title: "9. Cost Management and Earned Value Management",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Recall the basic cost-management logic from estimate to control.",
          modelAnswer:
            "Estimate costs, build the budget, approve a time-phased cost baseline, then control performance using measures such as PV, EV, AC, CPI and SPI. Costs are estimated from WBS/work packages and linked to the schedule.",
          explanation:
            "Cost management turns activities into money and baselines.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "matrix",
          prompt: "Match each cost estimation technique to its best use.",
          rows: [
            { id: "analogous", label: "Analogous" },
            { id: "parametric", label: "Parametric" },
            { id: "bottomup", label: "Bottom-up" },
            { id: "expert", label: "Expert judgment" },
          ],
          columns: [
            { id: "bestuse", label: "Best use" },
          ],
          items: [
            {
              id: "analogousitem",
              text: "Early phase; similar past project exists",
              row: "analogous",
              column: "bestuse",
              explanation: "Fast and cheap, but depends on similarity.",
            },
            {
              id: "parametricitem",
              text: "Reliable data and stable variables exist",
              row: "parametric",
              column: "bestuse",
              explanation: "Uses statistical relationships such as cost per unit.",
            },
            {
              id: "bottomupitem",
              text: "Scope/WBS is defined enough for work-package estimates",
              row: "bottomup",
              column: "bestuse",
              explanation: "Detailed and usually more accurate, but time-consuming.",
            },
            {
              id: "expertitem",
              text: "Context matters or data is limited",
              row: "expert",
              column: "bestuse",
              explanation: "Adds practical realism but should be structured.",
            },
          ],
          explanation:
            "Choose the estimation method based on available detail, data and uncertainty.",
        },
        {
          id: "q3",
          type: "cloze",
          prompt:
            "Contingency reserve is for identified risks and is part of the cost {{b1}}. Management reserve is for unknown unknowns and is usually controlled by the {{b2}} or senior management.",
          blanks: {
            b1: ["baseline", "cost baseline"],
            b2: ["sponsor", "senior management", "management"],
          },
          explanation:
            "Contingency reserve is inside the baseline; management reserve is separate.",
        },
        {
          id: "q4",
          type: "cloze",
          prompt:
            "PV = planned value. EV = {{b1}} value. AC = {{b2}} cost.",
          blanks: {
            b1: ["earned", "earned value"],
            b2: ["actual", "actual cost"],
          },
          explanation:
            "PV is planned value of scheduled work; EV is value of completed work; AC is money spent.",
        },
        {
          id: "q5",
          prompt: "Why is comparing planned cost with actual cost alone incomplete?",
          options: [
            o("A", "Because spending less may simply mean that less work was completed.", true,
              "Correct. EVM adds earned value to judge progress objectively."),
            o("B", "Because actual cost is never useful.", false,
              "Incorrect. AC is useful but incomplete alone."),
            o("C", "Because planned value is always wrong.", false,
              "Incorrect. PV is still needed as a baseline comparison."),
            o("D", "Because project cost should never be controlled.", false,
              "Incorrect. Cost control is essential."),
          ],
        },
        num(
          "q6",
          "EVM calculation.\nEV = 90,000\nAC = 110,000\nWhat is CPI?",
          0.82,
          "CPI = EV / AC = 90,000 / 110,000 = 0.818..., rounded to 0.82. CPI < 1 means over budget / cost inefficient.",
          { tolerance: 0.01, hint: "CPI = EV / AC." }
        ),
        num(
          "q7",
          "EVM calculation.\nEV = 90,000\nPV = 120,000\nWhat is SPI?",
          0.75,
          "SPI = EV / PV = 90,000 / 120,000 = 0.75. SPI < 1 means behind schedule.",
          { tolerance: 0.01, hint: "SPI = EV / PV." }
        ),
        {
          id: "q8",
          prompt: "CPI < 1 and SPI < 1. What does this signal?",
          options: [
            o("A", "Under budget and ahead of schedule.", false,
              "Incorrect. Both below 1 are unfavorable."),
            o("B", "Over budget and behind schedule.", true,
              "Correct. CPI < 1 = cost problem; SPI < 1 = schedule problem."),
            o("C", "Under budget but behind schedule.", false,
              "That would be CPI > 1 and SPI < 1."),
            o("D", "Ahead of schedule but over budget.", false,
              "That would be CPI < 1 and SPI > 1."),
          ],
        },
        {
          id: "q9",
          type: "recall",
          prompt: "Explain the limitation of EVM in highly exploratory work.",
          modelAnswer:
            "EVM needs clear scope, an approved WBS and a valid cost baseline. It works best when completed work can be measured. In highly exploratory work, where the solution changes through learning, EVM should be combined with qualitative judgment and stakeholder dialogue.",
          explanation:
            "EVM is powerful but depends on measurable completed work and stable baselines.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "agile-waterfall",
      title: "10. Waterfall, Agile and VUCA",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Explain why Agile emerged.",
          modelAnswer:
            "Agile emerged because many well-planned projects failed when reality changed faster than the plan. In software and innovation contexts, requirements were often unclear at the beginning and became clearer only after users saw early results. Agile manages uncertainty through short cycles, feedback and learning.",
          explanation:
            "Key memory: Agile emerged because fixed upfront planning struggled in VUCA environments.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "VUCA stands for {{b1}}, {{b2}}, {{b3}}, and {{b4}}.",
          blanks: {
            b1: ["volatility", "volatile"],
            b2: ["uncertainty", "uncertain"],
            b3: ["complexity", "complex"],
            b4: ["ambiguity", "ambiguous"],
          },
          explanation:
            "VUCA describes environments where fixed plans become unreliable.",
        },
        {
          id: "q3",
          type: "matrix",
          prompt: "Match each VUCA factor to its meaning.",
          rows: [
            { id: "volatility", label: "Volatility" },
            { id: "uncertainty", label: "Uncertainty" },
            { id: "complexity", label: "Complexity" },
            { id: "ambiguity", label: "Ambiguity" },
          ],
          columns: [
            { id: "meaning", label: "Meaning" },
          ],
          items: [
            {
              id: "v",
              text: "Fast and large changes",
              row: "volatility",
              column: "meaning",
              explanation: "Volatility makes fixed plans outdated quickly.",
            },
            {
              id: "u",
              text: "Past experience does not reliably predict the future",
              row: "uncertainty",
              column: "meaning",
              explanation: "Uncertainty makes forecasts less reliable.",
            },
            {
              id: "c",
              text: "Many interacting variables and stakeholders",
              row: "complexity",
              column: "meaning",
              explanation: "Complexity makes cause-effect hard to control upfront.",
            },
            {
              id: "a",
              text: "Unclear meaning or multiple interpretations",
              row: "ambiguity",
              column: "meaning",
              explanation: "Ambiguity means stakeholders may understand the same words differently.",
            },
          ],
          explanation:
            "VUCA helps justify adaptive project management.",
        },
        {
          id: "q4",
          type: "multi",
          prompt: "Which statements correctly compare Waterfall and Agile?",
          options: [
            o("A", "Waterfall assumes requirements can be defined early.", true,
              "Correct. Predictive methods work best with stable requirements."),
            o("B", "Agile assumes knowledge emerges during the project.", true,
              "Correct. Agile adds detail as information improves."),
            o("C", "Waterfall treats change as expected learning in short cycles.", false,
              "Incorrect. That is Agile logic."),
            o("D", "Agile delivers small usable increments in short cycles.", true,
              "Correct. Incremental delivery supports feedback."),
            o("E", "Waterfall is always better than Agile.", false,
              "Incorrect. Fit depends on context."),
          ],
        },
        {
          id: "q5",
          prompt: "Which project is most suitable for Agile?",
          options: [
            o("A", "A compliance-heavy system with fixed legal requirements and high cost of change.", false,
              "Predictive or structured governance is usually better here."),
            o("B", "A passenger app where preferences and useful features are unclear.", true,
              "Correct. Agile helps test features and learn from feedback."),
            o("C", "A safety-critical construction approval with fixed regulation.", false,
              "This needs strong upfront control and compliance."),
            o("D", "A routine daily invoice process.", false,
              "That is a process, not an Agile project by itself."),
          ],
        },
        {
          id: "q6",
          type: "recall",
          prompt: "Compare Waterfall and Agile in one strong exam paragraph.",
          modelAnswer:
            "Waterfall is predictive and plan-driven: it works best when requirements are stable, technology is mature and change is costly. Agile is adaptive and feedback-driven: it works best when requirements are uncertain, stakeholder needs evolve and learning is needed during delivery. Waterfall reduces uncertainty upfront; Agile manages uncertainty through short cycles, experiments and usable increments.",
          explanation:
            "Strong answer = compare uncertainty logic, change logic and best-fit context.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "agile-leadership",
      title: "11. Agile Mindset and Leadership",
      questions: [
        {
          id: "q1",
          type: "multi",
          prompt: "Which statements describe an Agile mindset?",
          options: [
            o("A", "Uncertainty is normal and managed through feedback.", true,
              "Correct. Agile treats uncertainty as something to learn through."),
            o("B", "Deviation from plan may signal learning.", true,
              "Correct. Change can mean better information."),
            o("C", "Success is value delivered and learning achieved.", true,
              "Correct. Agile success is not only plan conformance."),
            o("D", "Managers must assign every task in detail.", false,
              "Incorrect. Agile teams self-organize within goals and constraints."),
            o("E", "Customer collaboration matters.", true,
              "Correct. Feedback and collaboration are central."),
          ],
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "Agile leadership shifts from directing work to {{b1}} work.",
          blanks: {
            b1: ["enabling", "facilitating", "supporting"],
          },
          explanation:
            "Agile leaders create conditions for teams to succeed instead of controlling every task.",
        },
        {
          id: "q3",
          prompt: "What does self-organization mean?",
          options: [
            o("A", "The team works without goals or accountability.", false,
              "Incorrect. Self-organization is not chaos."),
            o("B", "The team decides how to do the work within clear goals, priorities and constraints.", true,
              "Correct. Autonomy exists inside boundaries."),
            o("C", "The customer assigns every developer's daily task.", false,
              "Incorrect. The team organizes its own work."),
            o("D", "The project manager disappears and no leadership is needed.", false,
              "Incorrect. Agile still needs enabling leadership."),
          ],
        },
        {
          id: "q4",
          type: "recall",
          prompt: "Explain why Agile leadership is not the absence of leadership.",
          modelAnswer:
            "Agile leadership is skilled leadership that creates conditions for teams to succeed: clear goals, stakeholder access, fast feedback, psychological safety and removal of obstacles. The leader defines direction and constraints, while the team decides how to do the work.",
          explanation:
            "Memory sentence: autonomy without direction becomes confusion; control without autonomy slows learning.",
          allowTypedAnswer: true,
        },
        {
          id: "q5",
          type: "matrix",
          prompt: "Classify each misconception and better exam wording.",
          rows: [
            { id: "noplan", label: "Agile means no planning" },
            { id: "nodocs", label: "Agile means no documentation" },
            { id: "changeall", label: "Customer can change everything anytime" },
            { id: "nomgr", label: "Self-organizing teams need no manager" },
          ],
          columns: [
            { id: "fix", label: "Better wording" },
          ],
          items: [
            {
              id: "planning",
              text: "Agile uses continuous, adaptive planning based on evidence",
              row: "noplan",
              column: "fix",
              explanation: "Agile plans, but updates plans as learning occurs.",
            },
            {
              id: "docs",
              text: "Agile keeps documentation that supports transparency and decisions",
              row: "nodocs",
              column: "fix",
              explanation: "Agile avoids unnecessary documentation, not all documentation.",
            },
            {
              id: "change",
              text: "Change is welcome but must be prioritized and should not destroy the Sprint Goal",
              row: "changeall",
              column: "fix",
              explanation: "Agile change is disciplined, not random.",
            },
            {
              id: "manager",
              text: "Teams need enabling leadership, clear priorities and impediment removal",
              row: "nomgr",
              column: "fix",
              explanation: "Self-organization still requires conditions and support.",
            },
          ],
          explanation:
            "These misconceptions are common exam traps.",
        },
      ],
    },

    {
      id: "scrum",
      title: "12. Scrum Roles, Events and Artifacts",
      questions: [
        {
          id: "q1",
          type: "cloze",
          prompt:
            "Scrum is based on empiricism: decisions are based on observation, experience and {{b1}}, supported by transparency, inspection and {{b2}}.",
          blanks: {
            b1: ["experiments", "experimentation"],
            b2: ["adaptation"],
          },
          explanation:
            "Scrum is empirical rather than purely predictive.",
        },
        {
          id: "q2",
          type: "matrix",
          prompt: "Match each Scrum role to its core accountability.",
          rows: [
            { id: "po", label: "Product Owner" },
            { id: "sm", label: "Scrum Master" },
            { id: "dev", label: "Developers" },
          ],
          columns: [
            { id: "accountability", label: "Accountability" },
          ],
          items: [
            {
              id: "value",
              text: "Maximizes value and orders the Product Backlog",
              row: "po",
              column: "accountability",
              explanation: "The Product Owner has final authority on priorities.",
            },
            {
              id: "process",
              text: "Facilitates Scrum, removes impediments and protects focus",
              row: "sm",
              column: "accountability",
              explanation: "The Scrum Master is a servant leader, not a task-assigning boss.",
            },
            {
              id: "delivery",
              text: "Create usable increments and decide how to do the work",
              row: "dev",
              column: "accountability",
              explanation: "Developers are cross-functional and self-managing.",
            },
          ],
          explanation:
            "Scrum distributes traditional PM responsibilities across roles.",
        },
        {
          id: "q3",
          type: "text",
          prompt: "Which Scrum role owns and orders the Product Backlog?",
          answers: ["product owner", "the product owner", "po"],
          explanation:
            "The Product Owner maximizes value and has final authority over backlog ordering.",
        },
        {
          id: "q4",
          type: "multi",
          prompt: "Which Scrum events are part of the broader Scrum framework?",
          options: [
            o("A", "Sprint", true,
              "Correct. The Sprint is the core container for Scrum work."),
            o("B", "Sprint Planning", true,
              "Correct. The team selects work and defines the Sprint Goal."),
            o("C", "Daily Scrum", true,
              "Correct. Developers inspect progress toward the Sprint Goal."),
            o("D", "Sprint Review", true,
              "Correct. Stakeholders inspect the increment and adapt the backlog."),
            o("E", "Sprint Retrospective", true,
              "Correct. The team inspects and improves how it works."),
            o("F", "Annual command-and-control audit only", false,
              "Incorrect. Scrum uses frequent inspection and adaptation."),
          ],
        },
        dnd(
          "q5",
          "Match each Scrum event to its main purpose.",
          [
            { id: "container", label: "Core time box / container" },
            { id: "select", label: "Select work and define goal" },
            { id: "coordinate", label: "Daily coordination" },
            { id: "feedback", label: "Stakeholder product feedback" },
            { id: "improve", label: "Team/process improvement" },
          ],
          [
            {
              id: "sprint",
              text: "Sprint",
              target: "container",
              explanation: "Fixed time box, usually 2–4 weeks, to create a usable increment.",
            },
            {
              id: "planning",
              text: "Sprint Planning",
              target: "select",
              explanation: "Defines what can be done, how and why it is valuable.",
            },
            {
              id: "daily",
              text: "Daily Scrum",
              target: "coordinate",
              explanation: "Developers inspect progress toward the Sprint Goal.",
            },
            {
              id: "review",
              text: "Sprint Review",
              target: "feedback",
              explanation: "Inspect the increment with stakeholders and adapt the Product Backlog.",
            },
            {
              id: "retro",
              text: "Sprint Retrospective",
              target: "improve",
              explanation: "Inspect how the team worked and choose improvements.",
            },
          ],
          "Scrum events create rhythm for inspection and adaptation."
        ),
        {
          id: "q6",
          type: "matrix",
          prompt: "Match Scrum artifacts to owner/accountability and commitment idea.",
          rows: [
            { id: "pb", label: "Product Backlog" },
            { id: "sb", label: "Sprint Backlog" },
            { id: "inc", label: "Increment" },
          ],
          columns: [
            { id: "owner", label: "Owner / commitment" },
          ],
          items: [
            {
              id: "pbitem",
              text: "Product Owner; ordered list of possible work; Product Goal/value direction",
              row: "pb",
              column: "owner",
              explanation: "Product Backlog is the single source of future work.",
            },
            {
              id: "sbitem",
              text: "Developers; selected items plus plan; Sprint Goal",
              row: "sb",
              column: "owner",
              explanation: "Sprint Backlog focuses current Sprint work.",
            },
            {
              id: "incitem",
              text: "Scrum Team; usable completed result; Definition of Done",
              row: "inc",
              column: "owner",
              explanation: "Increment is evidence of delivered value.",
            },
          ],
          explanation:
            "Scrum artifacts make work and progress visible.",
        },
        {
          id: "q7",
          type: "recall",
          prompt: "Explain why the Scrum Master is not a traditional project manager.",
          modelAnswer:
            "The Scrum Master does not assign tasks or control the team like a traditional project manager. The Scrum Master acts as a servant leader who facilitates Scrum, ensures events happen, removes impediments and protects the team’s focus. Product priorities belong to the Product Owner, and delivery decisions belong to the Developers.",
          explanation:
            "This is one of the most important Scrum distinctions.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "hybrid-tailoring-tools",
      title: "13. Hybrid, Tailoring and Digital Tools",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Define hybrid project management.",
          modelAnswer:
            "Hybrid project management deliberately combines predictive, Agile or other approaches to best achieve project objectives. It is not random mixing; it is a tailored design of what should remain structured and what should remain adaptive.",
          explanation:
            "Hybrid = deliberate combination, not confusion.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "matrix",
          prompt: "Choose the best method for each workstream type.",
          rows: [
            { id: "predictive", label: "Predictive" },
            { id: "agile", label: "Agile / Adaptive" },
            { id: "hybrid", label: "Hybrid" },
          ],
          columns: [
            { id: "workstream", label: "Workstream" },
          ],
          items: [
            {
              id: "compliance",
              text: "Known compliance/reporting system with low uncertainty and high criticality",
              row: "predictive",
              column: "workstream",
              explanation: "Stable and critical work benefits from baselines and approvals.",
            },
            {
              id: "prototype",
              text: "Experimental passenger experience prototype with high uncertainty and low criticality",
              row: "agile",
              column: "workstream",
              explanation: "Uncertain customer-facing innovation benefits from feedback cycles.",
            },
            {
              id: "dashboard",
              text: "Dashboard UX plus technical integration with medium uncertainty and medium criticality",
              row: "hybrid",
              column: "workstream",
              explanation: "Use structure for integration and adaptability for UX learning.",
            },
          ],
          explanation:
            "Method choice should be based on uncertainty, criticality, cost of change and constraints.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which tailoring questions should a project manager ask?",
          options: [
            o("A", "How certain are requirements and the solution path?", true,
              "Correct. Stable requirements point more predictive; emergent needs point Agile."),
            o("B", "How costly is change after implementation starts?", true,
              "Correct. High cost of change favors more upfront planning."),
            o("C", "How quickly must learning occur?", true,
              "Correct. Fast learning needs shorter feedback loops."),
            o("D", "How strong are regulatory or contractual constraints?", true,
              "Correct. Compliance may require documentation and approvals."),
            o("E", "Which method sounds more fashionable?", false,
              "Incorrect. Tailoring should be based on project characteristics, not trends."),
          ],
        },
        {
          id: "q4",
          type: "matrix",
          prompt: "Match each digital tool type to its main support.",
          rows: [
            { id: "schedule", label: "Detailed scheduling" },
            { id: "agile", label: "Agile backlog / sprint work" },
            { id: "visual", label: "Lightweight visual coordination" },
            { id: "hybrid", label: "Hybrid work management" },
          ],
          columns: [
            { id: "support", label: "Supports" },
          ],
          items: [
            {
              id: "msproject",
              text: "Gantt charts, dependencies, resource allocation and baselines",
              row: "schedule",
              column: "support",
              explanation: "Examples include Microsoft Project.",
            },
            {
              id: "jira",
              text: "Backlogs, sprint boards, issue tracking and reporting",
              row: "agile",
              column: "support",
              explanation: "Examples include Jira.",
            },
            {
              id: "trello",
              text: "Kanban boards, task ownership and simple collaboration",
              row: "visual",
              column: "support",
              explanation: "Examples include Trello and simple Asana boards.",
            },
            {
              id: "monday",
              text: "Dashboards, workload, collaboration and reporting across mixed work",
              row: "hybrid",
              column: "support",
              explanation: "Examples include Monday.com, Asana and MS Project integrations.",
            },
          ],
          explanation:
            "Tools make work visible but do not replace judgment or communication.",
        },
        {
          id: "q5",
          type: "cloze",
          prompt:
            "Tools support project management, but they do not replace professional {{b1}}, stakeholder {{b2}}, or disciplined updating.",
          blanks: {
            b1: ["judgment", "judgement"],
            b2: ["communication"],
          },
          explanation:
            "A tool is only useful if the team keeps it accurate and communicates around it.",
        },
        {
          id: "q6",
          type: "recall",
          prompt: "Apply hybrid PM to the Green Cruise initiative.",
          modelAnswer:
            "Use predictive/PMI elements for governance, business case, charter, WBS, budget baseline, regulatory milestones and reporting. Use Agile/Scrum elements for uncertain solution design, sustainability indicators, stakeholder workshops and pilot improvements. Keep approvals and budget control structured, but let prototypes and learning adapt based on feedback.",
          explanation:
            "Strong answer separates stable/high-criticality work from uncertain/learning-heavy work.",
          allowTypedAnswer: true,
        },
      ],
    },

    {
      id: "future-success-exam",
      title: "14. Future PM, Success Factors and Exam Answers",
      questions: [
        {
          id: "q1",
          type: "multi",
          prompt: "Which trends are shaping future project management?",
          options: [
            o("A", "Data analytics", true,
              "Correct. Real-time indicators help detect bottlenecks, risks and cost issues earlier."),
            o("B", "Predictive analytics", true,
              "Correct. Historical data can help forecast likely problems."),
            o("C", "AI and automation", true,
              "Correct. These can support scheduling, risk analysis and reporting."),
            o("D", "Value delivery", true,
              "Correct. Success is judged by meaningful outcomes, not only outputs."),
            o("E", "Adaptive leadership", true,
              "Correct. PMs increasingly facilitate collaboration and learning."),
            o("F", "Ignoring stakeholder alignment", false,
              "Incorrect. Stakeholder alignment becomes more important, not less."),
          ],
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "Predictive methods optimize {{b1}} when variability is low. Agile methods optimize {{b2}} when variability is high. Hybrid methods combine both when projects contain stable and uncertain parts.",
          blanks: {
            b1: ["predictability"],
            b2: ["adaptability"],
          },
          explanation:
            "This is the core comparison sentence for PMI vs Agile vs Hybrid.",
        },
        {
          id: "q3",
          type: "recall",
          prompt: "Give a strong short answer structure for any exam question asking you to apply a concept to a scenario.",
          modelAnswer:
            "Identify the relevant concept, define it briefly, connect it to one concrete scenario fact, recommend an action or interpretation, and explain the impact on time, cost, scope, quality, risk, stakeholders or value.",
          explanation:
            "Strong exam answers are structured, scenario-based, measurable and use exact terminology.",
          allowTypedAnswer: true,
        },
        {
          id: "q4",
          type: "matrix",
          prompt: "Match each exam question type to a strong answer pattern.",
          rows: [
            { id: "define", label: "Define a concept" },
            { id: "compare", label: "Compare two concepts" },
            { id: "document", label: "Explain a document" },
            { id: "risk", label: "Discuss a risk/pitfall" },
            { id: "scenario", label: "Apply to scenario" },
          ],
          columns: [
            { id: "pattern", label: "Answer pattern" },
          ],
          items: [
            {
              id: "defineitem",
              text: "Definition → key elements → why it matters → short example",
              row: "define",
              column: "pattern",
              explanation: "Definitions alone are usually not enough.",
            },
            {
              id: "compareitem",
              text: "Both definitions → compare purpose/duration/output/risk/approach → example",
              row: "compare",
              column: "pattern",
              explanation: "Comparison needs dimensions, not two separate definitions only.",
            },
            {
              id: "documentitem",
              text: "Purpose → when created → what it contains → how it feeds next document",
              row: "document",
              column: "pattern",
              explanation: "Useful for Business Case, SOW, Charter, Scope Statement and WBS.",
            },
            {
              id: "riskitem",
              text: "Define problem → causes → warning signs → prevention/control",
              row: "risk",
              column: "pattern",
              explanation: "Good for scope creep, cost overruns and stakeholder conflict.",
            },
            {
              id: "scenarioitem",
              text: "Relevant concept → scenario link → recommended action → justified impact",
              row: "scenario",
              column: "pattern",
              explanation: "Scenario application is essential for high marks.",
            },
          ],
          explanation:
            "Use the prompt structure as your answer structure to avoid missing parts.",
        },
        {
          id: "q5",
          type: "recall",
          prompt: "Final memory chain: write the full project-management flow from need/value to closing.",
          modelAnswer:
            "Need/value → Business Case → SOW → Project Charter → Requirements → Scope Statement → WBS → Activities → Estimates → Schedule Baseline → Monitor and Control → Closing/Lessons Learned.",
          explanation:
            "This chain connects the whole course from initiation to control and closure.",
          allowTypedAnswer: true,
        },
        {
          id: "q6",
          type: "recall",
          prompt:
            "Final big synthesis: In one paragraph, explain what project management is really about in this course.",
          modelAnswer:
            "Project management is not about blindly following one method. It is about designing the right structure for a temporary effort under constraints, uncertainty and stakeholder complexity. Predictive methods create control through baselines, Agile creates control through feedback, and hybrid/tailoring combines structure and adaptability to deliver value, not just outputs.",
          explanation:
            "This is the final course logic: value under constraints through the right method.",
          allowTypedAnswer: true,
        },
      ],
    },
  ],
};

export default finalExamRevision;