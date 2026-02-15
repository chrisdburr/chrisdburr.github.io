#!/bin/bash

# security-scan.sh — Grep-based security pattern detection
#
# Checks for common security anti-patterns in JS/TS codebases.
# Designed as a fast pre-filter before deeper AI analysis.
#
# Usage:
#   bash .claude/scripts/security-scan.sh [--changed-only] [path...]
#
# Exit codes:
#   0 — clean (no findings)
#   1 — findings detected
#   2 — script error

set -euo pipefail

# --- Configuration -----------------------------------------------------------

SEVERITY_HIGH="HIGH"
SEVERITY_MEDIUM="MEDIUM"
SEVERITY_LOW="LOW"

findings_count=0
declare -a findings=()

# --- Helpers ------------------------------------------------------------------

add_finding() {
  local severity="$1" file="$2" line="$3" category="$4" message="$5"
  findings+=("${severity}|${file}:${line}|${category}|${message}")
  findings_count=$((findings_count + 1))
}

# --- Determine files to scan -------------------------------------------------

changed_only=false
scan_paths=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --changed-only) changed_only=true; shift ;;
    *) scan_paths+=("$1"); shift ;;
  esac
done

get_files() {
  local file_pattern='.*\.\(ts\|tsx\|js\|jsx\|mjs\|cjs\)$'

  if $changed_only && git rev-parse --is-inside-work-tree &>/dev/null; then
    # Files changed vs default branch or staged/unstaged
    {
      git diff --name-only --diff-filter=ACMR HEAD -- 2>/dev/null || true
      git diff --name-only --diff-filter=ACMR --cached -- 2>/dev/null || true
      git diff --name-only --diff-filter=ACMR -- 2>/dev/null || true
    } | grep "$file_pattern" | sort -u
  elif [[ ${#scan_paths[@]} -gt 0 ]]; then
    find "${scan_paths[@]}" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.cjs' \) \
      ! -path '*/node_modules/*' ! -path '*/.next/*' ! -path '*/dist/*' ! -path '*/.claude/*' 2>/dev/null
  else
    find . -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.cjs' \) \
      ! -path '*/node_modules/*' ! -path '*/.next/*' ! -path '*/dist/*' ! -path '*/.claude/*' 2>/dev/null
  fi
}

files=$(get_files)

if [[ -z "$files" ]]; then
  echo "No files to scan."
  exit 0
fi

# --- Security checks ---------------------------------------------------------

# Check a pattern across all files
# Args: pattern severity category message [exclude_pattern]
check_pattern() {
  local pattern="$1" severity="$2" category="$3" message="$4" exclude="${5:-}"

  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    [[ ! -f "$file" ]] && continue

    local results
    if [[ -n "$exclude" ]]; then
      results=$(grep -n "$pattern" "$file" 2>/dev/null | grep -v "$exclude" || true)
    else
      results=$(grep -n "$pattern" "$file" 2>/dev/null || true)
    fi

    while IFS= read -r match; do
      [[ -z "$match" ]] && continue
      local line_num="${match%%:*}"
      add_finding "$severity" "$file" "$line_num" "$category" "$message"
    done <<< "$results"
  done <<< "$files"
}

# 1. eval() usage
check_pattern 'eval(' "$SEVERITY_HIGH" "code-injection" "eval() can execute arbitrary code — use safer alternatives"

# 2. dangerouslySetInnerHTML
check_pattern 'dangerouslySetInnerHTML' "$SEVERITY_HIGH" "xss" "dangerouslySetInnerHTML bypasses React's XSS protection"

# 3. innerHTML assignment
check_pattern '\.innerHTML\s*=' "$SEVERITY_HIGH" "xss" "Direct innerHTML assignment risks XSS — use textContent or React"

# 4. Hardcoded secrets and credentials
check_pattern 'password\s*[:=]\s*["\x27][^"\x27]\{4,\}' "$SEVERITY_HIGH" "secrets" "Possible hardcoded password" '// \|/\* \|\.env\|process\.env\|schema\|Schema\|zod\|placeholder\|label\|type='
check_pattern 'secret\s*[:=]\s*["\x27][^"\x27]\{4,\}' "$SEVERITY_HIGH" "secrets" "Possible hardcoded secret" '// \|/\* \|\.env\|process\.env\|schema\|Schema\|zod'
check_pattern 'api[_-]\?key\s*[:=]\s*["\x27][^"\x27]\{8,\}' "$SEVERITY_HIGH" "secrets" "Possible hardcoded API key" '// \|/\* \|\.env\|process\.env\|schema\|Schema\|zod\|placeholder'
check_pattern 'token\s*[:=]\s*["\x27][A-Za-z0-9]\{20,\}' "$SEVERITY_HIGH" "secrets" "Possible hardcoded token" '// \|/\* \|\.env\|process\.env\|schema\|Schema\|zod\|csrf\|xsrf'

# 5. Raw SQL (Prisma)
check_pattern '\$queryRaw' "$SEVERITY_MEDIUM" "sql-injection" "Raw SQL query — ensure inputs are parameterised"
check_pattern '\$executeRaw' "$SEVERITY_MEDIUM" "sql-injection" "Raw SQL execution — ensure inputs are parameterised"
check_pattern '\$queryRawUnsafe' "$SEVERITY_HIGH" "sql-injection" "Unsafe raw SQL — highly vulnerable to injection"
check_pattern '\$executeRawUnsafe' "$SEVERITY_HIGH" "sql-injection" "Unsafe raw SQL execution — highly vulnerable to injection"

# 6. Insecure HTTP
check_pattern 'http://' "$SEVERITY_LOW" "insecure-transport" "HTTP URL — prefer HTTPS" 'localhost\|127\.0\.0\.1\|0\.0\.0\.0\|http://schemas\|http://www\.w3'

# 7. document.cookie access
check_pattern 'document\.cookie' "$SEVERITY_MEDIUM" "cookies" "Direct cookie access — use httpOnly cookies via server"

# 8. Disabled security headers
check_pattern 'X-Frame-Options.*ALLOW' "$SEVERITY_MEDIUM" "headers" "Permissive X-Frame-Options may allow clickjacking"

# 9. Console.log in production code (potential info leak)
check_pattern 'console\.log(' "$SEVERITY_LOW" "info-leak" "console.log in source — remove before production" 'test\.\|spec\.\|\.test\.\|\.spec\.\|__tests__'

# --- Output ------------------------------------------------------------------

if [[ $findings_count -eq 0 ]]; then
  echo "Security scan complete: no findings."
  exit 0
fi

echo "Security scan complete: $findings_count finding(s)"
echo ""
echo "severity|location|category|message"
echo "--------|--------|--------|-------"

# Sort findings: HIGH first, then MEDIUM, then LOW
for severity in "$SEVERITY_HIGH" "$SEVERITY_MEDIUM" "$SEVERITY_LOW"; do
  for finding in "${findings[@]}"; do
    if [[ "$finding" == "${severity}|"* ]]; then
      echo "$finding"
    fi
  done
done

exit 1
