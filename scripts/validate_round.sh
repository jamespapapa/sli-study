#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <round_no>" >&2
  exit 1
fi

ROUND_NO="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROUND_DIR="${REPO_ROOT}/handoffs/round_${ROUND_NO}"

COMMON_SECTIONS=(
  "## 목적"
  "## 입력 문서 또는 참조 산출물"
  "## 수행 내용"
  "## 변경 파일 또는 산출물"
  "## 실행/검증 명령"
  "## 증적"
  "## 결정 사항"
  "## 다음 단계 지시사항"
  "## 열린 이슈 또는 가정"
)

REPORT_EXTRA_SECTIONS=(
  "## 상태"
  "## 총점"
  "## 주요 이슈"
)

REQUIRED_FILES=(
  "planner_to_designer.md"
  "designer_to_developer.md"
  "front-developer_to_tester.md"
  "back-developer_to_tester.md"
  "tester_report.md"
)

failures=0

section_has_content() {
  local file="$1"
  local section="$2"
  awk -v target="${section}" '
    $0 == target { in_section = 1; next }
    /^## / && in_section { exit }
    in_section && $0 !~ /^[[:space:]]*$/ {
      print
      found = 1
      exit
    }
    END { exit(found ? 0 : 1) }
  ' "${file}" >/dev/null
}

assert_file() {
  local file="$1"
  if [[ ! -f "${file}" ]]; then
    echo "missing file: ${file}" >&2
    failures=$((failures + 1))
    return 1
  fi
  return 0
}

if [[ ! -d "${ROUND_DIR}" ]]; then
  echo "round directory not found: ${ROUND_DIR}" >&2
  exit 1
fi

for required in "${REQUIRED_FILES[@]}"; do
  assert_file "${ROUND_DIR}/${required}" || true
done

for required in "${REQUIRED_FILES[@]}"; do
  file="${ROUND_DIR}/${required}"
  [[ -f "${file}" ]] || continue

  if grep -Eq 'REPLACE_ME|작성 예정|TODO|TBD' "${file}"; then
    echo "placeholder text found: ${file}" >&2
    failures=$((failures + 1))
  fi

  for section in "${COMMON_SECTIONS[@]}"; do
    if ! section_has_content "${file}" "${section}"; then
      echo "missing or empty section '${section}' in ${file}" >&2
      failures=$((failures + 1))
    fi
  done

  if [[ "${required}" == "tester_report.md" ]]; then
    for section in "${REPORT_EXTRA_SECTIONS[@]}"; do
      if ! section_has_content "${file}" "${section}"; then
        echo "missing or empty section '${section}' in ${file}" >&2
        failures=$((failures + 1))
      fi
    done

    status="$(awk '
      $0 == "## 상태" { in_section = 1; next }
      /^## / && in_section { exit }
      in_section && $0 !~ /^[[:space:]]*$/ {
        print
        exit
      }
    ' "${file}")"

    if [[ ! "${status}" =~ ^(PASS|REVISE|BLOCKED)$ ]]; then
      echo "invalid tester status '${status}' in ${file}" >&2
      failures=$((failures + 1))
    fi
  fi
done

if [[ "${failures}" -gt 0 ]]; then
  echo "round ${ROUND_NO} validation failed with ${failures} issue(s)." >&2
  exit 1
fi

echo "round ${ROUND_NO} validation passed."
