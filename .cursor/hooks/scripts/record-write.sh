#!/usr/bin/env bash
# afterFileEdit hook — logs every file write so the stop gate knows whether
# protocol-enforced reviews are required before the agent may finish.

set -euo pipefail
# shellcheck source=lib.sh
. "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

read_stdin

state_update '
import os, pathlib, re, time
file_path = INPUT.get("file_path") or INPUT.get("path") or ""
def path_variants(candidate: str) -> list[str]:
    normalized = candidate.replace("\\", "/")
    variants = [normalized]
    for marker in ("/.cursor/",):
        if marker in normalized:
            variants.append(".cursor/" + normalized.split(marker, 1)[1])
    return list(dict.fromkeys(variants))
def matches_any_path_pattern(candidate: str, patterns: list[str]) -> bool:
    return any(re.search(pattern, variant) for variant in path_variants(candidate) for pattern in patterns)
def is_protected_path(candidate: str) -> bool:
    return matches_any_path_pattern(candidate, CFG.get("protected_path_patterns", []))
def is_memory_path(candidate: str) -> bool:
    cli = os.environ.get("AGENT_PACK_MEMORY_CLI")
    memory_dir = pathlib.Path(cli).resolve().parent if cli else None
    try:
        resolved = pathlib.Path(candidate).resolve()
    except Exception:
        resolved = None
    for mem in CFG["memory_paths"]:
        try:
            if resolved and resolved == pathlib.Path(mem).resolve():
                return True
        except Exception:
            pass
        if candidate.replace("\\", "/") == mem.replace("\\", "/"):
            return True
        if memory_dir and resolved:
            try:
                if resolved == memory_dir / pathlib.Path(mem).name:
                    return True
            except Exception:
                pass
    return False
if not file_path:
    pass
else:
    entry = {"path": file_path, "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    actives = [
        c.get("slug")
        for c in (STATE.get("subagent_calls") or [])
        if c.get("readonly") and not c.get("completed") and not c.get("stopped_at")
    ]
    violator_slugs = list(dict.fromkeys([a for a in actives if a]))
    # Memory files are tracked separately from source writes.
    if is_memory_path(file_path):
        STATE["memory_updates"].append(entry)
        if violator_slugs:
            violation = {
                **entry,
                "violator_slugs": violator_slugs,
            }
            STATE.setdefault("readonly_violations", []).append(violation)
    else:
        # Skip infrastructure paths (generated, vendored, or hook-internal).
        skip = matches_any_path_pattern(file_path, CFG["skip_path_patterns"]) and not is_protected_path(file_path)
        if skip and violator_slugs:
            violation = {
                **entry,
                "violator_slugs": violator_slugs,
            }
            STATE.setdefault("readonly_violations", []).append(violation)
        if not skip:
            STATE["writes"].append(entry)

            # Capability-scoping: if any readonly subagent is currently
            # active (between subagentStart and subagentStop), the write
            # is a violation.  The gate refuses to finish the turn until
            # the violation is acknowledged.
            if violator_slugs:
                violation = {
                    **entry,
                    "violator_slugs": violator_slugs,
                }
                STATE.setdefault("readonly_violations", []).append(violation)
'

log_event "afterFileEdit: $(json_get file_path)"
emit_allow
