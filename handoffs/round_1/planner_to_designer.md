# planner_to_designer

## 목적

웹 전용 프론트엔드/백엔드 오케스트레이션 레포를, 라운드 초기화와 핸드오프 검증까지 일관되게 따라갈 수 있는 구조로 정리한다.
이번 라운드에서는 스펙 충돌 제거, 종료 조건 안정화, 핸드오프 품질 향상, 웹 전용 구조 명시까지를 완료 기준으로 둔다.

## 입력 문서 또는 참조 산출물

- `start-prompt.md`
- `AGENTS.md` 초안 및 `AGENTS_template.md`
- `.codex/agents/front-developer.toml`
- `.codex/agents/back-developer.toml`
- `.codex/agents/tester.toml`
- `handoffs/round_1/*` placeholder 문서

## 수행 내용

- 이 레포는 웹 전용 프론트엔드/백엔드 구조를 전제로 설명하기로 했다.
- 개발 단계 병렬 허용 규칙과 금지 규칙이 충돌하므로, 개발 단계의 front/back 조합만 병렬 허용으로 통일하기로 했다.
- 테스터 총점을 종료 조건에서 분리하고, `PASS/REVISE/BLOCKED` 상태 판정을 종료 기준으로 바꾸기로 했다.
- 핸드오프는 문서 제목만 있는 상태로 넘기지 않도록 필수 섹션, 증적, 실행 명령을 명시하기로 했다.

## 변경 파일 또는 산출물

- `AGENTS.md` 활성 문서 복구
- `AGENTS_template.md` 정리
- `start-prompt.md` 정리
- `handoffs/templates/*.md` 추가
- `scripts/init_round.sh`
- `scripts/validate_round.sh`

## 실행/검증 명령

- `rg --files`
- `find . -maxdepth 3 -type f | sort`
- `nl -ba start-prompt.md`
- `nl -ba AGENTS_template.md`
- `for f in .codex/agents/*.toml; do nl -ba "$f"; done`

## 증적

- 종료 조건의 불안정성: `start-prompt.md`
- 병렬 규칙 충돌과 잘못된 파일명: `AGENTS.md` 초안
- placeholder handoff 상태: `handoffs/round_1/*.md`

## 결정 사항

- 이 라운드에서는 실제 앱 생성이나 API 계약 산출물 추가는 범위에서 제외한다.
- 대신 웹 전용 오케스트레이션 문서와 `init_round` / `validate_round` 스크립트의 정합성을 확보한다.
- round 산출물은 모두 실제 내용을 담은 예시 문서로 교체한다.

## 다음 단계 지시사항

- designer는 문서 구조를 단순하게 유지하되, 다음 단계가 그대로 실행할 수 있을 정도로 각 섹션의 의미와 책임을 구체화한다.
- front-developer는 사용자에게 보이는 진입 문서와 템플릿 구조를 담당한다.
- back-developer는 검증 스크립트와 에이전트 동작 규칙 정리를 담당한다.

## 열린 이슈 또는 가정

- 실제 서브에이전트 스폰 자체는 Codex 런타임 기능이므로, 레포 내부에서는 그 전후의 산출물 규율과 검증까지만 책임진다고 가정한다.
- 후속 라운드에서는 API 계약 산출물과 비시각 품질 게이트를 별도 범위로 다룰 수 있다.
