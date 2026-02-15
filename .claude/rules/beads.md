# Beads Issue Tracking

Local git-based issue tracking via the `bd` CLI. Issues stored in `.beads/issues.jsonl`.

## Workflow (Single Developer)

**Do NOT use `bd sync`** - beads files are committed with normal git workflow.

```bash
# 1. Start work on an issue
git checkout staging && git pull
bd create --title="Fix X" --type=bug --priority=2
git checkout -b fix/issue-id_fix-x

# 2. Work on the issue
bd update <id> --status in_progress
# ... make code changes ...

# 3. Commit code (beads changes included or separate)
git add .
git commit -m "fix: ..."

# 4. Close the issue
bd close <id> --reason="..."
git add .beads/
git commit -m "chore: close beads issue"

# 5. Merge and push
git checkout staging
git merge fix/issue-id_fix-x
git push

# 6. After CI passes, merge staging -> main (remote)
# 7. Pull and cleanup
git checkout staging && git pull && git cleanup
```

## Configuration

- **Issue prefix**: `PP-`

## Essential Commands

### Finding Work
| Command | Description |
|---------|-------------|
| `bd ready` | Show issues ready to work (no blockers) |
| `bd list` | List all issues |
| `bd list --status open` | List open issues |
| `bd list --status in_progress` | List active work |
| `bd show <id>` | Show issue details with dependencies |
| `bd search <query>` | Search issues by text |

### Creating Issues
| Command | Description |
|---------|-------------|
| `bd create` | Interactive issue creation |
| `bd create --title="..." --type=bug --priority=2` | Quick create |

**Types**: `task`, `bug`, `feature`
**Priority**: 0-4 (0=critical, 2=medium, 4=backlog) - NOT "high"/"medium"/"low"

### Updating Issues
| Command | Description |
|---------|-------------|
| `bd update <id> --status in_progress` | Claim work |
| `bd update <id> --status blocked` | Mark as blocked |
| `bd update <id> --assignee=username` | Assign to someone |
| `bd update <id> --priority=1` | Change priority |

### Closing Issues
| Command | Description |
|---------|-------------|
| `bd close <id>` | Close an issue |
| `bd close <id> --reason="..."` | Close with explanation |
| `bd close <id1> <id2> ...` | Close multiple at once |
| `bd reopen <id>` | Reopen a closed issue |

### Dependencies
| Command | Description |
|---------|-------------|
| `bd dep add <issue> <depends-on>` | Add dependency |
| `bd dep remove <issue> <depends-on>` | Remove dependency |
| `bd blocked` | Show all blocked issues |
| `bd graph <id>` | Show dependency graph |

### Project Health
| Command | Description |
|---------|-------------|
| `bd stats` | Project statistics |
| `bd stale` | Show stale issues |
| `bd count` | Count issues matching filters |

### Labels & Comments
| Command | Description |
|---------|-------------|
| `bd label add <id> <label>` | Add label to issue |
| `bd label remove <id> <label>` | Remove label |
| `bd comments <id>` | View comments |
| `bd comments <id> --add "..."` | Add comment |

### Epics
| Command | Description |
|---------|-------------|
| `bd epic create --title="..."` | Create epic |
| `bd epic add <epic-id> <issue-id>` | Add issue to epic |
| `bd epic list` | List epics |

## Writing Good Issues

### Title Format
- **Bugs**: Problem + scope ("Rich-text formatting lost on case study publish")
- **Features**: User benefit ("Add dark mode theme option")
- **Tasks**: Clear action ("Implement ThemeProvider context")

### Description Template
Keep descriptions concise - high-level requirements only, not implementation details.

**Goal**: 1-2 sentence summary
**Requirements**: Bulleted acceptance criteria
**Done when**: Clear completion criteria

### Hierarchy
- **Epic**: Major initiative (e.g., "Phase 4: User Experience")
- **Task**: Individual work item under epic
- **Sub-task**: Only for complex tasks needing breakdown

### Labels
- Area: `frontend`, `backend`, `api`, `database`, `accessibility`
- Type: `bug`, `ux`, `performance`
