// ─────────────────────────────────────────────────────────────────────────────
// Work Breakdown Structure (WBS) exercise generator.
//
// Each template is a project decomposed into level-2 deliverables, each of which
// owns several level-3 work packages. The trainer shuffles the work packages and
// asks the student to re-assign every one to its correct deliverable.
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
  },
  {
    title: "Office Relocation",
    deliverables: [
      { name: "Planning", packages: ["Site survey", "Floor plan", "Budget approval"] },
      { name: "Logistics", packages: ["Packing", "Transport booking", "Furniture install"] },
      { name: "IT Setup", packages: ["Network cabling", "Workstation setup", "Phone system"] },
      { name: "Communication", packages: ["Staff briefing", "Client notification", "Signage update"] },
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
  },
  {
    title: "Conference Organisation",
    deliverables: [
      { name: "Venue", packages: ["Location booking", "Catering", "AV equipment"] },
      { name: "Program", packages: ["Speaker invitations", "Agenda", "Session materials"] },
      { name: "Registration", packages: ["Registration website", "Ticketing", "Attendee list"] },
      { name: "Marketing", packages: ["Social media", "Email campaign", "Press release"] },
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
  },
];

/**
 * Build a randomised WBS exercise: pick a template, choose 3 deliverables, take
 * 2–3 work packages from each, then shuffle all the packages together.
 * @returns {{ title, deliverables:string[], packages:Array<{id,name,parent}> }}
 */
export function generateWbs() {
  const template = TEMPLATES[randInt(0, TEMPLATES.length - 1)];
  const chosen = shuffled(template.deliverables).slice(0, 3);

  const packages = [];
  let pid = 0;
  chosen.forEach((d) => {
    const count = randInt(2, 3);
    shuffled(d.packages)
      .slice(0, count)
      .forEach((name) => {
        packages.push({ id: `p${pid++}`, name, parent: d.name });
      });
  });

  return {
    title: template.title,
    // keep deliverables in a stable display order
    deliverables: chosen.map((d) => d.name),
    packages: shuffled(packages),
  };
}

/** Group packages by their correct deliverable, with WBS codes, for the solution. */
export function solveWbs(exercise) {
  return exercise.deliverables.map((name, i) => ({
    name,
    code: `1.${i + 1}`,
    packages: exercise.packages
      .filter((p) => p.parent === name)
      .map((p, j) => ({ ...p, code: `1.${i + 1}.${j + 1}` })),
  }));
}
