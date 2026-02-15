---
description: Close a beads issue, commit changes, and merge back into the parent branch
argument-hint: <issue-id> (optional - will auto-detect from in_progress issues)
allowed-tools: Bash, Read, Edit, Glob, Grep
---

# Beads Commit: Close Issue and Merge

## Context Gathering

First, gather context about the current state:

1. **Current branch**: Run `git branch --show-current` and `git status`
2. **In-progress issue**: Run `bd list --status in_progress` to find the active issue
3. **Issue details**: Run `bd show <issue-id>` to review the issue requirements
4. **Recent commits**: Run `git log --oneline -10` to see commit history
5. **Parent branch**: Run `git log --oneline --graph -20` to identify the parent branch

If an issue ID is provided as an argument, use that. Otherwise, auto-detect from in_progress issues.

## Tasks

### 1. Close the Beads Issue

```bash
bd close <issue-id> --reason="<summary of what was implemented/fixed>"
```

The reason should be a concise summary of:
- What was implemented or fixed
- Key technical decisions made
- Any tests that were run/passed

### 2. Stage and Commit Changes

Review what needs to be committed:
```bash
git status
git diff --stat
```

Stage and commit with a conventional commit message:
```bash
git add -A
git commit -m "<type>: <description> (<issue-id>)"
```

**Commit types** (for semantic versioning):
- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `docs:` - Documentation only
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests

**Important**:
- Check `.gitignore` for files that shouldn't be committed
- Fix any pre-commit hook failures before proceeding
- Use British English in commit messages

### 3. Merge into Parent Branch

Identify the parent branch from the git history (do NOT assume it's `staging`):
```bash
git log --oneline --graph -20
```

Switch to parent and merge:
```bash
git checkout <parent-branch>
git merge <feature-branch> --no-edit
```

If there are merge conflicts:
1. Review each conflict carefully
2. For implementation files, prefer the feature branch version
3. For lock files, take feature branch version
4. Stage resolved files and complete the merge

### 4. Delete the Merged Branch

After verifying the merge is complete:
```bash
git branch -d <feature-branch>
```

Use `-d` (not `-D`) to ensure Git validates the branch was fully merged.

### 5. Suggest Next Issue

Run `bd ready` to find issues with no blockers, then recommend the next issue to work on:
```bash
bd ready
```

Consider priority (P0 > P1 > P2 > P3 > P4) and type (bugs before features) when suggesting.

## Output

Provide a summary:
- Issue ID and closure reason
- Commit hash and message
- Parent branch merged into
- Confirmation of branch deletion
- **Next recommended issue** with brief description
