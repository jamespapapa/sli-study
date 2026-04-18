# designer_to_developer

## 목적

오케스트레이션 예시가 읽기만 쉬운 문서가 아니라, 실제 라운드 운영과 검증이 가능한 구조가 되도록 사용자 진입 문서와 handoff 경험을 재설계한다.

## 입력 문서 또는 참조 산출물

- `handoffs/round_1/planner_to_designer.md`
- `start-prompt.md`
- `AGENTS.md` 초안
- 기존 `handoffs/round_1/*.md` placeholder 상태

## 수행 내용

- 상위 흐름은 `start-prompt.md`, 상세 운영 규칙은 `AGENTS.md` 로 분리한다.
- 라운드 문서는 모두 같은 기본 섹션 구조를 사용하고, `tester_report.md` 에만 상태/총점/주요 이슈를 추가한다.
- 미채움 템플릿 토큰이 남은 문서는 다음 단계로 넘길 수 없도록 공통 치환 규칙을 둔다.
- 웹 전용 프론트/백 구조를 전제로, 각 단계가 어느 디렉터리에서 무엇을 검증해야 하는지 문서상에서 바로 보이게 설계한다.

## 변경 파일 또는 산출물

- `start-prompt.md`
- `AGENTS.md`
- `AGENTS_template.md`
- `handoffs/templates/*.md`
- `handoffs/round_1/*.md`

## 실행/검증 명령

- `nl -ba handoffs/round_1/planner_to_designer.md`
- `nl -ba start-prompt.md`
- `nl -ba AGENTS.md`

## 증적

- 빈 handoff 문서는 다음 단계 입력으로서 가치가 없다.
- 실행 명령과 증적 경로가 없으면 tester가 문서 간 모순을 추적하기 어렵다.
- 종료 판단에 총점만 쓰면 진행 중단 이유가 불명확해진다.

## 결정 사항

- 문서 구조는 화려하게 늘리지 않고 공통 섹션을 반복한다.
- 예시 round_1 문서는 실제 내용이 채워진 샘플로 사용한다.
- `front-developer` 는 진입 문서와 템플릿/예시 handoff 가독성을 책임지고, `back-developer` 는 검증 스크립트와 에이전트 정의 정합성을 책임진다.

## 다음 단계 지시사항

- front-developer는 `start-prompt.md`, `AGENTS.md`, `AGENTS_template.md`, `handoffs/templates/*.md`, `handoffs/round_1/*.md` 를 정리한다.
- back-developer는 `.codex/agents/*`, `.claude/agents/*`, `scripts/*.sh` 를 정리한다.
- 두 개발자는 handoff 에서 수정 파일, 실행 명령, 남은 리스크를 반드시 남긴다.

## 열린 이슈 또는 가정

- 템플릿과 실제 round 문서를 둘 다 유지하므로 후속 라운드에서 동기화 규칙이 추가로 필요할 수 있다.
- 이번 라운드에서는 시각적 브랜딩이나 실제 UI 산출물은 범위에 포함하지 않는다.
