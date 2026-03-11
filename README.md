<p align="center">
  <img src="asset/banner.png" alt="antigravity-super-ssuk" width="100%" />
</p>

<h1 align="center">antigravity-super-ssuk</h1>

<p align="center">
  <strong>Bring the power of <a href="https://github.com/obra/superpowers">Superpowers</a> to <a href="https://antigravity.google/">Antigravity</a>.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/antigravity-super-ssuk"><img src="https://img.shields.io/npm/v/antigravity-super-ssuk.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/antigravity-super-ssuk"><img src="https://img.shields.io/npm/dm/antigravity-super-ssuk.svg" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg" alt="node version" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" />
</p>

---

Superpowers is an incredible skill-based workflow system that gives AI coding assistants structured, reliable behavior — brainstorming, planning, test-driven development, code review, debugging, and more. It was originally designed for Claude Code, but the workflows themselves are platform-agnostic gold.

**This project ports that entire system to Antigravity**, preserving the original flow as faithfully as possible. The goal is not to reinvent Superpowers — it's to make them available on Antigravity with the minimal set of changes needed for native compatibility. If you've used Superpowers before, everything should feel familiar. If you haven't, this is a great way to start.

> **One command. Full profile. Ready to go.**

```bash
npx antigravity-super-ssuk init
# OR install globally
npx antigravity-super-ssuk init --global
```

---

## Why This Exists

The original Superpowers repo doesn't support Antigravity, and there's no official port planned. I wanted to use Superpowers workflows in Antigravity projects, so I built this myself.

This is my attempt to bring the full Superpowers skill set to Antigravity — as close to the original as possible. The goal was never to fork and diverge; it was to translate just enough to make everything work natively on a different platform. Superpowers skills bring real structure to AI-assisted development — brainstorming before implementation, planning before coding, verification before completion claims — and that discipline shouldn't be locked to one platform.

This port keeps **11 out of 14 original skills intact**, consolidates 2 into a single new skill for Antigravity's sequential model, and removes 2 that were platform-specific or redundant. Every skill preserves its original intent, logic, and flow — only the platform-specific references, tool names, and execution primitives have been adapted.

---

## What's Included

**13 skills** covering the full development lifecycle:

| `brainstorming`                  | Structured exploration before committing to an approach |
| `writing-plans`                  | Detailed, step-by-step implementation plans             |
| `executing-plans`                | Disciplined plan execution with progress tracking       |
| `single-flow-task-execution`     | Ordered task decomposition with review gates _(new)_    |
| `test-driven-development`        | Write tests first, implement second                     |
| `systematic-debugging`           | Root cause tracing with supporting techniques           |
| `requesting-code-review`         | Structured review flow with checklists                  |
| `receiving-code-review`          | Handling feedback systematically                        |
| `verification-before-completion` | Prove it works before claiming it's done                |
| `frontend-agent` / `backend-agent`| Specialized domain expertise for implementation         |
| `qa-agent`                       | Deep architectural & non-functional verification        |
| `using-superpowers`              | Skill routing and session bootstrap                     |
| `writing-skills`                 | Create new skills that follow the system's conventions  |

Plus **Guided Multi-Model Workflows**:

| Command        | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `/superpowers` | **Master Orchestrator**: Guided 5-phase cycle with model switching advice   |
| `/commit`      | **Git Commit Workflow**: Structured staging and branch-based commit messages|


Plus supporting infrastructure: workflows, agents, validation tests, and an `AGENTS.md` contract that ties it all together.

---

## Quick Start

```bash
# Scaffold the .agent profile into your project
npx antigravity-super-ssuk init
```

Or install globally:

```bash
npm install -g antigravity-super-ssuk
antigravity-super-ssuk init
```

### Options

```bash
# Initialize in current directory
antigravity-super-ssuk init

# Initialize globally (installs to ~/.agent/)
# This makes Superpowers available to ALL projects automatically.
antigravity-super-ssuk init --global

# Initialize in a specific project
antigravity-super-ssuk init /path/to/project

# Replace an existing .agent profile
antigravity-super-ssuk init --force
```

After init, verify everything is wired up:

```bash
bash .agent/tests/run-tests.sh
```

---

## How It Works

The CLI copies a complete `.agent` profile into your project root. Once initialized, Antigravity picks up the profile automatically.

### 1. Guided Cycle (`/superpowers`)

The recommended way to use Superpowers is through the `/superpowers` command. It orchestrates the full development lifecycle across 5 distinct phases, guiding you on the optimal AI model for each:

- **Phase 1: Brainstorming** (Claude Opus) — Explore requirements and design.
- **Phase 2: Planning** (Claude Opus) — Draft a step-by-step implementation plan.
- **Phase 3: Implementation** (Gemini) — Execute tasks sequentially (with TDD/Debugging skills).
- **Phase 4: Verification** (Gemini) — Run tests, builds, and linters.
- **Phase 5: Finishing** (Claude Opus) — Final code review and `/commit`.

### 2. Native Multi-Model Strategy

Antigravity Superpowers encourages using the best tool for the job:
- **Claude Opus**: Superior at creative reasoning, architectural planning, and analytical code review.
- **Gemini**: Outstanding at fast code generation, tool execution (Terminal/Browser), and rapid verification.

The `/superpowers` workflow includes **Transition Gates** at each phase to prompt you for model confirmation or switching.

### 3. Automated Skill Routing

For ad-hoc requests (without slash commands), Antigravity still routes your request to the most relevant skill:
1. **Each request gets routed** to the most relevant skill via `AGENTS.md`.
2. **Design work** flows through brainstorming → planning → execution.
3. **Every task** is tracked in `docs/plans/task.md` (created at runtime).
4. **Nothing is marked done** without running verification commands first.

```
Session Start → Load AGENTS.md → Load using-superpowers
                                        ↓
                              Route to relevant skill
                                        ↓
                          ┌─── Design change? ───┐
                          │ yes                   │ no
                     Brainstorm            Single-flow execution
                          ↓                       ↓
                    Writing plans          Verify before completion
                          ↓                       ↓
                  Single-flow execution   Finish branch
                          ↓
                  Verify before completion
                          ↓
                     Finish branch
```

---

## What Changed from Original Superpowers

> This port aims to stay as close to the original Superpowers as possible. The changes are the minimum required to run natively on Antigravity.

### Execution Model

The one notable structural change. The original Superpowers dispatches multiple coding subagents in parallel — but Antigravity doesn't support parallel subagent execution. So the two skills that relied on that capability (`dispatching-parallel-agents` and `subagent-driven-development`) couldn't be ported as-is. Instead, they were consolidated into a single new skill — **`single-flow-task-execution`** — which preserves the same decomposition logic, task queuing, and review gates, just executed sequentially rather than in parallel. The workflow is the same; the concurrency model is what changed.

| Original Skill                | What Happened                                                   |
| ----------------------------- | --------------------------------------------------------------- |
| `dispatching-parallel-agents` | Merged into `single-flow-task-execution`                        |
| `subagent-driven-development` | Merged into `single-flow-task-execution`                        |
| `single-flow-task-execution`  | **New** — consolidates decomposition, queuing, and review loops |
| `finishing-a-development-branch` | **Removed** — replaced by manual review & `/commit` workflow   |
| `using-git-worktrees`         | **Removed** — simplified branch management                      |

### Task Tracking

|              | Approach                                                                            |
| ------------ | ----------------------------------------------------------------------------------- |
| **Original** | `TodoWrite` tool                                                                    |
| **Port**     | Live table at `<project-root>/docs/plans/task.md` (created at runtime, not bundled) |

### Tool & Platform Vocabulary

Platform-specific references were translated — the underlying behavior is unchanged:

| Original                 | Antigravity Port                 |
| ------------------------ | -------------------------------- |
| `Claude` / `Claude Code` | `Antigravity`                    |
| `Skill` tool             | `view_file`                      |
| `TodoWrite`              | Update `docs/plans/task.md`      |
| `superpowers:<skill>`    | `.agent/skills/<skill>/SKILL.md` |
| `CLAUDE.md`              | `.agent/AGENTS.md`               |

### Skill Adaptations

Most skills required only terminology and path updates. A few needed slightly more work:

- **`requesting-code-review`** — uses a checklist-based review flow instead of subagent dispatch
- **`writing-plans`** / **`executing-plans`** — handoff paths and tracker references updated for Antigravity conventions

The rest — `brainstorming`, `test-driven-development`, `verification-before-completion`, `finishing-a-development-branch`, and others — preserve their original behavior with only naming and path normalization.

### Antigravity-Native Additions

Infrastructure added to make the profile work as a first-class Antigravity citizen:

- `.agent/AGENTS.md` — tool translation contract and execution rules
- `.agent/workflows/` — workflow entrypoints (`brainstorm.md`, `execute-plan.md`, `write-plan.md`)
- `.agent/agents/code-reviewer.md` — reviewer agent profile
- `.agent/tests/` — automated profile validation (skill presence, frontmatter, legacy pattern detection)

> **Full Diff:** See [ANTIGRAVITY-PORT-DIFFERENCES.md](ANTIGRAVITY-PORT-DIFFERENCES.md) for the exhaustive skill-by-skill comparison and [CURRENT-FLOW.md](CURRENT-FLOW.md) for the complete workflow diagram.

---

## Contributing

Contributions are welcome! If you find a skill that could be ported more faithfully, a translation that's off, or an Antigravity convention that's not followed — open an issue or PR.

When making changes, run the validation suite to make sure everything still checks out:

```bash
npm test
bash .agent/tests/run-tests.sh
```

---

## Development

```bash
npm test              # Run tests
npm run smoke:pack    # Verify package contents
```

### Publishing

```bash
npm version patch
npm publish
```

`prepublishOnly` runs `npm test` and `npm run smoke:pack` automatically.

---

## License

MIT
