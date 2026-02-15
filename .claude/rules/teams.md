# Agent Teams

Coordinated multi-agent workflow for complex work. Uses Claude Code's experimental Agent Teams feature.

## When to Use Teams

| Scenario | Use Team? | Agents |
|----------|-----------|--------|
| Complex feature (UI + API) | Yes | architect, critic, frontend, backend, all 3 enforcers |
| Backend-only feature | Yes | architect, critic, backend, test-enforcer, security-enforcer |
| Frontend-only feature | Yes | architect, critic, frontend, patterns-enforcer, test-enforcer |
| Bug investigation | Yes | 3-5 investigators with competing hypotheses |
| Quick fix / single file | No | Single session, run enforcers as subagents at end |

## Pipeline

```
DESIGN ──→ IMPLEMENTATION ──→ ENFORCEMENT ──→ DONE
 (adversarial)  (parallel)      (functional)
```

### Phase 1: Design (Adversarial Pair)

The **architect** proposes a plan. The **critic** challenges it. They iterate via messaging until the critic is satisfied. Only then does the lead approve and move to implementation.

Before writing the plan, the architect **consults specialists** (frontend/backend agents) for feasibility and pattern advice. The critic verifies this consultation happened.

The lead MUST use **delegate mode** (Shift+Tab) to avoid implementing directly.

### Phase 2: Implementation (Parallel)

The lead decomposes the approved plan into team tasks with clear file ownership. **Frontend** and **backend** implementers work in parallel on non-overlapping files.

Each implementer reads the project's skills and rules to learn the required patterns for their area of the codebase.

Implementers can **push back** on the plan during implementation. If something doesn't work in practice, they message the lead rather than silently working around it.

### Phase 3: Enforcement (Functional Specialists)

Three enforcers review independently and in parallel:

- **patterns-enforcer** — skill adherence across all changed files
- **test-enforcer** — test quality (testing trophy, behaviour-driven)
- **security-enforcer** — auth, permissions, IDOR, input validation

Enforcers send findings to the lead. The lead compiles issues and assigns fixes back to implementers. Implementers fix. Enforcers re-check. Loop until all enforcers approve.

## Agent Roles

| Role | Model | Purpose |
|------|-------|---------|
| architect | opus | Designs solutions, consults specialists, creates plans with file boundaries |
| critic | opus | Challenges designs, verifies specialist consultation, finds gaps |
| frontend | sonnet | UI components, pages, forms. Advisory during design, implementation during build. |
| backend | sonnet | API routes, services, server actions. Advisory during design, implementation during build. |
| patterns-enforcer | opus | Validates skill adherence across all changed files |
| test-enforcer | sonnet | Validates test quality, runs the test suite |
| security-enforcer | opus | Validates auth, permissions, input validation |

Agent definitions with full instructions are in `.claude/agents/`.

## Beads Integration

**Beads** is the persistent roadmap (epics, features, bugs). **Team task lists** are ephemeral session-scoped coordination. They work together, not as replacements.

| Concern | Beads | Team Tasks |
|---------|-------|------------|
| Persistence | Across sessions | Single session only |
| Granularity | Feature/bug level | Sub-task level (per-file) |
| Lifecycle | Created during planning, closed after merge | Created by lead, completed by teammates |
| Dependencies | Cross-feature blocking | Within-feature task ordering |

**Workflow**:

1. Pick a beads issue (`bd ready` or `/next-issue`)
2. Mark in progress (`bd update <id> --status in_progress`)
3. Create feature branch
4. For complex issues: lead creates a team, decomposes beads issue into team tasks
5. Team works through pipeline (design → implement → enforce)
6. Lead runs `/beads-commit` to close issue, commit, and merge

Design decisions and learnings from the session should be captured in beads issue notes (`bd update <id> --notes "..."`) so they persist for future sessions.

## Feedback Loops

The pipeline is not linear. Enforcers can send work back:

```
Implementer ──→ Enforcer ──→ findings ──→ Lead ──→ fix tasks ──→ Implementer
                                                                      │
                                                                      ▼
                                                              Enforcer re-checks
```

This continues until all three enforcers approve. The lead tracks which issues are resolved and which need another pass.

## Token Cost Management

Teams are expensive. Mitigations:

- **sonnet** for implementation and test enforcement (cheaper, faster)
- **opus** for architect, critic, patterns-enforcer, security-enforcer (needs deeper reasoning)
- Teams are **opt-in**, only for complex multi-file work
- Clear file ownership prevents merge conflicts (biggest source of wasted tokens)
- Delegate mode keeps the lead from duplicating implementer work
