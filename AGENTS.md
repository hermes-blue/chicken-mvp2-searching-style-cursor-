# 에이전트 작업 규칙

## 프로젝트 범위

- 작업 폴더: `C:\Users\keato\coding\chicken-mvp2-searching-style-cursor-`
- 메인 앱 폴더: `chicken-mvp`
- 앱 스택: React + Vite
- 로컬 개발 URL: `http://localhost:5173/`
- 루트의 Markdown 파일은 별도 지시가 없으면 기획, 인수인계, 참고자료로 본다.

## 기본 작업 원칙

- 구현을 바꾸기 전에 관련 파일을 먼저 읽는다.
- 변경 범위는 사용자의 현재 요청에 맞게 좁게 유지한다.
- 사용자가 만든 변경을 임의로 되돌리거나 덮어쓰지 않는다.
- 새 구조를 만들기보다 기존 프로젝트 구조와 관례를 우선한다.
- 검색은 가능하면 `rg` 또는 `rg --files`를 먼저 사용한다.
- 수동 파일 수정은 `apply_patch`를 사용한다.
- `.env.local`과 비밀 키는 커밋하지 않는다.
- API 키가 브라우저 번들에 노출되지 않게 한다.

## Markdown 작성 원칙

- 특별한 이유가 없으면 Markdown 문서는 한글로 작성한다.
- 사용자가 직접 읽고 판단해야 하므로 요약은 짧고 명확하게 쓴다.
- 쓸데없이 길게 설명하지 않는다.
- 코드 예시는 꼭 필요할 때만 넣는다.
- 다양한 대안 제시는 괜찮지만 불필요한 부연설명은 줄인다.
- 가급적 간단하고 쉽게 설명한다.
- 코드명, 파일 경로, 명령어, 환경변수명은 영어 원문을 유지한다.
- 오래된 파일의 한글이 깨져 보이면 필요한 경우를 제외하고 깨진 문장을 새 문서에 복사하지 않는다.

## 현재 아키텍처 메모

- Vercel Root Directory는 `chicken-mvp`로 본다.
- Gemini 호출은 `chicken-mvp/api/gemini-cost.js`를 거친다.
- Vercel 환경변수는 `GEMINI_API_KEY`를 사용한다.
- 브라우저 코드는 `/api/gemini-cost`를 호출한다.
- 프로덕션에서는 `VITE_GEMINI_API_KEY`를 사용하지 않는다.
- `chicken-mvp/.env.local`은 로컬 개발용으로만 허용하며 커밋하지 않는다.

## 주요 기존 문서

- `HANDOFF.md`: 전체 작업 흐름을 압축한 누적 인수인계 요약.
- `docs/reference/HANDOFF_TO_MVP_PROJECT_2026-05-02.md`: 과거 DB 파이프라인 상세 인수인계.
- `docs/reference/codex-expanded-change-list-with-sources-v2.md`: 참고 지시와 출처 문서.
- `docs/reference/DB_PIPELINE_STRATEGY_MVP_AI_ARCHITECT.md`: DB 파이프라인 전략 문서.
- `docs/reference/MVP_STRUCTURE_REDESIGN_PLAN.md`: MVP 구조 재설계 계획.
- `docs/reference/MEMO.md`: 짧은 메모.
- `docs/reference/교촌.md`: 교촌 정보공개서 원문 성격 자료.

## 핸드오프 규칙

- 의미 있는 작업 세션을 끝내기 전 `HANDOFF.md`를 갱신한다.
- `HANDOFF.md`는 최신 작업만 적는 파일이 아니라, 지금까지의 전체 작업 흐름을 계속 압축해 둔 누적 인수인계 파일이다.
- 최근 세션 내용도 전체 흐름 안에 합쳐서 짧게 반영한다.
- 대화 전체를 보존하지 말고 다음 세션이 이어서 일할 수 있는 핵심만 남긴다.
- 커밋/푸시 이후 또는 세션 종료 전에는 사용자에게 다음 단계로 무엇을 할지 물어본 뒤 `Next Steps`에 정리한다.

## 핸드오프 분량 기준

- 정확한 줄 수보다 다음 세션이 바로 이어서 일할 수 있는지가 중요하다.
- 보통 200줄 전후를 기준으로 하되, 작업 규모에 따라 더 짧거나 길 수 있다.
- 너무 길어져 핵심이 흐려지면 압축한다.
- 문단보다 bullet을 우선한다.
- 전체 작업 흐름, 최종 결정, 변경 파일, 현재 상태, 검증 결과, 리스크, 다음 작업만 남긴다.
- 오래되었거나 더 이상 중요하지 않은 내용은 제거한다.
- 긴 로그, 전체 diff, 반복 토론 내용은 붙여넣지 않는다.
- 긴 참고 문서는 파일명과 핵심 요지만 남긴다.
- 세션 중 결정이 바뀐 경우 최종 결정 위주로 기록한다. 단, 번복 자체가 전체 흐름 이해에 중요하면 짧게 남긴다.
- 중요한 파일은 정확한 경로를 쓴다.
- 실행한 명령은 성공/실패와 핵심 결과만 적는다.
- 불확실한 것은 확정처럼 쓰지 말고 불확실하다고 표시한다.

## 갱신 시점

다음 중 하나라도 해당하면 `HANDOFF.md`를 갱신한다.

- 코드나 데이터 파일이 바뀌었다.
- 아키텍처나 환경변수 전제가 바뀌었다.
- 사용자가 프로젝트 차원의 결정을 내렸다.
- 버그, 리스크, blocker를 발견했다.
- 테스트, 빌드, 배포 확인을 실행했다.
- 다음 세션이 대화 기록 없이는 이어가기 어렵다.
- 커밋 또는 푸시를 완료했다.

단순 질의응답만 한 경우에는 사용자가 요청하지 않으면 갱신하지 않아도 된다.

커밋/푸시 이후 또는 세션 종료 전에는 먼저 사용자에게 다음 단계로 정리할 내용을 확인한다.

## HANDOFF.md 양식

```md
# Handoff Notes

## Snapshot
- Date:
- Workspace:
- Main app:
- Current goal:
- Current status:

## User Decisions
- Decision 1
- Decision 2

## Changes This Session
- `path/to/file`: changed what and why

## Current Implementation State
- Working:
- Partially done:
- Intentionally not done:

## Important Constraints
- Constraint 1
- Constraint 2

## Verification
- `command`: passed/failed, short result
- Manual check:

## Risks / Open Questions
- Risk or question 1

## Next Steps
1. Next concrete step
2. Next concrete step
3. Next concrete step

## Do Not Forget
- Secret/env caution
- Files not to commit
- Source document to consult
```

## 세션 기억 관리 방식

- `AGENTS.md`는 전체 규칙과 인수인계 양식을 저장한다.
- `HANDOFF.md`는 전체 작업 흐름을 적절한 길이로 압축한 누적 요약을 저장한다.
- 긴 조사 내용이나 출처 자료는 별도의 날짜별/주제별 Markdown으로 둔다.
- `HANDOFF.md`가 길어져 핵심 파악이 어려워지면 새 파일을 만들기보다 압축한다.

## 압축 방법

- 먼저 남길 것: 최종 결정, 변경 파일, 현재 상태, 검증, 다음 단계.
- 그다음 남길 것: blocker, 리스크, 중요한 사용자 선호.
- 마지막으로 남길 것: 꼭 필요한 참고 문서 링크나 파일명.
- 제거할 것: 반복 reasoning, 폐기된 계획, 명령 출력 잡음, 더 이상 중요하지 않은 실패 경로.

## 안전 메모

- `.env.local`은 로컬 전용이다.
- API 키는 서버 쪽에만 둔다.
- 프로덕션 번들을 점검할 때는 Gemini API 키, 직접 Gemini endpoint, `key=undefined` 같은 노출이 없는지 확인한다.
- Supabase나 DB credential을 다룰 때는 클라이언트 코드에 노출되지 않는지 먼저 확인한다.
