# back-developer_to_tester

## 목적

예시 레포가 문서 나열에 머무르지 않도록, 라운드 파일 생성과 완결성 검증을 자동화하는 최소 스크립트와 에이전트 규칙 정합성을 제공한다.

## 입력 문서 또는 참조 산출물

- `handoffs/round_1/designer_to_developer.md`
- `.codex/agents/front-developer.toml`
- `.codex/agents/back-developer.toml`
- `.codex/agents/tester.toml`
- `.claude/agents/*.md`

## 수행 내용

- `scripts/init_round.sh` 를 추가해 템플릿 기반 라운드 초기화를 자동화했다.
- `scripts/validate_round.sh` 를 추가해 필수 파일 존재, 필수 섹션 존재, 미치환 템플릿 토큰 잔존 여부, tester 상태값을 검증하게 했다.
- front/back/tester 에이전트 정의를 웹 전용 프론트/백 구조에 맞게 조정했다.
- tester 정의에서 근거 없는 지적 3건 강제 규칙을 제거하고, `PASS/REVISE/BLOCKED` 상태 기반 판정으로 바꿨다.

## 변경 파일 또는 산출물

- `scripts/init_round.sh`
- `scripts/validate_round.sh`
- `.codex/agents/front-developer.toml`
- `.codex/agents/back-developer.toml`
- `.codex/agents/tester.toml`
- `.claude/agents/front-developer.md`
- `.claude/agents/back-developer.md`
- `.claude/agents/tester.md`

## 실행/검증 명령

- `bash -n scripts/init_round.sh`
- `bash -n scripts/validate_round.sh`

## 증적

- 기존 스펙 충돌은 `AGENTS.md` 기준으로 해소했다.
- validator 는 템플릿 미치환 토큰과 초안용 문구가 남아 있으면 실패로 처리한다.
- tester 상태는 `PASS`, `REVISE`, `BLOCKED` 중 하나만 허용한다.

## 결정 사항

- 웹 전용 프론트/백 레포에서도 라운드 생성/검증은 스크립트로 재현 가능해야 한다.
- 총점은 참고치로만 유지하고, 종료 여부는 상태와 blocker 기준으로 판단한다.

## 다음 단계 지시사항

- tester는 문서 검증 스크립트가 round_1 에 대해 통과하는지 확인한다.
- 에이전트 정의와 `start-prompt.md`, `AGENTS.md` 의 종료 조건이 서로 같은 의미를 가지는지 확인한다.

## 열린 이슈 또는 가정

- validator 는 Markdown 구조 검증만 수행하며, 내용의 기술적 타당성까지 자동 판정하지는 않는다.
- 실제 프로젝트의 검증 명령 목록은 `frontend/`, `backend/` 구조에 맞춰 계속 보강해야 한다.
