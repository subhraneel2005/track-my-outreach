import { db } from "./index"
import { templates } from "./schema"

function generateId() {
  return crypto.randomUUID()
}

const seedTemplates = [
  {
    name: "Referral through Email",
    channel: "email",
    body: `hi {name},

hope you're doing good. i came across your profile while exploring the {team_name} at {company_name} after applying for the {role} role, job id: {job_id}

i'm a fresh cs graduate with 6 months of fullstack intern experience at an ai startup and 4 months of backend + applied ai internship experience at a web/app dev agency.

i've been actively building projects around gen ai, ai agents, and backend.

one of my recent projects is a terminal coding agent which i built by reverse engineering claude-code. it has tool calling, agent memory, human in the loop, web access, file tools, code execution, gh access and task planner subagent. https://github.com/subhraneel2005/sidequests

would love to connect and share more about my work.

thanks,
subhraneel`,
    order: 1,
  },
  {
    name: "Cold Email to Startup Hiring",
    channel: "email",
    body: `Hi {startup_name} Team,

I have applied for the {role} role and wanted to share my portfolio and a few relevant projects.

I'm a recent CS graduate with 6 months of fullstack intern experience at an ai startup and 4 months of backend + applied ai intern experience at a web/app dev agency.

These are my recent projects:

mini claude code: reverse engineered claude-code and built my own coding agent from scratch. It has tool calling, agent memory, human in the loop, web access, file tools, code execution, gh access and task planner subagent.
gh: https://github.com/subhraneel2005/sidequests

portfolio: https://subhraneel2005.github.io/
github: https://github.com/subhraneel2005

thanks,
subhraneel`,
    order: 2,
  },
  {
    name: "Cold Email V2 (GenZ Startups)",
    channel: "email",
    body: `hi,

i'm a cs graduate with 6 months of fullstack intern experience at an ai startup and 4 months of backend + applied ai intern experience at a web/app dev agency.

i've been building stuff related to ai, agents and fullstack.

some of my recent works include:
mini claude code: reverse engineered claude-code and built my own claude code coding agent from scratch. It has tool calling, agent memory, human in the loop, web access, file tools, code execution, gh access and task planner subagent.
gh: https://github.com/subhraneel2005/sidequests

portfolio: https://subhraneel2005.github.io/

thanks,
subhraneel`,
    order: 3,
  },
  {
    name: "LinkedIn/X DM Script",
    channel: "linkedin",
    body: `Hi {name},

Hope you're doing well. I came across your profile while looking for people at {company_name} and thought I'd reach out.

I recently applied for the {role} role in {location} (Job ID: {job_id}) at {company_name}.

I'm a bca graduate with 6 months of fullstack internship experience at an ai startup and 5 months of app dev + applied ai experience at a web/app dev agency.

Some of my recent projects:

https://github.com/subhraneel2005/sidequests: reverse engineered claude-code and built my own coding agent with tool calling, memory, web access and more.

portfolio: https://subhraneel2005.github.io/

would love to connect!`,
    order: 4,
  },
  {
    name: "Good Email Example (Detailed)",
    channel: "email",
    body: `hi {startup_name} team,

not sure if the {role} role is still open, but i came across it recently and felt it aligned really well with the kind of things i've been building lately, so thought i'd reach out.

i'm a recent cs graduate with:

- 6 months of fullstack internship experience at an ai startup
- 4 months of backend + applied ai internship experience at a web/app dev agency

most of my recent work has been around ai systems, agents and fullstack products.

some recent projects:

multi-agent customer support system
built a multi-agent customer support workflow using python, langchain and langgraph.
https://github.com/subhraneel2005/multi_agent_cs_system

mini claude code
built my own claude-code style coding agent from scratch with tool calling, memory, web access, file tools, github integration and task-planning subagents.
https://github.com/subhraneel2005/sidequests

usecerebr
building a personal knowledge graph / second-brain agent connecting research papers, yt videos, blogs and articles.
https://github.com/subhraneel2005/usecerebr

study-toolkit
an ai-powered study platform with pdf chat, flashcards, summarization, auth and token-based usage.
https://study-toolkit.vercel.app/

portfolio: https://subhraneel2005.github.io/
github: https://github.com/subhraneel2005

all my exams are done, i'm actively looking for opportunities, i can relocate anywhere in India and can join immediately.

would love to be considered.

thanks,
subhraneel`,
    order: 5,
  },
]

async function seed() {
  console.log("Seeding templates...")

  for (const t of seedTemplates) {
    const now = new Date()
    await db.insert(templates).values({
      id: generateId(),
      name: t.name,
      body: t.body,
      channel: t.channel,
      order: t.order,
      createdAt: now,
      updatedAt: now,
    })
  }

  console.log(`Seeded ${seedTemplates.length} templates.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
