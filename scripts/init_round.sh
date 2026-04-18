#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <round_no>" >&2
  exit 1
fi

ROUND_NO="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEMPLATE_DIR="${REPO_ROOT}/handoffs/templates"
ROUND_DIR="${REPO_ROOT}/handoffs/round_${ROUND_NO}"

if [[ ! -d "${TEMPLATE_DIR}" ]]; then
  echo "template directory not found: ${TEMPLATE_DIR}" >&2
  exit 1
fi

mkdir -p "${ROUND_DIR}"

for template in "${TEMPLATE_DIR}"/*.md; do
  file_name="$(basename "${template}")"
  target="${ROUND_DIR}/${file_name}"
  if [[ -e "${target}" ]]; then
    echo "skip: ${target}"
    continue
  fi
  cp "${template}" "${target}"
  echo "created: ${target}"
done
