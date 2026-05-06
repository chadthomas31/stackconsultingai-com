#!/usr/bin/env bash
# Vertex-first Gemini wrapper.
# Default: stack-consulting-ai-495420 / us-central1 / gemini-2.5-flash via ADC + @google/genai.
# Fallback: gemini CLI with API key (AI Studio key from .env.local) when Vertex unavailable.
# Usage:
#   scripts/ask-gemini.sh "prompt"
#   echo "context" | scripts/ask-gemini.sh "summarize"
#   scripts/ask-gemini.sh -m gemini-2.5-pro "prompt"
# Force fallback: STACK_VERTEX_DISABLE=1 scripts/ask-gemini.sh "prompt"
set -euo pipefail
set +x

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
VERTEX_SCRIPT="$REPO_ROOT/scripts/ask-gemini.mjs"

vertex_ready() {
  [[ "${STACK_VERTEX_DISABLE:-0}" != "1" ]] || return 1
  command -v gcloud >/dev/null 2>&1 || return 1
  command -v node >/dev/null 2>&1 || return 1
  [[ -f "$VERTEX_SCRIPT" ]] || return 1
  gcloud auth application-default print-access-token >/dev/null 2>&1 || return 1
  return 0
}

if vertex_ready; then
  # Pin project — ignore leaked GOOGLE_CLOUD_PROJECT from parent shell (e.g. stack-web-audit).
  # Override with STACK_GEMINI_PROJECT/STACK_GEMINI_LOCATION when needed.
  export GOOGLE_CLOUD_PROJECT="${STACK_GEMINI_PROJECT:-stack-consulting-ai-495420}"
  export GOOGLE_CLOUD_LOCATION="${STACK_GEMINI_LOCATION:-us-central1}"
  unset GOOGLE_API_KEY GEMINI_API_KEY  # prevent SDK from switching to API-key path
  exec node "$VERTEX_SCRIPT" "$@"
fi

# Fallback: AI Studio API key + gemini CLI
if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  ENV_FILE="$REPO_ROOT/.env.local"
  if [[ -f "$ENV_FILE" ]]; then
    for KEY_NAME in GEMINI_API_KEY GEMINI_API_KEY_BACKUP GOOGLE_GENAI_API_KEY GOOGLE_API_KEY; do
      while IFS= read -r LINE || [[ -n "$LINE" ]]; do
        [[ "$LINE" == "$KEY_NAME="* ]] || continue
        KEY_VALUE="${LINE#*=}"
        [[ -n "$KEY_VALUE" ]] || continue
        export GEMINI_API_KEY="$KEY_VALUE"
        break 2
      done < "$ENV_FILE"
    done
  fi
fi

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "ERROR: Vertex not configured and no GEMINI_API_KEY in .env.local." >&2
  echo "  Vertex fix: gcloud auth application-default login --account=admin@2105.io" >&2
  echo "  Key fix:    add GEMINI_API_KEY to .env.local (https://aistudio.google.com/apikey)" >&2
  exit 1
fi

export GEMINI_CLI_TRUST_WORKSPACE=true
exec gemini -p "$@"
