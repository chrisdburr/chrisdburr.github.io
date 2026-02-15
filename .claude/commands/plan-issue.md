---
description: Fetch a beads issue and create an implementation plan
argument-hint: <issue-id> ["optional context from user"]
allowed-tools: Bash(bd show:*), Bash(bd list:*), Bash(bd update:*), Bash(bd close:*), Bash(bd sync:*), Bash(git log:*), Bash(git checkout:*), Bash(git pull:*), Bash(git stash:*), Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*)
---

# Plan Issue Implementation

**Arguments:** `$ARGUMENTS`

Parse the arguments:
- The first word is the **issue ID** (e.g., `AssurancePlatform-abc`)
- Everything after the first word is the **optional user context** (e.g., additional instructions, preferences, or constraints)

## Issue Details

The issue ID is the **first word** of the arguments. Run `bd show <issue-id>` to fetch details.

## User Context

Any text after the issue ID is **user context** that must be incorporated into the plan.

If user context was provided above, you MUST incorporate it into your implementation plan. The user's context may include:
- Specific implementation preferences or constraints
- Areas of focus or priority
- Technical decisions already made
- Questions they want answered in the plan

## Related Context

Use `bd show <issue-id>` output to identify dependencies. Check parent epics for additional context if mentioned.

## Your Task

Based on the issue details above:

1. **Mark the issue as in progress immediately:**
   - Run `bd update <issue-id> --status in_progress` before doing anything else

2. **Ask which branch to use as the base:**
   - Use the `AskUserQuestion` tool to ask: "Which branch should I use as the base for this feature branch?"
   - Offer these options:
     - `staging` (Recommended) - Standard workflow for standalone features
     - Current branch - For features that build on in-progress work (e.g., epic branches)
     - Other - Let user specify a different branch
   - Show the current branch name in the "Current branch" option description

3. **Create a feature branch from the chosen base:**
   - First, check for uncommitted changes and stash if necessary
   - Checkout the base branch: `git checkout <base-branch>`
   - Pull latest: `git pull`
   - Create a new branch using the pattern: `<type>/<issue-id>_<short-description>`
     - Use `feature/` for features, `fix/` for bugs, `task/` for tasks
     - Example: `feature/AssurancePlatform-abc_migrate-to-baseui` or `fix/AssurancePlatform-abc_rate-limiting`

4. **Use the `EnterPlanMode` tool** to enter plan mode for this implementation task

5. In plan mode, explore the codebase to understand the current state

6. Create a detailed implementation plan that includes:
   - Summary of what needs to be done
   - Key files/components that will be affected
   - Step-by-step implementation approach
   - Testing strategy
   - Potential risks or blockers
   - **Address any user context** provided in the arguments (preferences, constraints, questions)

7. **Assess complexity and recommend a work mode** (see details below)

8. **Include a final step in the plan** for post-implementation wrap-up:
   - After all implementation and testing steps, the plan MUST include a final step: **"Commit, close issue, and push"**
   - This step should state: "Ask the user if they would like to commit the changes and close the issue. If yes: stage the relevant files, commit with a descriptive message, run `bd close <issue-id>`, and push to remote."

9. Write the plan to the plan file and use `ExitPlanMode` when ready for user approval

**Important:** Always enter plan mode before making any code changes for non-trivial issues.

## Work Mode Assessment

After exploring the codebase and drafting the plan, assess whether this issue should be implemented as a **single session** or with an **agent team**. Include your recommendation in the plan.

### Use single session when:
- The issue touches **1-2 files** in one area (frontend-only or backend-only)
- The work is sequential (each step depends on the previous one)
- The issue is a bug fix, small refactor, or minor enhancement

### Recommend an agent team when:
- The plan touches **both frontend and backend** files
- The plan involves **3+ files across different areas** that can be worked in parallel
- The issue is a feature that needs design review (architect + critic) before implementation
- The user explicitly requests a team (e.g., "use teams" in their context)

### How to include the recommendation

Add a **"Work Mode"** section to your plan:

```markdown
## Work Mode

**Recommended: Agent Team** (or **Single Session**)

[1-2 sentence justification based on the criteria above]

Team composition (if recommending a team):
- architect + critic (design phase)
- frontend + backend (implementation phase)
- patterns-enforcer + test-enforcer + security-enforcer (enforcement phase)

File boundaries (if recommending a team):
| Agent | Files |
|-------|-------|
| frontend | [list of files] |
| backend | [list of files] |
```

If the user approves the plan and agrees to use a team, they will create the team in the next session. The plan should be detailed enough that the team lead can decompose it into team tasks without re-exploring the codebase.

### Team pipeline reference

See `.claude/rules/teams.md` for full details. The pipeline is:

1. **Design**: architect proposes → critic challenges → iterate until approved
2. **Implementation**: frontend + backend work in parallel on non-overlapping files
3. **Enforcement**: patterns-enforcer + test-enforcer + security-enforcer review independently, send fixes back to implementers if needed
4. **Wrap-up**: Lead closes beads issue, commits, and merges

The lead operates in **delegate mode** (coordination only, no direct implementation). Beads tracks the persistent issue; the team task list tracks session-scoped sub-tasks.
