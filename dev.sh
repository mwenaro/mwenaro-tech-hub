#!/usr/bin/env bash
# dev.sh — Run all Mwenaro apps locally
# Usage: ./dev.sh [hub] [academy] [talent] [labs]
#   No args = runs all four apps.

set -e

# ── Ports ──────────────────────────────────────────────────────────────
PORT_HUB=3000
PORT_ACADEMY=3001
PORT_TALENT=3002
PORT_LABS=3003

# ── Colours ────────────────────────────────────────────────────────────
C_HUB="\033[0;36m"      # cyan
C_ACADEMY="\033[0;32m"  # green
C_TALENT="\033[0;33m"   # yellow
C_LABS="\033[0;35m"     # magenta
C_RESET="\033[0m"
C_BOLD="\033[1m"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS=()

prefix_log() {
  local color="$1"
  local label="$2"
  local port="$3"
  while IFS= read -r line; do
    echo -e "${color}${C_BOLD}[${label}:${port}]${C_RESET} ${line}"
  done
}

start_app() {
  local name="$1"
  local port="$2"
  local color="$3"
  local dir="$ROOT/$name"

  if [ ! -d "$dir" ]; then
    echo -e "\033[0;31m[dev.sh] Directory '$name' not found — skipping.\033[0m"
    return
  fi

  echo -e "${color}${C_BOLD}▶ Starting ${name} on http://localhost:${port}${C_RESET}"
  (cd "$dir" && PORT=$port npx next dev --port "$port" 2>&1) | prefix_log "$color" "$name" "$port" &
  PIDS+=($!)
}

# ── Determine which apps to run ─────────────────────────────────────────
APPS=("$@")
if [ ${#APPS[@]} -eq 0 ]; then
  APPS=(hub academy talent labs)
fi

echo ""
echo -e "${C_BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo -e "${C_BOLD}  Mwenaro Local Dev${C_RESET}"
echo -e "${C_BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"

for app in "${APPS[@]}"; do
  case "$app" in
    hub)     start_app hub     $PORT_HUB     "$C_HUB"     ;;
    academy) start_app academy $PORT_ACADEMY "$C_ACADEMY" ;;
    talent)  start_app talent  $PORT_TALENT  "$C_TALENT"  ;;
    labs)    start_app labs    $PORT_LABS    "$C_LABS"    ;;
    *)       echo -e "\033[0;31m[dev.sh] Unknown app '$app' — skipping.\033[0m" ;;
  esac
done

echo ""
echo -e "  ${C_HUB}Hub${C_RESET}     → http://localhost:${PORT_HUB}"
echo -e "  ${C_ACADEMY}Academy${C_RESET} → http://localhost:${PORT_ACADEMY}"
echo -e "  ${C_TALENT}Talent${C_RESET}  → http://localhost:${PORT_TALENT}"
echo -e "  ${C_LABS}Labs${C_RESET}    → http://localhost:${PORT_LABS}"
echo ""
echo -e "  Press ${C_BOLD}Ctrl+C${C_RESET} to stop all apps."
echo ""

# ── Graceful shutdown ───────────────────────────────────────────────────
cleanup() {
  echo -e "\n\033[0;31m[dev.sh] Stopping all apps...\033[0m"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo -e "\033[0;31m[dev.sh] All stopped.\033[0m"
}
trap cleanup INT TERM

wait
