# front-developer_to_tester

## 목적

사용자가 가장 먼저 읽는 진입 문서와 핸드오프 문서 구조를 정리해, 예시 레포가 실제로 따라 하기 쉬운 형태가 되도록 만든다.

## 입력 문서 또는 참조 산출물

- `handoffs/round_1/designer_to_developer.md`
- `start-prompt.md`
- `AGENTS.md`
- 기존 `handoffs/round_1/*.md` placeholder 문서

## 수행 내용

- `start-prompt.md` 를 라운드 절차와 웹 전용 프론트/백 전제, 종료/계속/중단 조건이 드러나는 형태로 재작성했다.
- 활성 규칙 문서인 `AGENTS.md` 를 복구하고, `AGENTS_template.md` 도 같은 기준으로 정리했다.
- `handoffs/templates/*.md` 를 추가해 새 라운드를 일관된 섹션 구조로 시작할 수 있게 했다.
- `handoffs/round_1/*.md` 는 placeholder 대신 실제로 채워진 예시 문서로 교체했다.

## 변경 파일 또는 산출물

- `start-prompt.md`
- `AGENTS.md`
- `AGENTS_template.md`
- `handoffs/templates/planner_to_designer.md`
- `handoffs/templates/designer_to_developer.md`
- `handoffs/templates/front-developer_to_tester.md`
- `handoffs/templates/back-developer_to_tester.md`
- `handoffs/templates/tester_report.md`
- `handoffs/round_1/planner_to_designer.md`
- `handoffs/round_1/designer_to_developer.md`
- `handoffs/round_1/front-developer_to_tester.md`
- `handoffs/round_1/back-developer_to_tester.md`
- `handoffs/round_1/tester_report.md`

## 실행/검증 명령

- `nl -ba start-prompt.md`
- `nl -ba AGENTS.md`
- `find handoffs -maxdepth 2 -type f | sort`

## 증적

- 공통 섹션 구조와 placeholder 금지 규칙은 `AGENTS.md` 와 템플릿 문서에 반영했다.
- round_1 예시는 다음 단계가 어떤 품질의 handoff 를 기대해야 하는지 직접 보여준다.

## 결정 사항

- 문서 단계에서도 `변경 파일 또는 산출물`, `실행/검증 명령`, `증적` 섹션을 필수로 유지한다.
- 웹 전용 프론트/백 프로젝트를 전제로, 프론트엔드와 백엔드 검증 결과를 각 handoff 에 남기도록 한다.

## 다음 단계 지시사항

- tester는 round_1 문서가 `scripts/validate_round.sh` 기준을 충족하는지 확인한다.
- 사용자 진입 문서와 실제 handoff 예시가 서로 모순되지 않는지 확인한다.

## 열린 이슈 또는 가정

- `AGENTS.md` 와 `AGENTS_template.md` 가 당분간 동일 내용을 가지므로 후속 라운드에서 단일 source-of-truth 정리가 필요할 수 있다.
- 이번 라운드에서는 실제 프론트엔드 UI 자체는 생성하지 않았다.
