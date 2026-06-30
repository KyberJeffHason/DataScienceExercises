// ─────────────────────────────────────────────────────────────────────────────
// Work Breakdown Structure (WBS) exercise generator.
//
// Each template is a project with:
//   • in-scope deliverables (level 2) → work packages (level 3)
//   • a pool of out-of-scope "decoy" deliverables (the exclusions)
//
// The generator builds a project scope (inclusions + exclusions) and a tree that
// mixes in-scope and out-of-scope deliverables. The student must:
//   1. recognise & exclude the out-of-scope deliverables (100% rule), and
//   2. type the correct WBS numbering for everything that is in scope.
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
    deliverables: [
      { name: "Design", packages: ["Wireframes", "Visual mockups", "Style guide"] },
      { name: "Content", packages: ["Copywriting", "Image sourcing", "SEO metadata"] },
      { name: "Development", packages: ["Frontend build", "CMS integration", "Test suite"] },
      { name: "Launch", packages: ["Server setup", "Go-live cutover", "Post-launch monitoring"] },
    ],
    outOfScope: [
      { name: "Native Mobile App", packages: ["iOS build", "Android build"] },
      { name: "Print Marketing", packages: ["Brochure design", "Flyer printing"] },
      { name: "Staff Recruitment", packages: ["Job postings", "Interviews"] },
    ],
  },
  {
    title: "Office Relocation",
    deliverables: [
      { name: "Planning", packages: ["Site survey", "Floor plan", "Budget approval"] },
      { name: "Logistics", packages: ["Packing", "Transport booking", "Furniture install"] },
      { name: "IT Setup", packages: ["Network cabling", "Workstation setup", "Phone system"] },
      { name: "Communication", packages: ["Staff briefing", "Client notification", "Signage update"] },
    ],
    outOfScope: [
      { name: "New Hiring", packages: ["Recruitment", "Onboarding"] },
      { name: "Building Construction", packages: ["Structural works", "Permits"] },
      { name: "Catering Services", packages: ["Menu planning", "Vendor contracts"] },
    ],
  },
  {
    title: "Mobile App Launch",
    deliverables: [
      { name: "Discovery", packages: ["User research", "Requirements document", "Competitor analysis"] },
      { name: "Design", packages: ["UX flows", "UI screens", "Clickable prototype"] },
      { name: "Build", packages: ["API development", "App coding", "QA testing"] },
      { name: "Release", packages: ["App store submission", "Marketing campaign", "Support setup"] },
    ],
    outOfScope: [
      { name: "Hardware Procurement", packages: ["Device purchase", "Warehouse setup"] },
      { name: "Legal Incorporation", packages: ["Company registration", "Trademark filing"] },
      { name: "Office Fit-out", packages: ["Furniture", "Decoration"] },
    ],
  },
  {
    title: "Conference Organisation",
    deliverables: [
      { name: "Venue", packages: ["Location booking", "Catering", "AV equipment"] },
      { name: "Program", packages: ["Speaker invitations", "Agenda", "Session materials"] },
      { name: "Registration", packages: ["Registration website", "Ticketing", "Attendee list"] },
      { name: "Marketing", packages: ["Social media", "Email campaign", "Press release"] },
    ],
    outOfScope: [
      { name: "Post-event Research", packages: ["Survey analysis", "White paper"] },
      { name: "Merchandise Production", packages: ["T-shirt printing", "Mug design"] },
      { name: "Travel Agency Services", packages: ["Flight booking", "Hotel deals"] },
    ],
  },
  {
    title: "Consumer Product Launch",
    deliverables: [
      { name: "R&D", packages: ["Prototype", "Lab testing", "Certification"] },
      { name: "Manufacturing", packages: ["Supplier selection", "Production run", "Quality control"] },
      { name: "Marketing", packages: ["Branding", "Advertising", "Launch event"] },
      { name: "Distribution", packages: ["Warehousing", "Logistics", "Retail onboarding"] },
    ],
    outOfScope: [
      { name: "After-sales Service", packages: ["Call centre", "Repairs"] },
      { name: "Patent Litigation", packages: ["Legal filing", "Court representation"] },
      { name: "Employee Training", packages: ["Workshops", "Manuals"] },
    ],
  },
];

/**
 * Build a randomised WBS exercise.
 * @returns {{
 *   title:string,
 *   scope:{inclusions:string[], exclusions:string[]},
 *   deliverables:Array<{id,name,inScope,packages:Array<{id,name}>}>
 * }}
 */
export function generateWbs() {
  const t = TEMPLATES[randInt(0, TEMPLATES.length - 1)];

  const inDels = shuffled(t.deliverables)
    .slice(0, 3)
    .map((d) => ({
      name: d.name,
      inScope: true,
      packages: shuffled(d.packages).slice(0, randInt(2, 3)),
    }));

  const outDels = shuffled(t.outOfScope)
    .slice(0, randInt(1, 2))
    .map((d) => ({
      name: d.name,
      inScope: false,
      packages: shuffled(d.packages).slice(0, randInt(1, 2)),
    }));

  // mix in-scope and out-of-scope deliverables into one display order
  const deliverables = shuffled([...inDels, ...outDels]).map((d, di) => ({
    id: `d${di}`,
    name: d.name,
    inScope: d.inScope,
    packages: d.packages.map((name, pi) => ({ id: `d${di}p${pi}`, name })),
  }));

  return {
    title: t.title,
    scope: {
      inclusions: inDels.map((d) => d.name),
      exclusions: outDels.map((d) => d.name),
    },
    deliverables,
  };
}

/**
 * Compute the correct WBS codes (and which deliverables are excluded) by walking
 * the deliverables in display order and skipping out-of-scope branches.
 * @returns {{ codes:Record<string,string|null>, excluded:Record<string,boolean> }}
 */
export function solveWbs(exercise) {
  const codes = {};
  const excluded = {};
  let dCount = 0;
  exercise.deliverables.forEach((d) => {
    if (d.inScope) {
      dCount += 1;
      codes[d.id] = `1.${dCount}`;
      excluded[d.id] = false;
      d.packages.forEach((p, j) => {
        codes[p.id] = `1.${dCount}.${j + 1}`;
      });
    } else {
      codes[d.id] = null;
      excluded[d.id] = true;
      d.packages.forEach((p) => {
        codes[p.id] = null;
      });
    }
  });
  return { codes, excluded };
}
