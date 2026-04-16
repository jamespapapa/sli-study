# AGENTS.md

이 레포는 기본적으로 5개의 서브에이전트를 순차 호출하는 구조를 사용한다.

## 기본 원칙

- 에이전트 구성은 현재 레포의 .codex/agents 하위에 있는 `planner`, `designer`, `front-developer`, `back-developer`, `tester` 5개로 고정한다.
- 실행 순서는 항상 `planner -> designer -> front-developer + back-developer (병렬 실행) -> tester` 이다.
- 병렬 호출은 front-developer와 back-developer 외에는 금지한다.
- 각 단계는 반드시 이전 단계의 핸드오프 문서를 읽고, 자신의 결과를 다음 단계용 핸드오프 문서로 작성한 뒤 종료한다.
- 다음 단계 에이전트는 이전 단계가 완료되기 전에는 호출하지 않는다.
- 상위 오케스트레이터 에이전트는 각 단계 종료 후 산출물과 핸드오프 문서가 존재하는지 확인한 다음 다음 서브에이전트를 호출한다.

## 기술 스택
- backend : Kotlin/springboot/gradle/jpa/H2 database(필요시)
- frontend : Next.js/Tailwind CSS

## 단계별 책임

### 1. planner (.codex/agents/planner.toml)

- 요구사항을 해석하고 작업 범위를 확정한다.
- 구현 계획, 제약사항, 확인이 필요한 리스크를 정리한다.
- `handoffs/round_{ROUND_NO}/planner_to_designer.md` 를 작성한다.

### 2. designer (.codex/agents/designer.toml)

- `handoffs/round_{ROUND_NO}/planner_to_designer.md` 를 입력으로 사용한다.
- UX/UI 방향, 화면 구조, 컴포넌트 규칙, 표현 상세를 정리한다.
- 구현자가 바로 사용할 수 있는 설계 지침으로 변환한다.
- `handoffs/round_{ROUND_NO}/designer_to_developer.md` 를 작성한다.

### 3. front-developer (.codex/agents/front-developer.toml) + back-developer (.codex/agents/back-developer.toml)

- `handoffs/round_{ROUND_NO}/designer_to_developer.md` 를 입력으로 사용한다.
- 실제 코드 변경을 수행한다.
- front-developer , back-developer는 동시에 소환된다. Rest api 인터페이스가 명확한지 더블체크한 뒤, 두 에이전트를 동시에 소환해라.(중요))
- 구현 내용, 남은 이슈, 테스트 포인트를 정리한다.
- front,back 각각 frontend , backend 개별 디렉토리에서 작업한다.
- `handoffs/round_{ROUND_NO}/front-developer_to_tester.md` 와 `handoffs/round_{ROUND_NO}/back-developer_to_tester.md` 를 작성한다.

### 4. tester (.codex/agents/tester.toml)

- `handoffs/round_{ROUND_NO}/front-developer_to_tester.md` + `handoffs/round_{ROUND_NO}/back-developer_to_tester.md` 를 입력으로 사용한다.
- Playwright 기반 UI 테스트에 주력한다. 브라우저의 top~bottom까지 스크롤을 내리면서 사용자가 할 수 있는 모든 동작을 테스트해본다. playwright-report 포함 테스트 실행 증적을 라운드별 handoff 디렉토리에 필수로 남겨야 한다.
- 결과, 실패 내역, 추가 수정 필요 여부를 정리한다.
- 최종 검증 보고서를 `handoffs/round_{ROUND_NO}/tester_report.md` 에 작성한다.

## 핸드오프 규칙

- 모든 핸드오프 문서는 Markdown 파일로 작성한다.
- 핸드오프 문서는 반드시 `handoffs/round_{ROUND_NO}/` 디렉터리에 둔다.
- 초기의 핸드오프 문서는 빈 템플릿이다.
- 각 핸드오프 문서는 아래 항목을 포함한다.
  - 목적
  - 입력 문서 또는 참조 산출물
  - 수행 내용
  - 결정 사항
  - 다음 단계 지시사항
  - 열린 이슈 또는 가정
- 핸드오프 문서가 비어 있거나 항목이 누락된 상태로 다음 단계로 넘기지 않는다.

## 오케스트레이션 규칙

- 상위 에이전트는 항상 `planner` 를 먼저 서브에이전트로 호출한다.
- `planner` 완료 후 `handoffs/round_{ROUND_NO}/planner_to_designer.md` 확인 뒤 `designer` 를 호출한다.
- `designer` 완료 후 `handoffs/round_{ROUND_NO}/designer_to_developer.md` 확인 뒤 `developer` 를 호출한다.
- `front-developer` + `back-developer` 완료 후 `handoffs/round_{ROUND_NO}/developer_to_tester.md` 확인 뒤 `tester` 를 호출한다.
- `tester` 완료 후 `handoffs/round_{ROUND_NO}/tester_report.md` 를 최종 결과로 취급한다.

## 금지 사항

- `designer`, `developer`, `tester` 를 `planner` 보다 먼저 호출하지 않는다.
- 이전 단계 핸드오프 없이 다음 단계를 호출하지 않는다.
- 동일 단계의 복수 서브에이전트를 동시에 실행하지 않는다.
- 구두 요약만으로 다음 단계에 넘기지 않는다. 반드시 지정된 Markdown 핸드오프 파일을 사용한다.

## 기본 디렉터리 및 파일

- `handoffs/round_{ROUND_NO}/planner_to_designer.md`
- `handoffs/round_{ROUND_NO}/designer_to_developer.md`
- `handoffs/round_{ROUND_NO}/front-developer_to_tester.md`
- `handoffs/round_{ROUND_NO}/back-developer_to_tester.md`
- `handoffs/round_{ROUND_NO}/tester_report.md`
