# AGENTS.md

이 레포는 웹 전용 프론트엔드/백엔드 프로젝트를 5개의 서브에이전트로 라운드 단위 오케스트레이션하는 예시다.
프론트엔드는 `frontend/`, 백엔드는 `backend/` 에서 작업한다고 가정한다.

## 기본 원칙

- 에이전트 구성은 `.codex/agents` 하위의 `planner`, `designer`, `front-developer`, `back-developer`, `tester` 5개로 고정한다.
- 실행 순서는 항상 `planner -> designer -> front-developer + back-developer (병렬) -> tester` 이다.
- 병렬 실행은 개발 단계의 `front-developer` 와 `back-developer` 조합에 한해서만 허용한다.
- 각 단계는 이전 단계의 핸드오프 문서와 그 문서가 참조하는 증적을 읽고 작업한다.
- 상위 오케스트레이터는 라운드 시작 전에 `./scripts/init_round.sh {ROUND_NO}` 를 실행해 핸드오프 파일을 준비한다.
- 상위 오케스트레이터는 단계 완료 후 필수 핸드오프 파일 존재 여부와 내용 충족 여부를 확인한다.
- 라운드 종료 시에는 `./scripts/validate_round.sh {ROUND_NO}` 로 문서 완결성을 검증한다.

## 단계별 책임

### 1. planner (`.codex/agents/planner.toml`)

- 요구사항을 해석하고 이번 라운드의 범위와 완료 정의를 확정한다.
- 프론트엔드/백엔드 책임 경계와 병렬 작업 조건을 먼저 확정한다.
- 다음 단계가 바로 구현에 들어갈 수 있도록 작업 분할과 위험요소를 정리한다.
- `handoffs/round_{ROUND_NO}/planner_to_designer.md` 를 작성한다.

### 2. designer (`.codex/agents/designer.toml`)

- `planner_to_designer.md` 와 planner가 참조한 증적을 입력으로 사용한다.
- UI/UX, 문서 구조, 구현 우선순위, 표현 규칙을 정리한다.
- front/back 개발자가 병렬로 움직일 수 있도록 책임 경계를 명확히 나눈다.
- `handoffs/round_{ROUND_NO}/designer_to_developer.md` 를 작성한다.

### 3. front-developer + back-developer (`.codex/agents/front-developer.toml`, `.codex/agents/back-developer.toml`)

- 두 에이전트는 `designer_to_developer.md` 를 공통 입력으로 사용한다.
- 개발 단계에서만 두 에이전트를 병렬 실행할 수 있다.
- 각 에이전트는 자신이 수정한 파일, 실행한 명령, 확인한 증적, 남은 이슈를 별도 문서에 기록한다.
- 산출물은 각각 `front-developer_to_tester.md`, `back-developer_to_tester.md` 이다.
- 오케스트레이터는 두 문서가 모두 준비되기 전까지 `tester` 를 호출하지 않는다.

### 4. tester (`.codex/agents/tester.toml`)

- `front-developer_to_tester.md`, `back-developer_to_tester.md` 와 두 문서가 참조하는 증적을 입력으로 사용한다.
- 프론트엔드와 백엔드의 실제 검증 결과를 확인하고, 실패 내역과 증적을 남긴다.
- 결과는 `PASS`, `REVISE`, `BLOCKED` 중 하나로 판정한다.
- 총점은 추세 파악용 참고치이며, 종료 여부는 상태 판정과 열린 이슈의 심각도로 결정한다.
- 최종 보고서를 `handoffs/round_{ROUND_NO}/tester_report.md` 에 작성한다.

## 핸드오프 규칙

- 모든 핸드오프 문서는 Markdown 파일로 작성한다.
- 새 라운드 시작 시 템플릿은 `handoffs/templates/` 에서 복사한다.
- 실제 라운드 문서는 반드시 `handoffs/round_{ROUND_NO}/` 디렉터리에 둔다.
- 각 문서는 최소한 아래 항목을 포함한다.
- `## 목적`
- `## 입력 문서 또는 참조 산출물`
- `## 수행 내용`
- `## 변경 파일 또는 산출물`
- `## 실행/검증 명령`
- `## 증적`
- `## 결정 사항`
- `## 다음 단계 지시사항`
- `## 열린 이슈 또는 가정`
- `tester_report.md` 는 추가로 `## 상태`, `## 총점`, `## 주요 이슈` 를 포함한다.
- `REPLACE_ME`, `작성 예정`, `TODO`, `TBD` 같은 placeholder가 남아 있으면 다음 단계로 넘기지 않는다.

## 오케스트레이션 규칙

- 라운드 시작: `./scripts/init_round.sh {ROUND_NO}`
- planner 완료 후: `planner_to_designer.md` 확인
- designer 완료 후: `designer_to_developer.md` 확인
- front/back 완료 후: `front-developer_to_tester.md`, `back-developer_to_tester.md` 두 문서 모두 확인
- tester 완료 후: `tester_report.md` 확인
- 라운드 종료 검증: `./scripts/validate_round.sh {ROUND_NO}`

## 종료 조건

- `tester_report.md` 의 `## 상태` 가 `PASS` 이다.
- 해당 라운드의 필수 핸드오프 문서가 모두 존재하고 검증 스크립트를 통과한다.
- 프론트엔드와 백엔드의 필수 검증 명령 결과가 모두 성공으로 기록되어 있다.

## 계속 진행 조건

- `## 상태` 가 `REVISE` 이다.
- 필수 핸드오프가 누락되었거나 placeholder가 남아 있다.
- 실행 가능한 검증 명령 중 실패가 있다.

## 중단 조건

- `## 상태` 가 `BLOCKED` 이다.
- 동일한 blocker가 2개 라운드 연속 반복되며, 다음 라운드에서 달라지는 실행 계획이 없다.

## 금지 사항

- `designer`, `front-developer`, `back-developer`, `tester` 를 `planner` 보다 먼저 호출하지 않는다.
- 이전 단계 핸드오프와 증적 확인 없이 다음 단계를 호출하지 않는다.
- 개발 단계 외의 병렬 호출을 하지 않는다.
- 문서만 존재하는데 실행한 것처럼 검증 결과를 꾸미지 않는다.
- 구두 요약만으로 다음 단계에 넘기지 않는다. 반드시 지정된 Markdown 핸드오프 파일을 사용한다.
