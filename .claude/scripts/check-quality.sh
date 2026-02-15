#!/bin/bash

# check-quality.sh — Orchestrate lint, type check, and test suite
#
# Runs each check independently (doesn't stop on first failure).
# Auto-detects package manager from lockfiles.
# Reads commands from rules/commands.md or falls back to defaults.
#
# Usage:
#   bash .claude/scripts/check-quality.sh [--lint] [--types] [--test]
#   (no flags = run all checks)
#
# Exit codes:
#   0 — all checks pass
#   1 — one or more checks failed

set -uo pipefail

# --- Configuration -----------------------------------------------------------

project_dir="${CLAUDE_PROJECT_DIR:-.}"
rules_file=""
overall_exit=0

# Look for commands.md in .claude/rules/
for candidate in "$project_dir/.claude/rules/commands.md" ".claude/rules/commands.md"; do
  if [[ -f "$candidate" ]]; then
    rules_file="$candidate"
    break
  fi
done

# --- Parse flags --------------------------------------------------------------

run_lint=false
run_types=false
run_test=false
explicit_flags=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lint) run_lint=true; explicit_flags=true; shift ;;
    --types) run_types=true; explicit_flags=true; shift ;;
    --test) run_test=true; explicit_flags=true; shift ;;
    *) echo "Unknown flag: $1"; exit 2 ;;
  esac
done

# If no explicit flags, run everything
if ! $explicit_flags; then
  run_lint=true
  run_types=true
  run_test=true
fi

# --- Detect package manager ---------------------------------------------------

detect_pkg_manager() {
  if [[ -f "$project_dir/bun.lock" ]] || [[ -f "$project_dir/bun.lockb" ]]; then
    echo "bun"
  elif [[ -f "$project_dir/pnpm-lock.yaml" ]]; then
    echo "pnpm"
  elif [[ -f "$project_dir/package-lock.json" ]]; then
    echo "npm"
  elif [[ -f "$project_dir/yarn.lock" ]]; then
    echo "yarn"
  else
    echo "npm"
  fi
}

pkg_manager=$(detect_pkg_manager)

pkg_run() {
  case "$pkg_manager" in
    bun)  bun run "$@" ;;
    pnpm) pnpm run "$@" ;;
    yarn) yarn run "$@" ;;
    npm)  npm run "$@" ;;
  esac
}

pkg_exec() {
  case "$pkg_manager" in
    bun)  bun run "$@" ;;
    pnpm) pnpm exec "$@" ;;
    yarn) yarn run "$@" ;;
    npm)  npx "$@" ;;
  esac
}

# --- Extract commands from rules/commands.md ----------------------------------

# Extracts the command from a markdown table row matching a given action
# e.g. extract_command "Lint (Check)" → "bunx biome check"
extract_command() {
  local action="$1"
  if [[ -z "$rules_file" ]]; then
    return 1
  fi

  local cmd
  cmd=$(grep -i "| *${action} *|" "$rules_file" 2>/dev/null | head -1 | sed 's/.*| *`\([^`]*\)`.*/\1/')

  # Skip if it's still a [TODO] placeholder
  if [[ "$cmd" == *"[TODO"* ]] || [[ -z "$cmd" ]]; then
    return 1
  fi

  echo "$cmd"
}

# --- Determine commands -------------------------------------------------------

lint_check_cmd=""
type_check_cmd=""
test_cmd=""

# Try to read from commands.md first
lint_check_cmd=$(extract_command "Lint (Check)" 2>/dev/null) || true
type_check_cmd=$(extract_command "Type Check" 2>/dev/null) || true
test_cmd=$(extract_command "Test (All)" 2>/dev/null) || true

# Fall back to conventional defaults if not found
if [[ -z "$lint_check_cmd" ]]; then
  # Auto-detect linter
  if [[ -f "$project_dir/biome.json" ]] || [[ -f "$project_dir/biome.jsonc" ]]; then
    lint_check_cmd="${pkg_manager}x biome check"
  elif grep -q '"ultracite"' "$project_dir/package.json" 2>/dev/null; then
    lint_check_cmd="$(pkg_exec ultracite check 2>/dev/null && echo 'ultracite check' || echo '')"
    lint_check_cmd="${pkg_manager}x ultracite check"
  elif [[ -f "$project_dir/eslint.config.mjs" ]] || [[ -f "$project_dir/eslint.config.js" ]] || [[ -f "$project_dir/.eslintrc.json" ]]; then
    lint_check_cmd="${pkg_manager}x eslint ."
  fi
fi

if [[ -z "$type_check_cmd" ]]; then
  if [[ -f "$project_dir/tsconfig.json" ]]; then
    type_check_cmd="${pkg_manager}x tsc --noEmit"
  fi
fi

if [[ -z "$test_cmd" ]]; then
  # Auto-detect test runner
  if [[ -f "$project_dir/vitest.config.ts" ]] || [[ -f "$project_dir/vitest.config.js" ]]; then
    test_cmd="${pkg_manager}x vitest run"
  elif [[ -f "$project_dir/jest.config.ts" ]] || [[ -f "$project_dir/jest.config.js" ]]; then
    test_cmd="${pkg_manager}x jest"
  elif grep -q '"test"' "$project_dir/package.json" 2>/dev/null; then
    test_cmd="${pkg_manager} run test"
  fi
fi

# --- Run checks ---------------------------------------------------------------

run_check() {
  local name="$1" cmd="$2"

  if [[ -z "$cmd" ]]; then
    echo "SKIP  $name (no command detected)"
    return 0
  fi

  echo "RUN   $name: $cmd"
  local output exit_code
  output=$(eval "$cmd" 2>&1) || true
  exit_code=${PIPESTATUS[0]:-$?}

  if [[ $exit_code -eq 0 ]]; then
    echo "PASS  $name"
  else
    echo "FAIL  $name (exit code $exit_code)"
    echo "$output" | head -30
    overall_exit=1
  fi
  echo ""
}

echo "=== Quality Check ==="
echo "Package manager: $pkg_manager"
echo ""

if $run_lint; then
  run_check "Lint" "$lint_check_cmd"
fi

if $run_types; then
  run_check "Type Check" "$type_check_cmd"
fi

if $run_test; then
  run_check "Test Suite" "$test_cmd"
fi

# --- Summary ------------------------------------------------------------------

echo "=== Summary ==="
if [[ $overall_exit -eq 0 ]]; then
  echo "All checks passed."
else
  echo "One or more checks failed."
fi

exit $overall_exit
