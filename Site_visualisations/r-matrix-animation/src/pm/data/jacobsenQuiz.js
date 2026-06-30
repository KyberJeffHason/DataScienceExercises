// ─────────────────────────────────────────────────────────────────────────────
// "Jacobsen's Quizz" — Project Management
// 10 thematic sections, 100 questions. Every option carries an explanation:
// the correct one explains WHY it is right, each wrong one explains WHY it is wrong.
//
// Data shape (consumed by the quiz engine):
//   quiz.sections[].questions[].options[] = { id, text, correct, explanation }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Small helper so the data below stays compact and readable.
 * @param {string} id      Option letter (A/B/C/D)
 * @param {string} text    Option text
 * @param {boolean} correct
 * @param {string} explanation  Why this option is right / wrong
 */
const o = (id, text, correct, explanation) => ({ id, text, correct, explanation });

export const jacobsenQuiz = {
  id: "jacobsen",
  title: "Jacobsen's Quizz",
  subtitle: "Project Management — full exam repetition (10 topics · 100 questions)",
  description:
    "A complete project-management revision quiz covering management basics, the PMBOK Guide, " +
    "charters, scope, scheduling, earned value, Agile, SCRUM and hybrid delivery. " +
    "Every answer option includes an explanation so you learn from both right and wrong choices.",
  sections: [
    // ── 1 ──────────────────────────────────────────────────────────────────────
    {
      id: "s1",
      title: "Management and Project Basics",
      questions: [
        {
          id: "q1",
          prompt: "Which of the following best describes the main purpose of management?",
          options: [
            o("A", "To maximise profits by any means possible", false,
              "Profit may be a goal, but 'by any means possible' ignores ethics, people and sustainability — not what management is."),
            o("B", "To plan, organise, lead, and control resources to achieve goals efficiently and effectively", true,
              "These are the four classic functions of management — coordinating resources toward goals efficiently (right things cheaply) and effectively (right results)."),
            o("C", "To control employees and enforce company policies", false,
              "Controlling and policy are only one slice; management is much broader than policing staff."),
            o("D", "To ensure all operations follow fixed procedures regardless of outcomes", false,
              "Blindly following procedures ignores effectiveness — management exists to achieve outcomes, not just process compliance."),
          ],
        },
        {
          id: "q2",
          prompt: "According to classical management theory (Fayol), which is NOT one of the four core functions of management?",
          options: [
            o("A", "Planning", false, "Planning is one of Fayol's core functions."),
            o("B", "Leading", false, "Leading is one of Fayol's core functions."),
            o("C", "Controlling", false, "Controlling is one of Fayol's core functions."),
            o("D", "Marketing", true,
              "Marketing is a business function, not one of the four management functions (plan, organise, lead, control)."),
          ],
        },
        {
          id: "q3",
          prompt: "Which statement correctly describes the role of middle management?",
          options: [
            o("A", "They set the overall organisational strategy and mission.", false,
              "Setting overall strategy and mission is top management's job."),
            o("B", "They translate top management's strategy into departmental goals and coordinate activities.", true,
              "Middle managers are the bridge: they convert strategy into concrete departmental goals and coordinate execution."),
            o("C", "They focus only on daily operational tasks.", false,
              "Daily operational supervision is mostly front-line / first-line management."),
            o("D", "They mainly supervise front-line staff directly.", false,
              "Direct supervision of front-line staff is first-line management, not middle management's core role."),
          ],
        },
        {
          id: "q4",
          prompt: "Which element is essential for work to qualify as a project under the PMI definition?",
          options: [
            o("A", "It must be carried out by a large organisation.", false,
              "Project size and organisation size are unrelated — small teams run projects too."),
            o("B", "It must use advanced technology.", false,
              "Technology level is irrelevant to whether work is a project."),
            o("C", "It must be a temporary endeavour creating a unique product, service, or result.", true,
              "PMI defines a project by exactly these traits: temporary (clear start/end) and producing a unique deliverable."),
            o("D", "It must produce the same outcome repeatedly.", false,
              "Repeating the same outcome is an ongoing process/operation, the opposite of a unique project."),
          ],
        },
        {
          id: "q5",
          prompt: "Which best illustrates a temporary project rather than an ongoing process?",
          options: [
            o("A", "Running daily housekeeping services in a hotel.", false,
              "Daily, repeated housekeeping is ongoing operations, not a temporary project."),
            o("B", "Developing and launching a new digital booking app for a hotel chain.", true,
              "It has a defined start and end and creates a unique deliverable — the hallmark of a project."),
            o("C", "Operating weekly ferry connections between two ports.", false,
              "Repeating weekly service is a continuous operation."),
            o("D", "Issuing monthly financial statements.", false,
              "A recurring monthly task is a routine process, not a one-off project."),
          ],
        },
        {
          id: "q6",
          prompt: "What is the main difference between a project and a process?",
          options: [
            o("A", "Projects create change, while processes maintain ongoing operations.", true,
              "Projects deliver unique change/outcomes; processes keep steady-state operations running."),
            o("B", "Projects are cheaper than processes.", false,
              "Cost has nothing to do with the project-vs-process distinction."),
            o("C", "Processes are always shorter than projects.", false,
              "Processes are typically ongoing and can outlast any single project."),
            o("D", "Projects never repeat, while processes never involve people.", false,
              "Processes obviously involve people — this statement is simply false."),
          ],
        },
        {
          id: "q7",
          prompt: "Why is uniqueness considered a defining characteristic of a project?",
          options: [
            o("A", "Because every project must involve a new team.", false,
              "Teams can be reused across projects; uniqueness is about the output, not the people."),
            o("B", "Because each project has distinct goals, conditions, and outputs, even if similar projects exist.", true,
              "Even lookalike projects differ in context, constraints and deliverables — that distinctness is uniqueness."),
            o("C", "Because projects can only happen once in a lifetime.", false,
              "Similar projects recur often; uniqueness doesn't mean once-in-a-lifetime."),
            o("D", "Because uniqueness ensures no risks or uncertainties.", false,
              "Uniqueness actually increases uncertainty rather than removing it."),
          ],
        },
        {
          id: "q8",
          prompt: "Which of the following is NOT a typical benefit of project management?",
          options: [
            o("A", "Clear direction and goals", false, "Clarity of direction is a genuine benefit of PM."),
            o("B", "Improved communication", false, "Better communication is a genuine benefit of PM."),
            o("C", "Better coordination of resources", false, "Improved resource coordination is a genuine benefit of PM."),
            o("D", "Guarantee of success for every project", true,
              "No methodology can guarantee success — PM improves odds, it does not promise them."),
          ],
        },
        {
          id: "q9",
          prompt: "According to the videos, which issue most often leads to project failure?",
          options: [
            o("A", "Too much documentation", false,
              "Excess documentation can be wasteful but is rarely the primary failure cause."),
            o("B", "Unclear objectives and poor communication", true,
              "Vague goals plus weak communication are the most common root causes of project failure."),
            o("C", "Overqualified team members", false,
              "Strong team members are an asset, not a typical failure driver."),
            o("D", "Use of the Waterfall method instead of Agile", false,
              "Method choice alone doesn't cause failure; misfit and poor communication do."),
          ],
        },
        {
          id: "q10",
          prompt: "Why is the project manager's role often described as both an art and a science?",
          options: [
            o("A", "Because it involves only creative intuition.", false,
              "'Only' intuition ignores the analytical/science side."),
            o("B", "Because it requires both analytical tools and interpersonal leadership skills.", true,
              "Science = tools, data, planning; art = leadership, communication, judgement. PM needs both."),
            o("C", "Because it is unpredictable and random.", false,
              "PM is not random — it uses structured methods alongside soft skills."),
            o("D", "Because it changes completely in every organisation.", false,
              "Core PM principles are transferable; context tailoring isn't the art/science point."),
          ],
        },
      ],
    },

    // ── 2 ──────────────────────────────────────────────────────────────────────
    {
      id: "s2",
      title: "PMBOK Guide, Lifecycle and Process Groups",
      questions: [
        {
          id: "q1",
          prompt: "Which statement best describes the role of the PMBOK Guide?",
          options: [
            o("A", "It prescribes one mandatory method for conducting all projects.", false,
              "PMBOK is descriptive guidance, not a single mandatory method."),
            o("B", "It defines universally applicable best practices and concepts for project management.", true,
              "PMBOK is a body of generally accepted good practices to tailor per project."),
            o("C", "It provides only templates and checklists for project documentation.", false,
              "It contains concepts and practices, far more than just templates."),
            o("D", "It focuses exclusively on agile project management.", false,
              "PMBOK covers predictive, agile and hybrid — not agile only."),
          ],
        },
        {
          id: "q2",
          prompt: "Which combination best describes the four core project success criteria (PMI)?",
          options: [
            o("A", "Time, cost, quality, stakeholder satisfaction", true,
              "The classic success criteria: on time, on budget, to quality, with satisfied stakeholders."),
            o("B", "Scope, budget, documentation, teamwork", false,
              "Documentation and teamwork are means, not the core success criteria."),
            o("C", "Innovation, sustainability, motivation, cost", false,
              "These are desirable traits but not the four standard success criteria."),
            o("D", "Profitability, customer loyalty, satisfaction, skills", false,
              "These are business outcomes, not the standard project success criteria set."),
          ],
        },
        {
          id: "q3",
          prompt: "Which project lifecycle phase focuses on refining requirements, planning activities, and determining resources?",
          options: [
            o("A", "Initiation", false, "Initiation authorises the project; detailed planning comes after."),
            o("B", "Planning", true,
              "Planning is where requirements are refined and activities, schedule and resources are determined."),
            o("C", "Execution", false, "Execution carries out the plan; it doesn't define it."),
            o("D", "Closing", false, "Closing finalises and hands over; no resource planning happens there."),
          ],
        },
        {
          id: "q4",
          prompt: "Which statement correctly distinguishes lifecycle phases from process groups?",
          options: [
            o("A", "Lifecycle phases are mandatory, while process groups are optional.", false,
              "Neither is simply optional; the distinction is about 'when' vs 'what kind of work'."),
            o("B", "Lifecycle phases describe 'what happens when'; process groups describe 'what kind of work is performed'.", true,
              "Phases = chronological stages; process groups = categories of work that recur within each phase."),
            o("C", "Process groups occur once; lifecycle phases repeat multiple times.", false,
              "It's the reverse — process groups recur within/across phases."),
            o("D", "Lifecycle phases apply only to agile approaches.", false,
              "Lifecycle phases apply to predictive projects too."),
          ],
        },
        {
          id: "q5",
          prompt: "Which process group coordinates people and resources to carry out the project plan?",
          options: [
            o("A", "Initiating", false, "Initiating authorises the project, it doesn't carry out the plan."),
            o("B", "Planning", false, "Planning produces the plan; it doesn't execute it."),
            o("C", "Executing", true,
              "Executing is where people and resources are coordinated to do the planned work."),
            o("D", "Monitoring & Controlling", false,
              "Monitoring & Controlling tracks and corrects; it doesn't perform the work."),
          ],
        },
        {
          id: "q6",
          prompt: "Which knowledge area provides tools for identifying, analysing, and responding to uncertainty?",
          options: [
            o("A", "Scope Management", false, "Scope manages what's in/out, not uncertainty."),
            o("B", "Risk Management", true,
              "Risk Management is exactly about identifying, analysing and responding to uncertainty."),
            o("C", "Communication Management", false, "Communication handles information flow, not risk analysis."),
            o("D", "Procurement Management", false, "Procurement handles contracts and buying, not uncertainty broadly."),
          ],
        },
        {
          id: "q7",
          prompt: "Which statement about the Monitoring & Controlling Process Group is most accurate?",
          options: [
            o("A", "It is used only during the closing phase.", false,
              "It runs throughout the project, not just at closing."),
            o("B", "It is the exclusive responsibility of the project sponsor.", false,
              "The project manager and team perform monitoring; not just the sponsor."),
            o("C", "It checks progress and deviations so corrective actions can be taken.", true,
              "Its purpose is to compare actual vs plan and trigger corrective/preventive action."),
            o("D", "It replaces the need for a project plan.", false,
              "It depends on the plan as the baseline to measure against."),
          ],
        },
        {
          id: "q8",
          prompt: "Which is NOT a typical activity in the Closing phase?",
          options: [
            o("A", "Verifying deliverables", false, "Verifying deliverables is a normal closing activity."),
            o("B", "Releasing resources", false, "Releasing resources is a normal closing activity."),
            o("C", "Approving the final project report", false, "Approving the final report is a normal closing activity."),
            o("D", "Defining requirements", true,
              "Defining requirements happens in planning, not closing."),
          ],
        },
        {
          id: "q9",
          prompt: "Which knowledge area is most directly concerned with defining and controlling what is and is not included in the project?",
          options: [
            o("A", "Quality Management", false, "Quality is about meeting standards, not in/out boundaries."),
            o("B", "Scope Management", true,
              "Scope Management defines and controls exactly what is and isn't part of the project."),
            o("C", "Integration Management", false, "Integration coordinates across areas, not boundary definition specifically."),
            o("D", "Resource Management", false, "Resource Management handles people/material, not scope boundaries."),
          ],
        },
        {
          id: "q10",
          prompt: "Why does Integration Management hold a central role in the PMBOK framework?",
          options: [
            o("A", "It ensures that each knowledge area works independently.", false,
              "Integration does the opposite — it links areas together."),
            o("B", "It coordinates the interdependencies between processes so the project functions as a unified whole.", true,
              "Integration ties all knowledge areas and processes together into one coherent project."),
            o("C", "It replaces the need for other knowledge areas.", false,
              "It coordinates the others; it doesn't replace them."),
            o("D", "It applies only to very large projects.", false,
              "Integration applies to projects of all sizes."),
          ],
        },
      ],
    },

    // ── 3 ──────────────────────────────────────────────────────────────────────
    {
      id: "s3",
      title: "Business Case, SOW and Project Charter",
      questions: [
        {
          id: "q1",
          prompt: "Which statement best describes the primary purpose of a business case?",
          options: [
            o("A", "To provide a detailed work breakdown structure.", false,
              "A WBS comes later in planning; the business case is a justification document."),
            o("B", "To justify why a project should be undertaken by documenting expected benefits, costs, and options.", true,
              "The business case answers 'why do this?' via benefits, costs and options analysis."),
            o("C", "To assign day-to-day tasks to team members.", false,
              "Task assignment is execution, not the business case."),
            o("D", "To list all project stakeholders and their contact details.", false,
              "That's a stakeholder register, not a business case."),
          ],
        },
        {
          id: "q2",
          prompt: "Which element is typically NOT part of a business case?",
          options: [
            o("A", "Options analysis (including 'do nothing')", false, "Options analysis is a standard business-case element."),
            o("B", "Expected benefits and strategic alignment", false, "Benefits and strategic fit are core to a business case."),
            o("C", "Detailed task-level schedule (Work Breakdown Structure)", true,
              "A detailed WBS is a planning artefact, too granular for a business case."),
            o("D", "High-level cost estimates and risks", false, "High-level costs and risks belong in the business case."),
          ],
        },
        {
          id: "q3",
          prompt: "The Statement of Work (SOW) primarily documents:",
          options: [
            o("A", "The project budget approvals and sponsor signatures.", false,
              "Approvals/authority sit in the charter, not the SOW."),
            o("B", "The high-level description of what will be delivered (scope, deliverables, and high-level timeline).", true,
              "The SOW narratively describes the work, deliverables and high-level timing."),
            o("C", "The project manager's weekly status reports.", false,
              "Status reports are execution artefacts, not the SOW."),
            o("D", "The detailed quality control checklists.", false,
              "QC checklists are quality artefacts, not the SOW."),
          ],
        },
        {
          id: "q4",
          prompt: "How does the project charter differ from the SOW?",
          options: [
            o("A", "The charter describes technical specifications, while the SOW gives strategic justification.", false,
              "Reversed and inaccurate — neither is mainly tech specs."),
            o("B", "The charter is produced after project closure; the SOW is produced before initiation.", false,
              "The charter is produced at initiation, not after closure."),
            o("C", "The SOW describes what will be delivered; the charter formally authorises the project and grants the PM authority.", true,
              "SOW = the work description; charter = formal authorisation plus PM authority."),
            o("D", "The charter is confidential, while the SOW is always public.", false,
              "Confidentiality isn't the distinguishing factor."),
          ],
        },
        {
          id: "q5",
          prompt: "Which is a standard component of a project charter?",
          options: [
            o("A", "Detailed supplier contracts and purchase orders.", false,
              "Contracts/POs are procurement documents, not charter components."),
            o("B", "Minute-by-minute schedule for daily tasks.", false,
              "Detailed scheduling is planning, far too granular for a charter."),
            o("C", "Project objectives and high-level success criteria.", true,
              "Objectives and high-level success criteria are core charter content."),
            o("D", "Complete training manuals for end users.", false,
              "Training manuals are deliverables, not charter components."),
          ],
        },
        {
          id: "q6",
          prompt: "A SMART objective in a project charter should be:",
          options: [
            o("A", "Subjective, mysterious, abstract, reactive, and timeless.", false, "These are the opposite of SMART."),
            o("B", "Specific, Measurable, Achievable, Relevant, and Time-bound.", true,
              "SMART = Specific, Measurable, Achievable, Relevant, Time-bound."),
            o("C", "Simple, Minimal, Ambiguous, Repetitive, and Trendy.", false, "Not the SMART acronym."),
            o("D", "Strategic, Managerial, Administrative, Risk-free, and Timeless.", false, "Not the SMART acronym."),
          ],
        },
        {
          id: "q7",
          prompt: "Which is an example of a constraint that should be recorded in the charter?",
          options: [
            o("A", "Suggested logo colours for project slides.", false, "Cosmetic preferences aren't constraints."),
            o("B", "A list of optional stretch goals the team may ignore.", false, "Optional goals aren't binding constraints."),
            o("C", "A fixed regulatory deadline that cannot be moved.", true,
              "An immovable legal deadline is a hard constraint limiting the project."),
            o("D", "The preferred brand of coffee in the project office.", false, "Irrelevant to project constraints."),
          ],
        },
        {
          id: "q8",
          prompt: "Which activity best secures stakeholder alignment before requesting formal charter approval?",
          options: [
            o("A", "Writing the final project closure report in advance.", false,
              "Closure reports come at the end, not before charter approval."),
            o("B", "Publishing the charter on the company website without review.", false,
              "Publishing without review risks misalignment, not alignment."),
            o("C", "Conducting pre-approval briefings with key stakeholders to surface concerns and align expectations.", true,
              "Briefing stakeholders early surfaces concerns and aligns expectations before approval."),
            o("D", "Waiting until after approval to identify stakeholders.", false,
              "Identifying stakeholders late undermines alignment."),
          ],
        },
        {
          id: "q9",
          prompt: "Who usually signs the project charter to authorise the project?",
          options: [
            o("A", "The most junior team member assigned to the project.", false, "Juniors lack the authority to authorise."),
            o("B", "The external vendor representative with the largest invoice.", false, "Vendors don't authorise the project."),
            o("C", "The project sponsor (senior manager or executive who provides funding/authority).", true,
              "The sponsor holds the funding and authority, so the sponsor signs the charter."),
            o("D", "The HR manager only.", false, "HR doesn't authorise projects."),
          ],
        },
        {
          id: "q10",
          prompt: "Why should the business case be revisited during the project lifecycle?",
          options: [
            o("A", "To lengthen the list of deliverables for the final report.", false,
              "Padding deliverables isn't the reason to revisit."),
            o("B", "To replace the project manager mid-project automatically.", false,
              "The business case isn't a tool for replacing the PM."),
            o("C", "To confirm the project still delivers expected benefits when scope, costs or context change.", true,
              "Revisiting checks the project remains worthwhile as conditions change."),
            o("D", "To increase project complexity and add more stakeholders.", false,
              "Adding complexity isn't the purpose of revisiting."),
          ],
        },
      ],
    },

    // ── 4 ──────────────────────────────────────────────────────────────────────
    {
      id: "s4",
      title: "Requirements, Scope and WBS",
      questions: [
        {
          id: "q1",
          prompt: "What is the primary purpose of collecting project requirements?",
          options: [
            o("A", "To estimate the project budget.", false, "Budgeting uses requirements but isn't their primary purpose."),
            o("B", "To define what stakeholders need and expect from the project.", true,
              "Requirements capture stakeholder needs/expectations — the basis for scope."),
            o("C", "To assign tasks to the project team.", false, "Task assignment is execution, not requirement collection."),
            o("D", "To identify project risks.", false, "Risk identification is separate from collecting requirements."),
          ],
        },
        {
          id: "q2",
          prompt: "Which is an example of a non-functional requirement?",
          options: [
            o("A", "The system must provide real-time passenger information.", false,
              "That's a function the system performs — functional."),
            o("B", "The project must deliver a staff training workshop.", false,
              "That's a deliverable/functional activity, not a quality attribute."),
            o("C", "The solution must comply with EU environmental regulations.", true,
              "Compliance/quality constraints (how well, under what rules) are non-functional requirements."),
            o("D", "The project must install new waste bins.", false,
              "Installing bins is a concrete functional deliverable."),
          ],
        },
        {
          id: "q3",
          prompt: "Which technique is MOST appropriate for collecting requirements directly from multiple stakeholders?",
          options: [
            o("A", "Work Breakdown Structure.", false, "A WBS decomposes work; it doesn't gather requirements."),
            o("B", "Stakeholder register.", false, "A register lists stakeholders; it doesn't collect their needs."),
            o("C", "Interviews and workshops.", true,
              "Interviews and workshops engage stakeholders directly to elicit requirements."),
            o("D", "Earned value analysis.", false, "EVA measures performance, not requirements."),
          ],
        },
        {
          id: "q4",
          prompt: "What is the main purpose of a project scope statement?",
          options: [
            o("A", "To list all project risks.", false, "Risks live in a risk register, not the scope statement."),
            o("B", "To define what is included and excluded from the project.", true,
              "The scope statement sets boundaries: what's in and what's out."),
            o("C", "To describe the project schedule.", false, "The schedule is a separate artefact."),
            o("D", "To approve the project budget.", false, "Budget approval isn't the scope statement's role."),
          ],
        },
        {
          id: "q5",
          prompt: "Which element is typically included in a project scope statement?",
          options: [
            o("A", "Communication plan.", false, "Comms planning is a separate document."),
            o("B", "Project exclusions.", true,
              "Stating exclusions (what's out of scope) is a key scope-statement element."),
            o("C", "Cost baseline.", false, "The cost baseline belongs to cost management."),
            o("D", "Stakeholder engagement strategy.", false, "Engagement strategy is a separate plan."),
          ],
        },
        {
          id: "q6",
          prompt: "What is the defining characteristic of a Work Breakdown Structure (WBS)?",
          options: [
            o("A", "It is an activity-based schedule.", false, "A WBS is deliverable-based, not a schedule of activities."),
            o("B", "It organises work by deliverables in a hierarchical structure.", true,
              "A WBS hierarchically decomposes the project into deliverables/work packages."),
            o("C", "It assigns responsibilities to team members.", false, "Responsibility assignment is a RACI/RAM, not the WBS."),
            o("D", "It lists project risks in order of priority.", false, "Risk prioritisation isn't a WBS function."),
          ],
        },
        {
          id: "q7",
          prompt: "Which of the following is a correct WBS element?",
          options: [
            o("A", "Conduct stakeholder interviews.", false, "This is an activity (a verb phrase), not a deliverable."),
            o("B", "Improve customer satisfaction.", false, "This is an outcome/goal, not a deliverable."),
            o("C", "Waste separation infrastructure.", true,
              "A WBS element is a noun-based deliverable — 'waste separation infrastructure' qualifies."),
            o("D", "Reduce boarding time.", false, "This is an objective, not a deliverable."),
          ],
        },
        {
          id: "q8",
          prompt: "Which situation BEST illustrates scope creep?",
          options: [
            o("A", "A formally approved change that extends the project timeline.", false,
              "An approved change is controlled change, not scope creep."),
            o("B", "A stakeholder request that is documented and evaluated.", false,
              "Documented and evaluated requests follow change control — not creep."),
            o("C", "A team member adds extra features without approval.", true,
              "Uncontrolled, unapproved additions are the definition of scope creep."),
            o("D", "A risk response plan is updated.", false,
              "Updating risk responses is normal management, not scope creep."),
          ],
        },
        {
          id: "q9",
          prompt: "What is the MOST effective way to prevent scope creep?",
          options: [
            o("A", "Ignoring small change requests.", false, "Ignoring requests breeds uncontrolled change, not control."),
            o("B", "Writing a detailed scope statement and using formal change control.", true,
              "Clear scope plus formal change control is the proven defence against creep."),
            o("C", "Increasing the project budget.", false, "More money doesn't stop uncontrolled scope changes."),
            o("D", "Avoiding stakeholder communication.", false, "Less communication increases misunderstanding and creep."),
          ],
        },
        {
          id: "q10",
          prompt: "When a new requirement is requested during execution, what should the PM do FIRST?",
          options: [
            o("A", "Immediately implement the change.", false, "Implementing before assessing impact is uncontrolled change."),
            o("B", "Reject the request.", false, "Outright rejection skips proper evaluation."),
            o("C", "Document and analyse the impact of the change.", true,
              "Change control starts with documenting and assessing impact before any decision."),
            o("D", "Update the project schedule.", false, "Schedule updates come only after the change is assessed/approved."),
          ],
        },
      ],
    },

    // ── 5 ──────────────────────────────────────────────────────────────────────
    {
      id: "s5",
      title: "Activities, Dependencies and Scheduling",
      questions: [
        {
          id: "q1",
          prompt: "What is the primary purpose of the Define Activities process?",
          options: [
            o("A", "To assign team members to tasks.", false, "Assignment comes later; first you define the activities."),
            o("B", "To identify the specific actions required to produce project deliverables.", true,
              "Define Activities breaks work packages into the concrete actions needed to deliver them."),
            o("C", "To estimate the project budget.", false, "Budgeting is cost management, not Define Activities."),
            o("D", "To monitor progress against the schedule.", false, "Monitoring is a controlling process, not Define Activities."),
          ],
        },
        {
          id: "q2",
          prompt: "Which input is MOST important when defining project activities?",
          options: [
            o("A", "Stakeholder register.", false, "Useful elsewhere, but not the key input for activities."),
            o("B", "Project charter.", false, "The charter is high-level; activities derive from the WBS."),
            o("C", "Work Breakdown Structure (WBS).", true,
              "Activities are decomposed from the WBS work packages — it's the key input."),
            o("D", "Risk register.", false, "Risks inform planning but aren't the basis for defining activities."),
          ],
        },
        {
          id: "q3",
          prompt: "Which dependency type reflects a technical or logical necessity?",
          options: [
            o("A", "Discretionary dependency.", false, "Discretionary = preferred best practice, not a necessity."),
            o("B", "External dependency.", false, "External = outside the project's control, not a logical necessity."),
            o("C", "Mandatory dependency.", true,
              "Mandatory (hard logic) dependencies are physically/technically required — e.g. build walls before roof."),
            o("D", "Preferential dependency.", false, "Preferential is another name for discretionary — a preference, not a must."),
          ],
        },
        {
          id: "q4",
          prompt: "In a Finish-to-Start (FS) relationship, what does it mean?",
          options: [
            o("A", "Two activities start at the same time.", false, "That's Start-to-Start (SS)."),
            o("B", "One activity must finish before the next can start.", true,
              "FS: the predecessor must finish before the successor can start — the most common relationship."),
            o("C", "One activity must finish before the next can finish.", false, "That's Finish-to-Finish (FF)."),
            o("D", "Two activities finish at the same time.", false, "That describes Finish-to-Finish, not FS."),
          ],
        },
        {
          id: "q5",
          prompt: "Which estimation technique uses expert judgment and historical data from similar projects?",
          options: [
            o("A", "Bottom-up estimating.", false, "Bottom-up sums detailed component estimates, not analogies."),
            o("B", "Parametric estimating.", false, "Parametric uses statistical unit rates, not similar-project analogy."),
            o("C", "Analogous estimating.", true,
              "Analogous estimating leans on expert judgement and data from similar past projects."),
            o("D", "Three-point estimating.", false, "Three-point uses optimistic/likely/pessimistic values."),
          ],
        },
        {
          id: "q6",
          prompt: "What is the main difference between effort and duration?",
          options: [
            o("A", "Effort includes weekends; duration does not.", false, "Inaccurate distinction."),
            o("B", "Duration refers to calendar time, effort refers to work required.", true,
              "Duration = elapsed calendar time; effort = person-hours of work needed."),
            o("C", "Duration is estimated before effort.", false, "Order isn't the defining difference."),
            o("D", "Effort includes buffers; duration does not.", false, "Buffers aren't what separates effort from duration."),
          ],
        },
        {
          id: "q7",
          prompt: "What is the primary purpose of a Gantt chart?",
          options: [
            o("A", "To identify project risks.", false, "Gantt charts show schedule, not risks."),
            o("B", "To visualise task dependencies only.", false, "Dependencies are part of it, but not the only purpose."),
            o("C", "To show activities, durations, and sequencing over time.", true,
              "A Gantt chart visualises activities, their durations and sequence on a timeline."),
            o("D", "To allocate costs to work packages.", false, "Cost allocation is a budgeting task, not a Gantt's purpose."),
          ],
        },
        {
          id: "q8",
          prompt: "Which activity is MOST likely to be on the critical path?",
          options: [
            o("A", "An activity with the most resources assigned.", false, "Resource count doesn't define the critical path."),
            o("B", "An activity with the longest duration.", false, "Longest single duration isn't the same as zero float."),
            o("C", "An activity with zero total float.", true,
              "Critical-path activities have zero total float — any delay delays the project."),
            o("D", "An activity performed by external suppliers.", false, "Being external doesn't put it on the critical path."),
          ],
        },
        {
          id: "q9",
          prompt: "What is a common risk when estimating activity durations too early?",
          options: [
            o("A", "Over-documentation.", false, "Documentation volume isn't the estimation risk here."),
            o("B", "Excessive use of buffers.", false, "Early estimates tend to be uncertain, not over-buffered."),
            o("C", "False precision and unrealistic commitments.", true,
              "Estimating too early gives a false sense of precision and locks in unrealistic commitments."),
            o("D", "Underuse of software tools.", false, "Tool usage isn't the core early-estimation risk."),
          ],
        },
        {
          id: "q10",
          prompt: "Which tool is MOST useful for identifying schedule logic and dependencies (PMI)?",
          options: [
            o("A", "Stakeholder matrix.", false, "A stakeholder matrix maps people, not schedule logic."),
            o("B", "Network diagram.", true,
              "A network diagram visually maps activity sequence and dependencies — schedule logic."),
            o("C", "Cost baseline.", false, "The cost baseline tracks budget, not dependencies."),
            o("D", "Responsibility assignment matrix (RACI).", false, "RACI maps responsibility, not schedule logic."),
          ],
        },
      ],
    },

    // ── 6 ──────────────────────────────────────────────────────────────────────
    {
      id: "s6",
      title: "Cost Estimation and Earned Value Management",
      questions: [
        {
          id: "q1",
          prompt: "Which best describes cost estimation in project management?",
          options: [
            o("A", "Assigning financial responsibility to stakeholders.", false, "That's accountability, not estimation."),
            o("B", "Predicting the monetary resources needed to complete project activities.", true,
              "Cost estimation forecasts the money required to complete the work."),
            o("C", "Tracking project expenses after completion.", false, "Tracking spend is cost control, not estimation."),
            o("D", "Allocating contingency reserves.", false, "Reserve allocation is one step, not the definition."),
          ],
        },
        {
          id: "q2",
          prompt: "Which cost estimation technique uses historical data from similar past projects?",
          options: [
            o("A", "Bottom-up estimating.", false, "Bottom-up aggregates detailed components."),
            o("B", "Three-point estimating.", false, "Three-point averages optimistic/likely/pessimistic values."),
            o("C", "Analogous estimating.", true,
              "Analogous estimating uses actual data from similar previous projects."),
            o("D", "Parametric estimating.", false, "Parametric scales a unit cost by a variable."),
          ],
        },
        {
          id: "q3",
          prompt: "Which estimation technique is most accurate but also most time-consuming?",
          options: [
            o("A", "Analogous estimating.", false, "Analogous is fast but rough, not the most accurate."),
            o("B", "Parametric estimating.", false, "Parametric is quick and moderately accurate."),
            o("C", "Bottom-up estimating.", true,
              "Estimating every component and summing is the most accurate but most effort-intensive method."),
            o("D", "Expert judgment.", false, "Expert judgement is quick but not the most accurate."),
          ],
        },
        {
          id: "q4",
          prompt: "In PMI terminology, a project budget primarily represents:",
          options: [
            o("A", "The expected profit of the project.", false, "Profit isn't the budget."),
            o("B", "The approved time-phased cost baseline.", true,
              "The budget is the approved, time-phased cost baseline used to measure performance."),
            o("C", "The total funding available to the organisation.", false, "Org-wide funding isn't the project budget."),
            o("D", "A list of project expenses without approval.", false, "Unapproved expenses aren't a budget."),
          ],
        },
        {
          id: "q5",
          prompt: "What does Planned Value (PV) represent?",
          options: [
            o("A", "The actual cost incurred for completed work.", false, "That's Actual Cost (AC)."),
            o("B", "The value of work actually completed.", false, "That's Earned Value (EV)."),
            o("C", "The budgeted cost of work scheduled at a given time.", true,
              "PV = the budgeted cost of work scheduled to be done by a point in time."),
            o("D", "The remaining budget at project completion.", false, "That's not PV."),
          ],
        },
        {
          id: "q6",
          prompt: "If EV = €80,000 and AC = €100,000, what is the Cost Performance Index (CPI)?",
          options: [
            o("A", "0.8", true,
              "CPI = EV / AC = 80,000 / 100,000 = 0.8 (under-performing on cost)."),
            o("B", "1.25", false, "1.25 would be AC/EV, the inverse — wrong formula."),
            o("C", "1.0", false, "CPI 1.0 means on budget; here it's 0.8."),
            o("D", "-0.2", false, "CPI is a ratio, never negative."),
          ],
        },
        {
          id: "q7",
          prompt: "A CPI greater than 1.0 indicates that a project is:",
          options: [
            o("A", "Behind schedule.", false, "Schedule is measured by SPI, not CPI."),
            o("B", "Over budget.", false, "CPI > 1.0 means the opposite — under budget."),
            o("C", "Under budget.", true,
              "CPI > 1.0 means you earned more value than you spent — under budget / cost-efficient."),
            o("D", "At risk of scope creep.", false, "CPI doesn't measure scope creep."),
          ],
        },
        {
          id: "q8",
          prompt: "What does the Schedule Performance Index (SPI) measure?",
          options: [
            o("A", "Cost efficiency of completed work.", false, "That's CPI."),
            o("B", "Budget variance at completion.", false, "That's VAC, not SPI."),
            o("C", "Schedule efficiency of work performed.", true,
              "SPI = EV / PV measures how efficiently the schedule is being met."),
            o("D", "Total duration of the project.", false, "SPI is a ratio, not a duration."),
          ],
        },
        {
          id: "q9",
          prompt: "If SPI = 0.9, this means the project is:",
          options: [
            o("A", "Ahead of schedule.", false, "Ahead would be SPI > 1.0."),
            o("B", "On schedule.", false, "On schedule would be SPI = 1.0."),
            o("C", "Behind schedule.", true,
              "SPI < 1.0 means less work done than planned — behind schedule."),
            o("D", "Over budget.", false, "Budget is CPI; SPI is about schedule."),
          ],
        },
        {
          id: "q10",
          prompt: "According to PMI, the main purpose of Earned Value Management (EVM) is to:",
          options: [
            o("A", "Replace traditional budgeting techniques.", false, "EVM complements budgeting, not replaces it."),
            o("B", "Integrate scope, schedule, and cost performance.", true,
              "EVM's power is integrating scope, schedule and cost into one performance picture."),
            o("C", "Eliminate the need for forecasts.", false, "EVM actually produces forecasts (EAC, ETC)."),
            o("D", "Justify additional funding requests.", false, "Funding justification isn't EVM's main purpose."),
          ],
        },
      ],
    },

    // ── 7 ──────────────────────────────────────────────────────────────────────
    {
      id: "s7",
      title: "Agile Fundamentals",
      questions: [
        {
          id: "q1",
          prompt: "Which condition most strongly contributed to the emergence of Agile?",
          options: [
            o("A", "Increased regulatory standardisation.", false, "Standardisation favours predictive, not agile."),
            o("B", "Stable customer requirements.", false, "Stable requirements suit Waterfall, not agile."),
            o("C", "High uncertainty and frequent change.", true,
              "Agile arose to cope with volatile requirements and frequent change."),
            o("D", "Improved documentation tools.", false, "Agile de-emphasises heavy documentation."),
          ],
        },
        {
          id: "q2",
          prompt: "The term VUCA describes an environment that is:",
          options: [
            o("A", "Valuable, Usable, Controlled, Audited.", false, "Not the VUCA acronym."),
            o("B", "Volatile, Uncertain, Complex, Ambiguous.", true,
              "VUCA = Volatile, Uncertain, Complex, Ambiguous — the conditions agile addresses."),
            o("C", "Variable, Unified, Coordinated, Aligned.", false, "Not the VUCA acronym."),
            o("D", "Visionary, Unique, Competitive, Agile.", false, "Not the VUCA acronym."),
          ],
        },
        {
          id: "q3",
          prompt: "Which type of project environment is best suited for Agile?",
          options: [
            o("A", "Construction of a standard warehouse.", false, "Well-defined construction suits predictive."),
            o("B", "Projects with fixed scope and technology.", false, "Fixed scope/tech suits Waterfall."),
            o("C", "Digital products with evolving user needs.", true,
              "Evolving requirements and frequent feedback are ideal for agile delivery."),
            o("D", "Projects with strict regulatory approval processes.", false, "Strict upfront approvals favour predictive."),
          ],
        },
        {
          id: "q4",
          prompt: "A key difference between Waterfall and Agile is that Agile:",
          options: [
            o("A", "Eliminates planning altogether.", false, "Agile plans continuously, it doesn't eliminate planning."),
            o("B", "Delivers value incrementally.", true,
              "Agile delivers working increments frequently rather than one big-bang release."),
            o("C", "Requires more documentation upfront.", false, "Agile favours less upfront documentation."),
            o("D", "Avoids stakeholder involvement.", false, "Agile maximises stakeholder involvement."),
          ],
        },
        {
          id: "q5",
          prompt: "Which statement best reflects the Agile mindset?",
          options: [
            o("A", "\u201CFollow the plan strictly to avoid rework.\u201D", false, "Rigid plan-following is the predictive mindset."),
            o("B", "\u201COptimise individual performance over teamwork.\u201D", false, "Agile values teamwork over individual heroics."),
            o("C", "\u201CRespond to change, even late in development.\u201D", true,
              "Welcoming change even late is a core Agile Manifesto value."),
            o("D", "\u201CMinimise customer involvement to reduce complexity.\u201D", false, "Agile maximises customer collaboration."),
          ],
        },
        {
          id: "q6",
          prompt: "In Agile projects, requirements are typically:",
          options: [
            o("A", "Fully defined before project start.", false, "That's predictive, not agile."),
            o("B", "Fixed once approved.", false, "Agile expects requirements to evolve."),
            o("C", "Developed iteratively and refined over time.", true,
              "Agile refines requirements progressively through iterations and feedback."),
            o("D", "Replaced by technical specifications only.", false, "Requirements aren't replaced by tech specs in agile."),
          ],
        },
        {
          id: "q7",
          prompt: "Which leadership behaviour best supports self-organising teams?",
          options: [
            o("A", "Assigning tasks daily to team members.", false, "Daily assignment undermines self-organisation."),
            o("B", "Closely monitoring individual productivity.", false, "Micro-monitoring kills autonomy."),
            o("C", "Removing obstacles and enabling autonomy.", true,
              "Servant leadership clears impediments and empowers the team to self-organise."),
            o("D", "Approving all technical decisions.", false, "Centralising decisions blocks self-organisation."),
          ],
        },
        {
          id: "q8",
          prompt: "Compared to traditional project managers, Agile leaders primarily act as:",
          options: [
            o("A", "Controllers and inspectors.", false, "Command-and-control is the traditional, not agile, style."),
            o("B", "Facilitators and coaches.", true,
              "Agile leaders serve as facilitators/coaches who enable the team."),
            o("C", "Technical experts.", false, "Being the tech expert isn't the agile leadership role."),
            o("D", "Contract administrators.", false, "Contract admin isn't the agile leader's primary role."),
          ],
        },
        {
          id: "q9",
          prompt: "What is a major risk of using Waterfall in a highly uncertain environment?",
          options: [
            o("A", "Excessive stakeholder involvement.", false, "Waterfall typically has less ongoing involvement, not excessive."),
            o("B", "Too many iterations.", false, "Waterfall has few/no iterations by design."),
            o("C", "Delivering solutions that no longer meet user needs.", true,
              "Locking scope early means the late delivery may no longer fit changed needs."),
            o("D", "Lack of documentation.", false, "Waterfall is documentation-heavy, not light."),
          ],
        },
        {
          id: "q10",
          prompt: "Which statement best describes the role of stakeholders in Agile?",
          options: [
            o("A", "Stakeholders are involved mainly at the project start and end.", false, "That's predictive engagement."),
            o("B", "Stakeholders approve all deliverables after completion.", false, "Agile gathers feedback throughout, not just at the end."),
            o("C", "Stakeholders provide continuous feedback throughout the project.", true,
              "Continuous stakeholder feedback each iteration is central to agile."),
            o("D", "Stakeholders focus only on cost and schedule control.", false, "Agile stakeholders focus on value, not just cost/schedule."),
          ],
        },
      ],
    },

    // ── 8 ──────────────────────────────────────────────────────────────────────
    {
      id: "s8",
      title: "SCRUM Framework",
      questions: [
        {
          id: "q1",
          prompt: "What was the original inspiration for the SCRUM framework?",
          options: [
            o("A", "Lean manufacturing systems.", false, "Lean influenced agile broadly but isn't the SCRUM name's origin."),
            o("B", "The rugby concept of a team advancing the ball together.", true,
              "'Scrum' comes from rugby — a team moving the ball forward together as a unit."),
            o("C", "Military command-and-control structures.", false, "SCRUM is the opposite of command-and-control."),
            o("D", "Stage-Gate product development.", false, "Stage-Gate is a phased predictive model, not SCRUM's origin."),
          ],
        },
        {
          id: "q2",
          prompt: "Which statement best describes the role of the Product Owner?",
          options: [
            o("A", "Ensures the team follows SCRUM rules.", false, "That's the Scrum Master's role."),
            o("B", "Writes all technical documentation.", false, "Documentation isn't the PO's defining duty."),
            o("C", "Maximises product value by managing the Product Backlog.", true,
              "The PO owns and orders the Product Backlog to maximise delivered value."),
            o("D", "Assigns tasks to team members.", false, "The team self-organises; the PO doesn't assign tasks."),
          ],
        },
        {
          id: "q3",
          prompt: "In SCRUM, who is responsible for removing impediments that affect the team?",
          options: [
            o("A", "Product Owner.", false, "The PO manages value/backlog, not impediment removal."),
            o("B", "Project Sponsor.", false, "Sponsors fund/authorise; they don't remove daily impediments."),
            o("C", "SCRUM Master.", true,
              "The Scrum Master serves the team by removing impediments and protecting the process."),
            o("D", "Development Team Lead.", false, "SCRUM teams are cross-functional with no separate 'team lead' role."),
          ],
        },
        {
          id: "q4",
          prompt: "Which SCRUM event focuses on inspecting the Increment and gathering stakeholder feedback?",
          options: [
            o("A", "Sprint Planning.", false, "Planning sets up the sprint; it doesn't inspect the increment."),
            o("B", "Daily SCRUM.", false, "The Daily is a 15-min team sync, not stakeholder feedback."),
            o("C", "Sprint Review.", true,
              "The Sprint Review inspects the increment with stakeholders and gathers their feedback."),
            o("D", "Sprint Retrospective.", false, "The Retro improves the process, not the increment with stakeholders."),
          ],
        },
        {
          id: "q5",
          prompt: "Which of the following best describes a Sprint?",
          options: [
            o("A", "A phase that ends when all project work is completed.", false, "Sprints are fixed-length, not open-ended."),
            o("B", "A fixed-length iteration that produces a usable Increment.", true,
              "A Sprint is a time-boxed iteration delivering a potentially releasable increment."),
            o("C", "A planning meeting held at the beginning of a project.", false, "That's Sprint Planning, not a Sprint."),
            o("D", "A period used only for documentation.", false, "Sprints produce working product, not just docs."),
          ],
        },
        {
          id: "q6",
          prompt: "Which artefact contains all known work needed to improve the product?",
          options: [
            o("A", "Sprint Backlog.", false, "The Sprint Backlog is only the work for the current sprint."),
            o("B", "Increment.", false, "The Increment is completed work, not the to-do list."),
            o("C", "Product backlog.", true,
              "The Product Backlog is the single, ordered list of all work to improve the product."),
            o("D", "Burn-down Chart.", false, "A burn-down tracks progress; it isn't the work list."),
          ],
        },
        {
          id: "q7",
          prompt: "What is the Increment in SCRUM?",
          options: [
            o("A", "A collection of ideas discussed during Sprint Planning.", false, "Ideas aren't a completed increment."),
            o("B", "A detailed project plan.", false, "A plan isn't an increment of product."),
            o("C", "The sum of all completed Product Backlog items that meet the Definition of Done.", true,
              "The Increment is all 'Done' backlog items combined — a usable step toward the goal."),
            o("D", "A prototype that may or may not be usable.", false, "An increment must meet the Definition of Done — it's usable."),
          ],
        },
        {
          id: "q8",
          prompt: "In the Green Cruise Initiative, which would be the best example of an Increment?",
          options: [
            o("A", "A list of sustainability ideas without validation.", false, "Unvalidated ideas aren't a Done increment."),
            o("B", "A partially completed sustainability report.", false, "Partial/incomplete work isn't a Done increment."),
            o("C", "A validated baseline sustainability dashboard shared with stakeholders.", true,
              "A finished, validated, shareable deliverable is a true increment meeting the Definition of Done."),
            o("D", "Meeting minutes from the Sprint Review.", false, "Minutes are a by-product, not a product increment."),
          ],
        },
        {
          id: "q9",
          prompt: "Which statement best reflects the empirical nature of SCRUM?",
          options: [
            o("A", "Progress is measured against the original project plan.", false, "That's plan-driven, not empirical."),
            o("B", "Decisions are based on detailed upfront specifications.", false, "Upfront specs are predictive, not empirical."),
            o("C", "Transparency, inspection, and adaptation guide progress.", true,
              "The three empirical pillars — transparency, inspection, adaptation — drive SCRUM."),
            o("D", "Success is measured only at the end of the project.", false, "SCRUM inspects/adapts continuously, not just at the end."),
          ],
        },
        {
          id: "q10",
          prompt: "Why does Scrum emphasise delivering value incrementally?",
          options: [
            o("A", "To reduce the need for stakeholder involvement.", false, "Increments invite more, not less, involvement."),
            o("B", "To allow early inspection, feedback, and adaptation.", true,
              "Frequent increments enable early feedback and course correction."),
            o("C", "To minimise documentation.", false, "Reducing docs isn't the reason for incremental value."),
            o("D", "To eliminate the need for planning.", false, "Scrum still plans every sprint."),
          ],
        },
      ],
    },

    // ── 9 ──────────────────────────────────────────────────────────────────────
    {
      id: "s9",
      title: "Hybrid, Digital Tools and Modern PM",
      questions: [
        {
          id: "q1",
          prompt: "What is the main idea behind hybrid project management?",
          options: [
            o("A", "Replacing Waterfall completely with Agile.", false, "Hybrid blends both; it doesn't replace one entirely."),
            o("B", "Combining structured planning with iterative execution.", true,
              "Hybrid mixes predictive planning where useful with agile iteration where needed."),
            o("C", "Running two separate projects in parallel.", false, "Hybrid is one project using mixed methods, not two projects."),
            o("D", "Avoiding planning to stay flexible.", false, "Hybrid keeps structured planning, not abandons it."),
          ],
        },
        {
          id: "q2",
          prompt: "Which element is typically managed predictively (Waterfall) even in hybrid settings?",
          options: [
            o("A", "Daily task prioritisation.", false, "Daily prioritisation is handled in the agile part."),
            o("B", "Regulatory approval milestones.", true,
              "Fixed regulatory milestones need predictive, plan-driven management."),
            o("C", "Sprint retrospectives.", false, "Retrospectives are agile ceremonies."),
            o("D", "User feedback cycles.", false, "Feedback cycles are managed agilely."),
          ],
        },
        {
          id: "q3",
          prompt: "What is Agile primarily used for within a hybrid framework?",
          options: [
            o("A", "Fixing scope early.", false, "Fixing scope early is the predictive part."),
            o("B", "Managing uncertainty and innovation.", true,
              "Agile handles the uncertain, evolving, innovative portions of a hybrid project."),
            o("C", "Documenting processes in detail.", false, "Heavy documentation is predictive, not agile's strength."),
            o("D", "Eliminating stakeholder communication.", false, "Agile increases communication."),
          ],
        },
        {
          id: "q4",
          prompt: "Why must PM approaches be tailored rather than copied from templates?",
          options: [
            o("A", "Because every organisation prefers different terminology.", false, "Terminology isn't the real reason for tailoring."),
            o("B", "Because projects differ in uncertainty, risk, and stakeholder needs.", true,
              "Each project's context differs, so the method must be adapted to fit."),
            o("C", "Because Agile forbids standardisation.", false, "Agile doesn't forbid standards; tailoring is about fit."),
            o("D", "Because tools determine the method automatically.", false, "Tools support, but don't dictate, the method."),
          ],
        },
        {
          id: "q5",
          prompt: "Digital collaboration tools primarily support hybrid projects by:",
          options: [
            o("A", "Replacing the need for leadership.", false, "Tools support leaders; they don't replace leadership."),
            o("B", "Making planning unnecessary.", false, "Tools aid planning, not remove it."),
            o("C", "Enabling transparency, coordination, and real-time updates.", true,
              "Their value is transparency, coordination and live information sharing."),
            o("D", "Slowing work to ensure quality.", false, "Tools speed coordination, not slow it."),
          ],
        },
        {
          id: "q6",
          prompt: "What is a key benefit of using analytics in project management?",
          options: [
            o("A", "Eliminating uncertainty completely.", false, "Analytics reduces but can't eliminate uncertainty."),
            o("B", "Predicting risks and supporting better decisions.", true,
              "Analytics surfaces patterns/risks and informs better, data-driven decisions."),
            o("C", "Avoiding stakeholder involvement.", false, "Analytics doesn't replace stakeholder engagement."),
            o("D", "Reducing the need for communication.", false, "Analytics informs communication, not removes it."),
          ],
        },
        {
          id: "q7",
          prompt: "Artificial intelligence is best described as:",
          options: [
            o("A", "A replacement for the project manager.", false, "AI assists; it doesn't replace the PM's judgement and leadership."),
            o("B", "A tool that automates routine tasks and supports analysis.", true,
              "AI augments PMs by automating routine work and aiding analysis/decisions."),
            o("C", "A system used only in IT projects.", false, "AI applies across project domains, not only IT."),
            o("D", "A method for eliminating planning phases.", false, "AI supports planning, it doesn't eliminate it."),
          ],
        },
        {
          id: "q8",
          prompt: "Modern project success is increasingly measured by:",
          options: [
            o("A", "Whether the original plan was followed exactly.", false, "Rigid plan adherence is the old measure."),
            o("B", "The number of reports produced.", false, "Report count isn't a value measure."),
            o("C", "Delivered stakeholder value and usable outcomes.", true,
              "Modern success focuses on realised value and outcomes for stakeholders."),
            o("D", "The length of the project lifecycle.", false, "Duration isn't a success measure."),
          ],
        },
        {
          id: "q9",
          prompt: "A sustainability project has fixed regulatory deadlines, uncertain technical solutions and a need for continuous testing. Which approach is most appropriate?",
          options: [
            o("A", "Pure Waterfall.", false, "Pure Waterfall can't handle the technical uncertainty/testing well."),
            o("B", "Pure Agile.", false, "Pure agile struggles with the fixed regulatory milestones."),
            o("C", "Hybrid combining fixed milestones with iterative development.", true,
              "Hybrid suits this: predictive for regulatory deadlines, agile for uncertain tech and testing."),
            o("D", "No structured method.", false, "Abandoning structure is never appropriate."),
          ],
        },
        {
          id: "q10",
          prompt: "Which competency becomes more important in modern project environments?",
          options: [
            o("A", "Strict command-and-control supervision.", false, "Command-and-control is declining in modern PM."),
            o("B", "Facilitating collaboration and adaptation.", true,
              "Facilitation, collaboration and adaptability are the rising modern competencies."),
            o("C", "Avoiding stakeholder interaction.", false, "Modern PM increases stakeholder interaction."),
            o("D", "Focusing only on technical scheduling.", false, "Narrow scheduling focus misses people/value skills."),
          ],
        },
      ],
    },

    // ── 10 ─────────────────────────────────────────────────────────────────────
    {
      id: "s10",
      title: "General Project Management Revision",
      questions: [
        {
          id: "q1",
          prompt: "What is the defining characteristic of a project?",
          options: [
            o("A", "It is repetitive and ongoing.", false, "Repetitive/ongoing describes operations, not projects."),
            o("B", "It creates a unique outcome within a limited timeframe.", true,
              "Projects are temporary and produce a unique result — the core definition."),
            o("C", "It always requires external funding.", false, "Funding source is irrelevant to the definition."),
            o("D", "It is performed by a permanent team.", false, "Project teams are typically temporary."),
          ],
        },
        {
          id: "q2",
          prompt: "In traditional PM, what is the main purpose of the WBS?",
          options: [
            o("A", "To assign salaries to team members.", false, "Salaries aren't a WBS function."),
            o("B", "To decompose the project scope into manageable components.", true,
              "The WBS breaks scope into manageable, deliverable-oriented pieces."),
            o("C", "To monitor team motivation.", false, "Motivation isn't a WBS concern."),
            o("D", "To replace the project schedule.", false, "The WBS feeds the schedule; it doesn't replace it."),
          ],
        },
        {
          id: "q3",
          prompt: "Which of the following is part of the 'iron triangle'?",
          options: [
            o("A", "Innovation.", false, "Innovation isn't a corner of the iron triangle."),
            o("B", "Sustainability.", false, "Sustainability isn't part of the classic triangle."),
            o("C", "Cost.", true,
              "The iron triangle is scope, time and cost (with quality at the centre) — cost is a corner."),
            o("D", "Leadership style.", false, "Leadership style isn't part of the triangle."),
          ],
        },
        {
          id: "q4",
          prompt: "What is the primary role of a PM in a predictive (PMI-style) environment?",
          options: [
            o("A", "Facilitate self-organisation without planning.", false, "That's an agile leaning, not predictive."),
            o("B", "Control scope, schedule, and resources according to the plan.", true,
              "Predictive PMs manage to the baseline plan — controlling scope, schedule and resources."),
            o("C", "Avoid documentation.", false, "Predictive PM is documentation-heavy."),
            o("D", "Deliver work without stakeholder involvement.", false, "Stakeholder engagement matters in any approach."),
          ],
        },
        {
          id: "q5",
          prompt: "Agile project management assumes that:",
          options: [
            o("A", "Requirements must be fixed at the beginning.", false, "Fixed-upfront requirements is predictive."),
            o("B", "Change should be minimised at all costs.", false, "Agile embraces change, not minimises it."),
            o("C", "Learning occurs through iterative delivery and feedback.", true,
              "Agile assumes you learn and adapt via iterations and feedback loops."),
            o("D", "Documentation replaces communication.", false, "Agile values communication over documentation."),
          ],
        },
        {
          id: "q6",
          prompt: "What is the key purpose of a Sprint Review in SCRUM?",
          options: [
            o("A", "To finalise contracts.", false, "Contracts aren't the Sprint Review's purpose."),
            o("B", "To evaluate increment results with stakeholders and gather feedback.", true,
              "The Sprint Review inspects the increment with stakeholders and collects feedback."),
            o("C", "To punish delays.", false, "SCRUM events aren't punitive."),
            o("D", "To create the project charter.", false, "Charters are an initiation artefact, not a Sprint Review output."),
          ],
        },
        {
          id: "q7",
          prompt: "When should a predictive approach be preferred over Agile?",
          options: [
            o("A", "When requirements are unclear, and experimentation is needed.", false, "Unclear/experimental work favours agile."),
            o("B", "When regulatory constraints demand detailed upfront planning.", true,
              "Stable, regulated work with clear requirements suits predictive planning."),
            o("C", "When innovation is the main objective.", false, "Innovation favours agile experimentation."),
            o("D", "When teams want maximum flexibility.", false, "Maximum flexibility favours agile."),
          ],
        },
        {
          id: "q8",
          prompt: "Tailoring a project management methodology means:",
          options: [
            o("A", "Applying a method exactly as described in the textbook.", false, "Copying verbatim is the opposite of tailoring."),
            o("B", "Selecting and adapting practices to fit the project context.", true,
              "Tailoring = choosing and adapting practices to suit the specific project."),
            o("C", "Replacing management with intuition.", false, "Tailoring isn't abandoning method for intuition."),
            o("D", "Ignoring organisational strategy.", false, "Tailoring should align with, not ignore, strategy."),
          ],
        },
        {
          id: "q9",
          prompt: "What is the main advantage of using digital project management tools?",
          options: [
            o("A", "They eliminate the need for communication.", false, "Tools enable communication, not remove it."),
            o("B", "They automatically guarantee project success.", false, "No tool guarantees success."),
            o("C", "They enhance transparency, collaboration, and real-time tracking.", true,
              "Digital tools improve transparency, collaboration and live tracking."),
            o("D", "They replace leadership responsibilities.", false, "Tools support leaders; they don't replace them."),
          ],
        },
        {
          id: "q10",
          prompt: "Why are hybrid PM approaches increasingly common?",
          options: [
            o("A", "Because Agile has completely replaced traditional PM.", false, "Agile hasn't replaced predictive; they coexist."),
            o("B", "Because most real projects contain both predictable and uncertain elements.", true,
              "Real projects mix stable and uncertain parts, so blended methods fit best."),
            o("C", "Because organisations want more bureaucracy.", false, "Hybrid aims for fit, not bureaucracy."),
            o("D", "Because hybrid approaches require no planning.", false, "Hybrid still requires planning."),
          ],
        },
      ],
    },
  ],
};

export default jacobsenQuiz;
