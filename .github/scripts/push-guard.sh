#!/usr/bin/env bash
# Tripwire for the move the 2026 loader made: rewrite the newest commit on a
# laptop and force-push it with the saved git login. It flags, on any push:
#
#   - a force-push to any branch (history rewritten), and
#   - a commit on the default branch that GitHub did not sign. Every change
#     here should be a pull request merged on github.com, which GitHub signs,
#     so an unsigned commit came straight from a machine instead.
#
# Either one fails the run and opens an issue that tags the owner. It works on
# a private repo without a paid plan, where rulesets are not enforced.
#
# Runs in Actions (push-guard.yml) with a read-only token plus issues: write.
# Plain bash and the gh CLI; it runs none of the repo's own code.
set -uo pipefail

: "${REPO:?}" "${OWNER:?}" "${ACTOR:?}" "${REF_NAME:?}" "${DEFAULT_BRANCH:?}" "${BEFORE:?}" "${AFTER:?}"
FORCED="${FORCED:-false}"
DELETED="${DELETED:-false}"
ZERO=0000000000000000000000000000000000000000

if [ "$DELETED" = "true" ] || [ "$AFTER" = "$ZERO" ]; then
  echo "Branch $REF_NAME was deleted - nothing to check."
  exit 0
fi

problems=()

# 1. History rewritten. Dependabot rebasing its own branch is the one
#    expected force-push.
if [ "$FORCED" = "true" ]; then
  case "$ACTOR|$REF_NAME" in
    'dependabot[bot]|dependabot/'*) echo "Dependabot rebased its own branch - expected." ;;
    *) problems+=("**Force-push** to \`$REF_NAME\` by @$ACTOR - its history was rewritten (\`${BEFORE:0:7}\` → \`${AFTER:0:7}\`). That is how the 2026 loader hid itself.") ;;
  esac
fi

# 2. On the default branch, every new commit must carry GitHub's signature.
if [ "$REF_NAME" = "$DEFAULT_BRANCH" ]; then
  shas=""
  if [ "$BEFORE" != "$ZERO" ]; then
    # Works across a force-push too: the commits in AFTER that BEFORE lacks.
    shas=$(gh api "repos/$REPO/compare/$BEFORE...$AFTER" --jq '.commits[].sha' 2>/dev/null) || shas=""
  fi
  [ -n "$shas" ] || shas="$AFTER"
  for sha in $shas; do
    if ! line=$(gh api "repos/$REPO/commits/$sha" \
        --jq '[(.commit.verification.verified|tostring), .commit.verification.reason, .commit.committer.email] | @tsv'); then
      problems+=("Could not read commit \`$sha\` to check its signature - look at it by hand.")
      continue
    fi
    IFS=$'\t' read -r verified reason committer <<<"$line"
    if [ "$verified" != "true" ]; then
      problems+=("**Unsigned commit on \`$DEFAULT_BRANCH\`**: \`$sha\` (committer \`$committer\`, signature: \`$reason\`). It did not arrive as a pull request merged on github.com.")
    fi
  done
fi

if [ ${#problems[@]} -eq 0 ]; then
  echo "Push guard: nothing unusual about this push to $REF_NAME."
  exit 0
fi

list=$(printf -- '- %s\n' "${problems[@]}")
body="@$OWNER this push needs a look.

$list

Push: https://github.com/$REPO/compare/${BEFORE:0:12}...${AFTER:0:12} by @$ACTOR

**If you did not do this:** don't pull, clone or build \`$REF_NAME\`. Treat the computer that pushed as infected - wipe it and replace its keys, as in the recovery runbook - then put the branch back to its last good commit from github.com.

**If you did:** close this issue."

if ! gh issue create --repo "$REPO" --title "Push guard: check \`$REF_NAME\` (${AFTER:0:7})" --body "$body" >/dev/null; then
  echo "::warning::Could not open an issue - are Issues turned on for this repo?"
fi
for p in "${problems[@]}"; do echo "::error::$p"; done
exit 1
