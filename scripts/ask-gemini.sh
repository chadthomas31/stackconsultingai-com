#!/usr/bin/env bash
# Bash wrapper around Gemini CLI for headless multi-model orchestration.
# Reads GEMINI_API_KEY from env or falls back to GOOGLE_API_KEY in .env.local.
# Usage:
#   scripts/ask-gemini.sh "your prompt"
#   echo "context" | scripts/ask-gemini.sh "summarize"
#   scripts/ask-gemini.sh -m gemini-2.5-pro "prompt"
set -euo pipefail

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  ENV_FILE="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.env.local"
  if [[ -f "$ENV_FILE" ]]; then
    KEY=$(grep -E '^(GEMINI_API_KEY|GOOGLE_GENAI_API_KEY|GOOGLE_API_KEY)=' "$ENV_FILE" | head -1 | cut -d= -f2-)
    [[ -n "$KEY" ]] && export GEMINI_API_KEY="$KEY"
  fi
fi

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "ERROR: no GEMINI_API_KEY. Renew at https://aistudio.google.com/apikey and add to .env.local" >&2
  exit 1
fi

export GEMINI_CLI_TRUST_WORKSPACE=true
exec gemini -p "$@"
