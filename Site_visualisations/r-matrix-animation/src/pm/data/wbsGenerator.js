// ─────────────────────────────────────────────────────────────────────────────
// Work Breakdown Structure (WBS) exercise generator.
//
// Each template defines a project, its scope (described in PROSE — inclusion &
// exclusion, without naming the individual elements), its in-scope deliverables
// (level 2) with work packages (level 3), and a pool of out-of-scope "decoy"
// work packages drawn from clearly-excluded areas.
//
// The student must INFER which packages are out of scope from the prose, assign
// every in-scope package to the correct deliverable, exclude the decoys, and
// type the WBS numbering.
// ─────────────────────────────────────────────────────────────────────────────

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEMPLATES = [
  {
    title: "Website Relaunch",
    scope: {
      includes:
        "Deliver a redesigned, content-complete company website and take it live.",
      excludes:
        "Anything beyond the website itself — native mobile applications, offline/print marketing, and changes to staffing — is owned by other teams and is not part of this project.",
    },
    deliverables: [
      { name: "Design", packages: ["Wireframes", "Visual mockups", "Style guide"] },
      { name: "Content", packages: ["Copywriting", "Image sourcing", "SEO metadata"] },
      { name: "Development", packages: ["Frontend build", "CMS integration", "Test suite"] },
      { name: "Launch", packages: ["Server setup", "Go-live cutover", "Post-launch monitoring"] },
    ],
    outOfScope: ["iOS app build", "Android app build", "Brochure design", "Flyer printing", "Job postings", "Candidate interviews"],
  },
  {
    title: "Office Relocation",
    scope: {
      includes:
        "Move the existing team, furniture and IT equipment into the new premises and get everyone operational.",
      excludes:
        "Work on the building structure itself, growing the headcount, and hospitality/food services are owned by other departments and fall outside this project.",
    },
    deliverables: [
      { name: "Planning", packages: ["Site survey", "Floor plan", "Budget approval"] },
      { name: "Logistics", packages: ["Packing", "Transport booking", "Furniture install"] },
      { name: "IT Setup", packages: ["Network cabling", "Workstation setup", "Phone system"] },
      { name: "Communication", packages: ["Staff briefing", "Client notification", "Signage update"] },
    ],
    outOfScope: ["Structural works", "Building permits", "Recruitment", "Employee onboarding", "Menu planning", "Catering contracts"],
  },
  {
    title: "Mobile App Launch",
    scope: {
      includes:
        "Research, design, build and release the new mobile application.",
      excludes:
        "Procuring physical hardware, company legal and registration matters, and fitting out office facilities lie outside this project's boundary.",
    },
    deliverables: [
      { name: "Discovery", packages: ["User research", "Requirements document", "Competitor analysis"] },
      { name: "Design", packages: ["UX flows", "UI screens", "Clickable prototype"] },
      { name: "Build", packages: ["API development", "App coding", "QA testing"] },
      { name: "Release", packages: ["App store submission", "Marketing campaign", "Support setup"] },
    ],
    outOfScope: ["Device purchase", "Warehouse setup", "Company registration", "Trademark filing", "Office furniture", "Office decoration"],
  },
  {
    title: "Conference Organisation",
    scope: {
      includes:
        "Plan and run the conference: secure the venue, build the program, handle registration and promote the event.",
      excludes:
        "Activities after the event, producing physical merchandise, and arranging attendee travel are not part of this project.",
    },
    deliverables: [
      { name: "Venue", packages: ["Location booking", "Catering", "AV equipment"] },
      { name: "Program", packages: ["Speaker invitations", "Agenda", "Session materials"] },
      { name: "Registration", packages: ["Registration website", "Ticketing", "Attendee list"] },
      { name: "Marketing", packages: ["Social media", "Email campaign", "Press release"] },
    ],
    outOfScope: ["Survey analysis", "White paper", "T-shirt printing", "Mug design", "Flight booking", "Hotel deals"],
  },
  {
    title: "Consumer Product Launch",
    scope: {
      includes:
        "Develop, manufacture, market and distribute the new product ready for launch.",
      excludes:
        "Ongoing after-sales support, legal disputes and patent litigation, and internal employee training are handled separately and excluded.",
    },
    deliverables: [
      { name: "R&D", packages: ["Prototype", "Lab testing", "Certification"] },
      { name: "Manufacturing", packages: ["Supplier selection", "Production run", "Quality control"] },
      { name: "Marketing", packages: ["Branding", "Advertising", "Launch event"] },
      { name: "Distribution", packages: ["Warehousing", "Logistics", "Retail onboarding"] },
    ],
    outOfScope: ["Call centre", "Product repairs", "Legal filing", "Court representation", "Training workshops", "Training manuals"],
  },
];

/**
 * Build a randomised WBS exercise.
 * @returns {{
 *   title:string,
 *   scope:{includes:string, excludes:string},
 *   deliverables:Array<{id,name}>,
 *   packages:Array<{id,name,parentName:string|null}>   // parentName null = out of scope
 * }}
 */
export function generateWbs() {
  const t = TEMPLATES[randInt(0, TEMPLATES.length - 1)];

  const buckets = shuffled(t.deliverables)
    .slice(0, 3)
    .map((d) => ({
      name: d.name,
      packages: shuffled(d.packages).slice(0, randInt(2, 3)),
    }));

  // real (in-scope) packages
  const real = [];
  buckets.forEach((b) =>
    b.packages.forEach((name) => real.push({ name, parentName: b.name }))
  );

  // decoy (out-of-scope) packages
  const decoys = shuffled(t.outOfScope)
    .slice(0, randInt(2, 3))
    .map((name) => ({ name, parentName: null }));

  const packages = shuffled([...real, ...decoys]).map((p, i) => ({
    id: `p${i}`,
    name: p.name,
    parentName: p.parentName,
  }));

  // deliverable buckets shown in a random order; codes follow that order
  const deliverables = shuffled(buckets.map((b) => b.name)).map((name, i) => ({
    id: `g${i}`,
    name,
  }));

  return { title: t.title, scope: t.scope, deliverables, packages };
}
