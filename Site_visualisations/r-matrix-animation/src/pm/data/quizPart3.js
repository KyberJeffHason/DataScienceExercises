import quizPart2 from "./quizPart2";

// Active-recall quiz on project initiation documents — business case, SOW, charter and approval.
const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });

const dnd = (id, prompt, targets, items, explanation = "") => ({
  id,
  type: "dnd",
  prompt,
  targets,
  items,
  explanation,
});

export const quizPart3 = {
  id: "project-initiation-recall",
  title: "Part 3:Project Initiation Documents",
  subtitle: "Business case, SOW, charter and approval — active recall quiz",
  description:
    "A recall-heavy quiz on project initiation documents. It tests not only recognition, " +
    "but also memory: what each document does, when it is created, what it includes, " +
    "and how approval and stakeholder alignment move the project into planning.",
  sections: [
    {
      id: "business-case",
      title: "Business Case",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Without looking: explain the purpose of a Business Case in 1–2 sentences.",
          modelAnswer:
            "A Business Case justifies why a project should be undertaken. It explains the problem or opportunity, expected value, costs, risks, strategic alignment and recommendation so decision makers can decide whether the project is worth the investment.",
          explanation:
            "The key idea: Business Case = why the project is worth doing.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "The Business Case answers three core questions: Is this project worth the {{b1}}? What {{b2}} does it solve? What {{b3}} will it create?",
          blanks: {
            b1: ["investment", "cost", "resources"],
            b2: ["problem", "issue", "need"],
            b3: ["value", "benefit", "benefits"],
          },
          explanation:
            "A Business Case checks whether the project is justified, what problem it solves, and what value it creates.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which elements commonly belong in a Business Case?",
          options: [
            o("A", "Problem or opportunity statement", true,
              "Correct. The Business Case explains the current need or opportunity."),
            o("B", "Expected benefits", true,
              "Correct. Benefits may include revenue, cost reduction, efficiency, customer satisfaction or compliance."),
            o("C", "Cost estimates and financial analysis", true,
              "Correct. Implementation, operational, maintenance and indirect costs may be considered."),
            o("D", "Risks and assumptions", true,
              "Correct. The Business Case identifies uncertainties such as market conditions, adoption or resources."),
            o("E", "Detailed day-by-day task schedule", false,
              "Incorrect. Detailed scheduling normally happens later in planning."),
            o("F", "Strategic alignment and recommendation", true,
              "Correct. It explains how the project supports strategy and why the preferred option should be chosen."),
          ],
        },
        {
          id: "q4",
          type: "text",
          prompt: "Which document is mainly about why the project should exist?",
          answers: ["business case", "the business case"],
          explanation:
            "The Business Case focuses on why: justification, value, benefits and strategic fit.",
        },
        {
          id: "q5",
          prompt: "Why is the Business Case described as a living document?",
          options: [
            o("A", "Because it can be revisited when scope changes or major problems occur.", true,
              "Correct. Decision makers can check whether the original justification still holds."),
            o("B", "Because it replaces the Project Charter.", false,
              "Incorrect. The Business Case justifies the project; the charter authorizes it."),
            o("C", "Because it is only written after the project is closed.", false,
              "Incorrect. It is created before formal initiation and may be updated later."),
            o("D", "Because it contains no evidence or analysis.", false,
              "Incorrect. The Business Case should be evidence-based and analytical."),
          ],
        },
        {
          id: "q6",
          type: "recall",
          prompt: "Recall at least four benefits of having a strong Business Case.",
          modelAnswer:
            "A strong Business Case supports approval, prioritization, transparency, accountability and continuity. It helps choose projects with high strategic return, explains why the project starts, records expected outcomes for later comparison and keeps the rationale accessible even if leadership changes.",
          explanation:
            "Good answers should include several of these: approval, prioritization, transparency, accountability, continuity, strategic alignment.",
          allowTypedAnswer: true,
        },
      ],
    },
    {
      id: "sow-to-charter",
      title: "From SOW to Project Charter",
      questions: [
        dnd(
          "q1",
          "Put the project initiation document flow in the correct order.",
          [
            { id: "first", label: "1st" },
            { id: "second", label: "2nd" },
            { id: "third", label: "3rd" },
            { id: "fourth", label: "4th" },
          ],
          [
            {
              id: "bc",
              text: "Business Case",
              target: "first",
              explanation: "First: it provides the strategic and economic justification.",
            },
            {
              id: "sow",
              text: "Statement of Work",
              target: "second",
              explanation: "Second: it describes what needs to be delivered.",
            },
            {
              id: "charter",
              text: "Project Charter",
              target: "third",
              explanation: "Third: it authorizes the project and gives the project manager authority.",
            },
            {
              id: "planning",
              text: "Detailed planning documents",
              target: "fourth",
              explanation: "Fourth: scope statement, WBS, schedule, resources, costs and risk planning follow authorization.",
            },
          ],
          "The simple flow is: Business Case → Statement of Work → Project Charter → Planning."
        ),
        {
          id: "q2",
          type: "cloze",
          prompt:
            "Document flow memory check: the Business Case provides {{b1}}, the Statement of Work describes {{b2}}, and the Project Charter gives formal {{b3}}.",
          blanks: {
            b1: ["justification", "strategic justification", "business justification"],
            b2: ["what needs to be done", "what needs to be delivered", "the expected output", "deliverables"],
            b3: ["authorization", "authority", "formal authorization"],
          },
          explanation:
            "Business Case = why. SOW = what. Charter = authorized mandate.",
        },
        {
          id: "q3",
          type: "text",
          prompt: "Which document is the direct input to the Project Charter?",
          answers: [
            "statement of work",
            "sow",
            "the statement of work",
            "the sow",
          ],
          explanation:
            "The Statement of Work logically feeds into the Project Charter.",
        },
        {
          id: "q4",
          type: "multi",
          prompt: "Which three foundational elements are normally included in a Statement of Work?",
          options: [
            o("A", "Scope description", true,
              "Correct. The SOW explains what is to be produced."),
            o("B", "Deliverables", true,
              "Correct. The SOW lists tangible outputs such as reports, prototypes, software features or training materials."),
            o("C", "Timeline or high-level schedule", true,
              "Correct. It may include expected start/end points or milestones."),
            o("D", "Final lessons learned", false,
              "Incorrect. Lessons learned are collected during or after the project."),
            o("E", "Formal approval signature giving the PM authority", false,
              "Incorrect. Formal authorization belongs to the Project Charter."),
          ],
        },
        {
          id: "q5",
          prompt: "In internal organizational settings, what is the SOW usually used as?",
          options: [
            o("A", "A precursor to the Project Charter.", true,
              "Correct. Internally, the SOW commonly comes before and feeds into the charter."),
            o("B", "The final project closure report.", false,
              "Incorrect. The SOW appears early, before formal planning."),
            o("C", "A replacement for stakeholder alignment.", false,
              "Incorrect. Stakeholder alignment is still required."),
            o("D", "A document created only after the project manager loses authority.", false,
              "Incorrect. The SOW may even be created before the project manager is assigned."),
          ],
        },
        {
          id: "q6",
          type: "recall",
          prompt: "Recall three reasons why the SOW → Charter transition matters.",
          modelAnswer:
            "The SOW → Charter transition prevents ambiguity, supports resource allocation, strengthens governance, and links strategy to execution. It makes deliverables clearer before detailed planning and helps the charter define authority, scope boundaries, milestones and constraints.",
          explanation:
            "Strong answers mention prevention of ambiguity/scope creep, resource allocation, governance/traceability, and linking strategy to execution.",
          allowTypedAnswer: true,
        },
      ],
    },
    {
      id: "charter-components",
      title: "Project Charter Components",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt: "Without looking: list at least six common components of a Project Charter.",
          modelAnswer:
            "Common components include project purpose/background, objectives, success criteria, high-level scope, major deliverables, project sponsor, project manager, major stakeholders, milestones, high-level budget, constraints, assumptions and high-level risks.",
          explanation:
            "The charter is short but important because it defines direction, authority, boundaries and accountability.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "The Project Charter provides formal {{b1}} of the project and outlines its major {{b2}}.",
          blanks: {
            b1: ["authorization", "approval", "formal authorization"],
            b2: ["parameters", "boundaries", "project parameters"],
          },
          explanation:
            "The charter is the formal authorization document and sets the project’s major parameters.",
        },
        {
          id: "q3",
          type: "text",
          prompt: "Which charter section answers the question: “Why does this project exist?”",
          answers: [
            "project purpose",
            "purpose",
            "background",
            "project purpose or background",
            "purpose/background",
          ],
          explanation:
            "The purpose/background section links the project to strategy, operational need or regulatory requirement.",
        },
        {
          id: "q4",
          type: "text",
          prompt: "Which principle should project objectives follow?",
          answers: ["smart", "smart principle", "smart objectives"],
          explanation:
            "Objectives should be SMART: specific, measurable, achievable, relevant and time-bound.",
        },
        {
          id: "q5",
          type: "multi",
          prompt: "Which examples are valid charter-level objectives or success criteria?",
          options: [
            o("A", "Reduce processing time by 30%.", true,
              "Correct. This is measurable."),
            o("B", "Achieve compliance with Safety Directive X by 2027.", true,
              "Correct. This is specific and time-bound."),
            o("C", "Make the system better.", false,
              "Incorrect. This is too vague and not measurable."),
            o("D", "Deliver within the approved budget and quality benchmarks.", true,
              "Correct. Budget and quality can be used as success criteria."),
            o("E", "Improve everything as soon as possible.", false,
              "Incorrect. This lacks specificity, measurement and deadline."),
          ],
        },
        {
          id: "q6",
          prompt: "Why should high-level scope and exclusions appear already in the charter?",
          options: [
            o("A", "To act as an early guardrail against expanding stakeholder expectations.", true,
              "Correct. Scope boundaries help prevent misunderstandings and later scope creep."),
            o("B", "To remove the need for detailed scope planning later.", false,
              "Incorrect. Detailed scope planning still happens later."),
            o("C", "To make the charter as long as possible.", false,
              "Incorrect. The charter is meant to be concise."),
            o("D", "To hide project boundaries from stakeholders.", false,
              "Incorrect. The charter should increase clarity, not hide boundaries."),
          ],
        },
        {
          id: "q7",
          type: "matrix",
          prompt: "Place each charter element into the correct charter component area.",
          rows: [
            { id: "purpose", label: "Purpose / Background" },
            { id: "objectives", label: "Objectives / Success Criteria" },
            { id: "scope", label: "Scope / Deliverables" },
            { id: "authority", label: "Roles / Authority" },
            { id: "control", label: "Milestones / Budget / Constraints" },
          ],
          columns: [
            { id: "example", label: "Example" },
          ],
          items: [
            {
              id: "painpoint",
              text: "Outdated manual berth allocation causes scheduling conflicts",
              row: "purpose",
              column: "example",
              explanation: "A pain point belongs in the purpose/background logic.",
            },
            {
              id: "smart",
              text: "Reduce processing time by 30% by Q4",
              row: "objectives",
              column: "example",
              explanation: "This is a SMART objective/success criterion.",
            },
            {
              id: "prototype",
              text: "Digital platform prototype, excluding full IT deployment",
              row: "scope",
              column: "example",
              explanation: "This defines included and excluded scope.",
            },
            {
              id: "pm",
              text: "Project manager authorized to lead and request resources",
              row: "authority",
              column: "example",
              explanation: "This belongs to roles and formal authority.",
            },
            {
              id: "budget",
              text: "Budget range EUR 2–3 million and fixed regulatory deadline",
              row: "control",
              column: "example",
              explanation: "This belongs to high-level budget and constraints.",
            },
          ],
          explanation:
            "The charter combines purpose, objectives, scope, roles, milestones, budget, constraints, assumptions and risks.",
        },
        {
          id: "q8",
          type: "cloze",
          prompt:
            "The project sponsor provides financial resources, political backing and strategic direction, and also {{b1}} the charter.",
          blanks: {
            b1: ["signs", "approves", "signs or approves"],
          },
          explanation:
            "The sponsor formally authorizes the project by approving/signing the charter.",
        },
      ],
    },
    {
      id: "approval-alignment",
      title: "Approval and Stakeholder Alignment",
      questions: [
        {
          id: "q1",
          type: "cloze",
          prompt:
            "Charter approval normally involves three elements: {{b1}}, {{b2}}, and {{b3}}.",
          blanks: {
            b1: ["clarity"],
            b2: ["authority"],
            b3: ["commitment"],
          },
          explanation:
            "Approval requires clarity about what will/will not be done, authority for the PM, and commitment of resources and attention.",
        },
        {
          id: "q2",
          type: "text",
          prompt: "What happens to the Project Charter once the sponsor signs it?",
          answers: [
            "the project becomes authorized",
            "it becomes authorized",
            "the project moves from proposal to authorized",
            "proposal to authorized",
            "the project is officially authorized",
          ],
          explanation:
            "Once signed, the project moves from proposal to authorized and later planning gets legitimacy from that moment.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which stakeholders may need to be identified during initiation?",
          options: [
            o("A", "Project sponsor", true,
              "Correct. The sponsor is a major stakeholder."),
            o("B", "Functional managers", true,
              "Correct. They may control resources or departments affected by the project."),
            o("C", "Customers or end users", true,
              "Correct. They may be affected by the result."),
            o("D", "External partners", true,
              "Correct. Partners can influence delivery, governance or adoption."),
            o("E", "Regulatory authorities", true,
              "Correct. Regulators matter especially in compliance-heavy projects."),
            o("F", "Only the project manager and nobody else", false,
              "Incorrect. Stakeholder identification must look beyond the PM."),
          ],
        },
        {
          id: "q4",
          type: "recall",
          prompt: "Recall the three things stakeholder alignment requires.",
          modelAnswer:
            "Stakeholder alignment requires communication, shared expectations and clear boundaries. Stakeholders need to understand the project purpose, outcomes, scope, milestones and risks in the same way.",
          explanation:
            "The core memory hook is: communication → shared expectations → boundaries.",
          allowTypedAnswer: true,
        },
        {
          id: "q5",
          prompt: "Why does approval alone not guarantee stakeholder alignment?",
          options: [
            o("A", "Because expectations may still be unclear or inconsistent.", true,
              "Correct. Projects can fail even with a signed charter if expectations are not managed early."),
            o("B", "Because approval automatically removes all risks.", false,
              "Incorrect. Approval does not remove risks."),
            o("C", "Because stakeholders never matter after approval.", false,
              "Incorrect. Stakeholder support remains important during execution."),
            o("D", "Because the charter should avoid boundaries.", false,
              "Incorrect. Boundaries are necessary to prevent unrealistic expectations."),
          ],
        },
        dnd(
          "q6",
          "Match each stakeholder-alignment technique to its main purpose.",
          [
            { id: "heard", label: "Reduce surprises / feel heard" },
            { id: "validate", label: "Validate expectations" },
            { id: "tailor", label: "Tailor benefits" },
            { id: "trust", label: "Build trust" },
            { id: "realistic", label: "Enable realistic planning" },
          ],
          [
            {
              id: "briefings",
              text: "Pre-approval briefings",
              target: "heard",
              explanation: "Short targeted conversations before finalizing the charter help stakeholders feel heard and reduce surprises.",
            },
            {
              id: "kickoff",
              text: "Structured initiation kick-off dialogues",
              target: "validate",
              explanation: "These meetings present the draft charter, validate expectations and invite clarifying questions.",
            },
            {
              id: "language",
              text: "Frame benefits in stakeholder language",
              target: "tailor",
              explanation: "Operational benefits for operations, compliance benefits for regulators, financial benefits for executives.",
            },
            {
              id: "risk",
              text: "Early risk transparency",
              target: "trust",
              explanation: "Openly discussing risks and limitations increases trust more than promising flawless results.",
            },
            {
              id: "constraints",
              text: "Align on constraints",
              target: "realistic",
              explanation: "Fixed deadlines, budget ceilings or staffing limits must be jointly acknowledged.",
            },
          ],
          "These techniques help stakeholders not only approve the charter but also support execution."
        ),
        {
          id: "q7",
          type: "matrix",
          prompt: "Match the benefit framing to the stakeholder group.",
          rows: [
            { id: "operations", label: "Operations" },
            { id: "regulators", label: "Regulators" },
            { id: "executives", label: "Executives" },
            { id: "public", label: "Public-facing stakeholders" },
          ],
          columns: [
            { id: "benefit", label: "Best benefit language" },
          ],
          items: [
            {
              id: "operational",
              text: "Operational benefits",
              row: "operations",
              column: "benefit",
              explanation: "Operations care about practical efficiency, workflow and service performance.",
            },
            {
              id: "compliance",
              text: "Compliance benefits",
              row: "regulators",
              column: "benefit",
              explanation: "Regulators care about legal, safety and compliance outcomes.",
            },
            {
              id: "financial",
              text: "Financial benefits",
              row: "executives",
              column: "benefit",
              explanation: "Executives often care about investment, cost, return and strategic value.",
            },
            {
              id: "sustainability",
              text: "Sustainability benefits",
              row: "public",
              column: "benefit",
              explanation: "Public-facing stakeholders may care about environmental and social value.",
            },
          ],
          explanation:
            "Alignment improves when benefits are explained in the language of the stakeholder group.",
        },
        {
          id: "q8",
          type: "recall",
          prompt: "Explain why early risk transparency can increase stakeholder trust.",
          modelAnswer:
            "Early risk transparency increases trust because stakeholders see that project leaders understand obstacles and limitations. Openly discussing risks is more credible than promising perfect results, and it prepares stakeholders for realistic planning.",
          explanation:
            "The important reasoning: honesty about obstacles creates credibility and avoids false expectations.",
          allowTypedAnswer: true,
        },
      ],
    },
    {
      id: "integrated-scenario",
      title: "Integrated Scenario Recall",
      questions: [
        {
          id: "q1",
          type: "recall",
          prompt:
            "Scenario: A Baltic Sea cruise port wants to digitalize berth allocation because manual spreadsheets cause delays.\n\nRecall what should appear in the Business Case, SOW and Project Charter for this example.",
          modelAnswer:
            "Business Case: operational delays, cost impact such as EUR 1–2 million per year, benefits like improved throughput, transparency for cruise lines and reduced administrative burden. SOW: deliverable such as a digital berth allocation platform with real-time vessel tracking, scope such as replacing manual spreadsheets and training staff, timeline such as 12 months with pilot testing around month 10. Charter: sponsor such as port operations director, assigned project manager, high-level risks, constraints, success criteria and organizational commitment.",
          explanation:
            "This question forces the full document flow: Business Case = why; SOW = what; Charter = authorized who/how/boundaries.",
          allowTypedAnswer: true,
        },
        {
          id: "q2",
          type: "cloze",
          prompt:
            "After charter approval and stakeholder alignment, the project formally transitions into the {{b1}} phase, where the PM can create the scope statement, WBS, schedules, resource plans, cost estimates and risk strategies.",
          blanks: {
            b1: ["planning", "planning phase"],
          },
          explanation:
            "Approval gives the project manager legitimacy to start detailed planning.",
        },
        {
          id: "q3",
          type: "multi",
          prompt: "Which planning activities become legitimate after the charter is approved?",
          options: [
            o("A", "Creating the scope statement", true,
              "Correct. Scope is developed in more detail during planning."),
            o("B", "Developing the WBS", true,
              "Correct. The WBS breaks down project deliverables."),
            o("C", "Building schedules", true,
              "Correct. Schedule planning follows authorization."),
            o("D", "Planning resources", true,
              "Correct. Resource planning becomes legitimate after authorization."),
            o("E", "Estimating costs", true,
              "Correct. Cost planning follows from the authorized project."),
            o("F", "Ignoring constraints because the project is approved", false,
              "Incorrect. Constraints must be acknowledged and planned around."),
          ],
        },
        {
          id: "q4",
          type: "text",
          prompt: "Which document empowers the project manager to apply organizational resources?",
          answers: [
            "project charter",
            "charter",
            "the project charter",
          ],
          explanation:
            "The Project Charter formally authorizes the project and gives the project manager authority to use resources.",
        },
        {
          id: "q5",
          type: "recall",
          prompt:
            "Final memory check: summarize the whole initiation logic in one chain, from idea to planning.",
          modelAnswer:
            "An organization first uses a Business Case to justify why the project is worth doing. The Statement of Work then describes what product, service or result should be delivered, including high-level scope, deliverables and timeline. The Project Charter converts this into an authorized mandate by defining purpose, objectives, scope boundaries, roles, milestones, budget, constraints, assumptions and risks. Once the sponsor approves it and stakeholders are aligned, the project can enter detailed planning.",
          explanation:
            "Best compact chain: Business Case → SOW → Project Charter → Approval/Alignment → Planning.",
          allowTypedAnswer: true,
        },
      ],
    },
  ],
};

export default quizPart3;