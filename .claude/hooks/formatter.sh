#!/bin/bash

# Post-tool-use hook for formatting code files
# This script receives JSON input via stdin

# Timeout wrapper function
run_with_timeout() {
  local timeout_secs="$1"
  shift
  if command -v timeout &>/dev/null; then
    timeout "${timeout_secs}s" "$@"
  elif command -v gtimeout &>/dev/null; then
    gtimeout "${timeout_secs}s" "$@"
  else
    "$@"
  fi
}

# Check for jq
if ! command -v jq &>/dev/null; then
  echo "[Formatter Hook] jq not found, skipping hook." >&2
  exit 0
fi

# Read JSON from stdin
json_input=$(cat)

# Extract tool name and file path using jq
tool_name=$(echo "$json_input" | jq -r '.tool_name // empty')
file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // empty')

# Only process Write, Edit, and MultiEdit tools
if [[ "$tool_name" != "Write" && "$tool_name" != "Edit" && "$tool_name" != "MultiEdit" ]]; then
  exit 0
fi

# Check if file path exists
if [[ -z "$file_path" ]]; then
  exit 0
fi

# Check if file exists
if [[ ! -f "$file_path" ]]; then
  echo "[Formatter Hook] File does not exist: $file_path" >&2
  exit 0
fi

# Get file extension
extension="${file_path##*.}"
extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')

# Variable to track if manual intervention is needed
needs_intervention=""

# Format based on file type
case "$extension_lower" in
js | jsx | ts | tsx | mjs | cjs | json | jsonc | css)
  echo "[Formatter Hook] Processing file: $file_path" >&2
  BIOME_TIMEOUT=30

  project_dir="${CLAUDE_PROJECT_DIR:-.}"

  # Detect package manager from lockfile
  if [[ -f "$project_dir/bun.lock" ]] || [[ -f "$project_dir/bun.lockb" ]]; then
    pkg_cmd="bun"
    pkg_exec="bun run"
  elif [[ -f "$project_dir/pnpm-lock.yaml" ]]; then
    pkg_cmd="pnpm"
    pkg_exec="pnpm exec"
  elif [[ -f "$project_dir/package-lock.json" ]]; then
    pkg_cmd="npx"
    pkg_exec="npx"
  elif [[ -f "$project_dir/yarn.lock" ]]; then
    pkg_cmd="yarn"
    pkg_exec="yarn run"
  else
    echo "[Formatter Hook] No lockfile found in $project_dir" >&2
    exit 0
  fi

  if ! command -v "$pkg_cmd" &>/dev/null; then
    echo "[Formatter Hook] $pkg_cmd not found in PATH" >&2
    exit 0
  fi

  fix_output=$(run_with_timeout ${BIOME_TIMEOUT} $pkg_exec ultracite fix "$file_path" 2>&1)
  fix_exit_code=$?

  if [[ $fix_exit_code -eq 124 ]]; then
    echo "[Formatter Hook] WARNING: Lint/Fix timed out after ${BIOME_TIMEOUT}s" >&2
  elif [[ $fix_exit_code -ne 0 ]]; then
    echo "$fix_output" | sed 's/^/[ultracite] /' >&2
    needs_intervention="Issues found that could not be auto-fixed:\n$fix_output"
  else
    echo "[Formatter Hook] Successfully formatted/fixed: $file_path" >&2
  fi
  ;;
*)  # No formatter for other file types
  ;;
esac

# If manual intervention is needed, return it to Claude
if [[ -n "$needs_intervention" ]]; then
  echo "[Formatter Hook] Issues found that require manual intervention" >&2
  jq -n \
    --arg reason "$needs_intervention" \
    '{
            "decision": "block",
            "reason": $reason
        }'
  exit 0
fi

# All good, exit silently
exit 0
