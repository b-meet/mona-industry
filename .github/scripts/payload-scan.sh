#!/usr/bin/env bash
# Tripwire for the loader that was smuggled into this repo's build config
# (the PolinRider campaign, 2026). It appends obfuscated JavaScript to a
# config file after a long run of spaces, so the line looks normal in an
# editor, and often adds `createRequire(import.meta.url)` at the top so the
# payload can call require() from an ES module. Any build, dev server, test
# run or git hook that loads the file then runs it.
#
# Plain bash and grep on purpose: it must never load the project's own
# JavaScript, because that is exactly what an infected repo wants you to do.
# Run it BEFORE `npm ci` / a build. Exit 1 = something to look at.
#
#   bash .github/scripts/payload-scan.sh          # tracked files in this checkout
set -uo pipefail

found=0
flag() { echo "::error file=$1::$2"; found=1; }

# Tracked files only, skipping lockfiles, minified bundles, build output and
# this script (it spells out the markers it looks for).
mapfile -t files < <(git ls-files | grep -vE '(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$|(^|/)(node_modules|dist[^/]*|build|\.next|out)/|\.min\.(js|css)$|^\.github/scripts/payload-scan\.sh$')

code=()
for f in "${files[@]}"; do
  case "$f" in
    *.js|*.mjs|*.cjs|*.jsx|*.ts|*.mts|*.cts|*.tsx|*.json|*.sh|*.bat|*.cmd|*.ps1|*.yml|*.yaml) code+=("$f") ;;
  esac
  case "$f" in
    *.bat|*.cmd|*.ps1) flag "$f" "Windows script in the repo - the campaign's git re-push helper is a .bat (temp_auto_push.bat / config.bat)" ;;
  esac
done
if [ ${#code[@]} -eq 0 ]; then echo "No source files to scan."; exit 0; fi

# 1. Known markers of the loader and its decoder (every variant seen so far).
q="[\"']"
markers="global\.[A-Za-z_]{1,3}[[:space:]]*=[[:space:]]*${q}[0-9]+-[0-9]+-|global\[${q}[!_A-Za-z]{1,2}${q}\][[:space:]]*=|_\\\$_[0-9a-f]{4}[[:space:]]*=|fromCharCode\(127\)|eval\([[:space:]]*${q}global\.|rmcej%otb%|Cot%3t=shtP|temp_auto_push|LAST_COMMIT_DATE|LAST_COMMIT_TIME"
while IFS= read -r hit; do
  flag "${hit%%:*}" "loader marker on line $(cut -d: -f2 <<<"$hit")"
done < <(grep -nEH -- "$markers" "${code[@]}" 2>/dev/null)

# 2. Code hidden to the right of a long run of whitespace on the same line
#    (the loader used ~2,000 spaces). Indentation has nothing before it, and
#    aligned comments never need 150 spaces, so neither trips this.
while IFS= read -r hit; do
  flag "${hit%%:*}" "code hidden after a long run of whitespace on line $(cut -d: -f2 <<<"$hit") - open the file and scroll right"
done < <(grep -nEH -- '[^[:space:]][[:space:]]{150,}[^[:space:]]' "${code[@]}" 2>/dev/null)

# 2b. A very long line in hand-written JS/TS: a minified payload needs no padding.
scripts=()
for f in "${code[@]}"; do
  case "$f" in *.js|*.mjs|*.cjs|*.jsx|*.ts|*.mts|*.cts|*.tsx) scripts+=("$f") ;; esac
done
if [ ${#scripts[@]} -gt 0 ]; then
  while IFS= read -r hit; do
    flag "${hit%%:*}" "line $(cut -d: -f2 <<<"$hit") is over 3,000 characters - hand-written code never is"
  done < <(grep -nEH -- '^.{3000,}$' "${scripts[@]}" 2>/dev/null | cut -d: -f1,2)
fi

# 3. createRequire in a config file: the loader adds it so it can call require().
configs=()
for f in "${code[@]}"; do
  case "${f##*/}" in *.config.js|*.config.mjs|*.config.cjs|*.config.ts|*.config.mts|*.config.cts) configs+=("$f") ;; esac
done
if [ ${#configs[@]} -gt 0 ]; then
  while IFS= read -r f; do
    flag "$f" "createRequire(import.meta.url) in a config file - the loader adds this, and no config here needs it"
  done < <(grep -lE 'createRequire\(import\.meta\.url\)' -- "${configs[@]}" 2>/dev/null)
fi

# 4. Editor tasks that run by themselves when the folder is opened.
for f in "${files[@]}"; do
  case "$f" in
    */.vscode/tasks.json|.vscode/tasks.json)
      if grep -q 'folderOpen' "$f"; then flag "$f" "VS Code task set to run on folder open"; fi ;;
  esac
done

if [ "$found" -ne 0 ]; then
  echo
  echo "Payload scan FAILED. Do not install, build or run this checkout."
  echo "Compare each flagged file with its last known-clean version."
  exit 1
fi
echo "Payload scan: clean (${#code[@]} source files)."
