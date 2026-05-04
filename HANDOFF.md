# Handoff Notes

## Latest Result Summary

- 2026-05-04 latest state:
  - Local `master` was rebased on top of the latest `origin/master`.
  - Remote had 28 newer `auto: update kyochon news` commits; these were preserved.
  - The structure-refactor commit was replayed on top without conflicts.
  - Pushed successfully to GitHub.
  - Current latest commit: `39bcc78 제이슨구조완성`.
  - `git status -sb`: clean, `master...origin/master` with no ahead/behind.
- Main architecture result:
  - Old shape: screen flow, button targets, card copy, tags, insights, source notes, and many numbers were mixed directly in `data.js`.
  - New shape: `data.js` is becoming the screen map: screen order, card order, and `qBtn` navigation.
  - `chicken-mvp/src/data/mvpScreenPatches.json` now holds many card display fields: copy, tags, insights, source-like notes.
  - `chicken-mvp/src/data/brandMetricColumns.json` holds structured metric-style values: store count, franchise fee, deposit, official burden, average sales, source type, confidence.
  - `chicken-mvp/src/data/metricScreenPatches.js` converts metric values into existing card fields.
  - `chicken-mvp/src/applyMvpDbPatch.js` merges base screens, generated metric patches, and screen-copy patches at runtime.
- Cost-detail split result:
  - Cost-detail screens `s5`, `sgyo5`, `sbbq5`, `spura5` were split further.
  - Their 16 cost-detail cards now keep mostly only `title` and `qBtn` in `data.js`.
  - Display content moved into `mvpScreenPatches.json`.
  - Metric-derived values intentionally remain generated from `brandMetricColumns.json` where available, so screen-copy JSON does not override those numeric rows.
- User-facing clarification:
  - “Column” and “JSON” are not separate file types here.
  - Column-style data means JSON shaped like a table of numeric fields.
  - Copy JSON means JSON shaped like card text/labels/insights.
  - Some hardcoding remains intentionally: screen flow, card order, navigation targets, and some chart/static UI logic.
- API check result:
  - Gemini API code still exists.
  - Browser code still calls `/api/gemini-cost`.
  - Local Vite server at `127.0.0.1:5173` returns 404 for `/api/gemini-cost` because Vite does not run Vercel serverless functions.
  - `chicken-mvp/.env.local` was not present, so the local direct Gemini fallback was inactive.
  - This is a local-dev limitation, not evidence that the API path was removed.
- Verification after rebase/push:
  - `npm.cmd run build`: passed after rebase on latest origin.
  - `git push origin master`: succeeded.

## Snapshot

- Date: 2026-05-04
- Workspace: `C:\Users\keato\coding\chicken-mvp2-searching-style-cursor-`
- Main app: `chicken-mvp`
- Stack: React + Vite
- Local dev URL: `http://localhost:5173/`
- Vercel Root Directory: `chicken-mvp`
- Current goal: 기존 질문형 MVP 화면을 유지하면서, 하드코딩된 화면 데이터와 DB/공식 수치/화면 카피를 점진적으로 분리한다.
- Current status: 토큰 소진으로 끊긴 비용 상세 화면 분리 작업을 이어서 진행했다. `s5`, `sgyo5`, `sbbq5`, `spura5`의 카드 표시 필드는 `mvpScreenPatches.json`로 이동했고, `data.js`에는 카드 title과 `qBtn` 중심 구조만 남겼다.

## User Decisions

- 루트의 Markdown 파일은 별도 지시가 없으면 기획, 인수인계, 참고자료로 본다.
- 루트 Markdown은 정리하고 참고 문서는 `docs/reference/`로 옮기는 방향을 유지한다.
- `HANDOFF.md`는 최신 작업만 적는 파일이 아니라 전체 작업 흐름을 압축한 누적 인수인계 파일로 유지한다.
- Markdown 문서는 특별한 이유가 없으면 한국어로 작성한다.
- MVP 방향은 “DB 테이블을 화면에 그대로 붙이는 것”이 아니라 “화면 UX가 필요로 하는 최종 데이터 모양을 만들고 거기에 DB/JSON을 맞추는 것”이다.
- 현재 화면의 질문형 UX, 화면 흐름, 버튼 이동 구조는 최대한 유지한다.
- 공식 수치와 추정치는 섞어 쓰지 말고 출처/신뢰도/추정 여부를 구분한다.
- API 키는 브라우저 번들에 노출하지 않는다. 프로덕션은 `GEMINI_API_KEY` 서버 환경변수만 사용한다.

## Project Direction

- 목표는 완벽한 DB를 먼저 만드는 것이 아니라 작은 엔드투엔드 흐름을 먼저 완성하는 것이다.
- 권장 흐름:

```text
source data
-> parsing/filtering
-> LLM interpretation
-> DB writing
-> JSON export / processed layer
-> chicken-mvp React screen
```

- MVP는 `franchise_analysis` 같은 내부 DB 테이블 구조에 직접 의존하지 않는 편이 안전하다.
- 단기적으로는 `data/exports/mvp_answer_cards.json` 또는 앱 내부 JSON처럼 화면용 가공 계층을 둔다.
- 역할 분리 기준:
  - 하드코딩: 화면 흐름, 공통 질문, 버튼 이름/target, 기본 UX 구조
  - DB/컬럼형 JSON: 창업비용, 가맹점 수, 평균매출, 가맹비, 보증금, 공식 부담금 등 숫자/비교 값
  - 화면 패치 JSON: 태그, insight, source note, 카드별 설명 문구 같은 유연한 카피

## Current Architecture Notes

- Gemini 호출은 `chicken-mvp/api/gemini-cost.js`를 통한다.
- 브라우저 코드는 `/api/gemini-cost`를 호출한다.
- Vercel 환경변수는 `GEMINI_API_KEY`를 사용한다.
- `VITE_GEMINI_API_KEY`는 프로덕션에서 사용하지 않는다.
- `chicken-mvp/.env.local`은 로컬 개발용만 허용하며 커밋하지 않는다.
- 서버리스 응답은 `costText`, `totalManwon`을 반환한다.
- 큰 비용 숫자는 `costText`를 사용한다.
- 초기 비용 구성 차트는 `totalManwon`을 사용한다.
- 비용 구성 항목은 기존 비율을 바탕으로 배분하고, 마지막 항목이 반올림 차이를 흡수해 총액이 맞게 한다.

## DB Pipeline / MVP State

- 과거 파이프라인 쪽 완료 상태:
  - FTC/source XML collection
  - filtering
  - Gemini facts + risk analysis
  - Supabase 기존 구조 업로드 20 rows
  - `franchise_analysis` wide table creation
  - `franchise_analysis` 20 rows inserted
  - MVP-oriented JSON export tested
- DB pipeline과 MVP의 첫 연결 테스트는 성공으로 간주한다.
- 이 연결은 최종 구조가 아니라 “작동하는 첫 연결”이다.
- 이후 방향은 화면 흐름은 유지하고, DB/공식 수치/화면 카피를 분리하는 것이다.

## Markdown Cleanup State

- 루트에 있던 참고 Markdown 문서들은 `docs/reference/`로 이동된 상태다.
- 루트에 남기는 핵심 문서:
  - `AGENTS.md`
  - `HANDOFF.md`
- 이동된 참고 문서:
  - `docs/reference/brand-copy-transformed.md`
  - `docs/reference/codex-expanded-change-list-with-sources-v2.md`
  - `docs/reference/DB_PIPELINE_STRATEGY_MVP_AI_ARCHITECT.md`
  - `docs/reference/HANDOFF_TO_MVP_PROJECT_2026-05-02.md`
  - `docs/reference/MEMO.md`
  - `docs/reference/MVP_DB_INTEGRATION_DISCUSSION_2026-05-02.md`
  - `docs/reference/MVP_STRUCTURE_REDESIGN_PLAN.md`
  - `docs/reference/교촌.md`
- `git status`에서는 루트 문서들이 `D`로 보이고 `docs/`가 `??`로 보인다. 이는 삭제가 아니라 이동/정리 의도다.
- 다음 세션에서 필요하면 `git status --short`와 `git diff --stat`로 이동 상태를 재확인한다.

## Important Reference Meanings

- `docs/reference/codex-expanded-change-list-with-sources-v2.md`: 공식 수치 교정과 출처 기반 수정 지시 문서.
- `docs/reference/brand-copy-transformed.md`: 브랜드/뉴스 분석 카피를 쉬운 비유형 한국어로 바꾼 참고 문서.
- `docs/reference/교촌.md`: 교촌 정보공개서 원문 성격 자료. 크기가 크므로 삭제 여부는 사용자 확인 필요.
- `docs/reference/MEMO.md`: 로컬 명령과 배포 관련 메모.
- `docs/reference/DB_PIPELINE_STRATEGY_MVP_AI_ARCHITECT.md`: 작은 데이터 흐름을 끝까지 만들고 소스별로 확장하는 전략.
- `docs/reference/MVP_DB_INTEGRATION_DISCUSSION_2026-05-02.md`: 프랜차이즈 DB 파이프라인을 MVP에 연결하는 논의.
- `docs/reference/MVP_STRUCTURE_REDESIGN_PLAN.md`: 하드코딩 플로우, DB 컬럼, JSON 설명 데이터 분리 계획.
- `docs/reference/HANDOFF_TO_MVP_PROJECT_2026-05-02.md`: 과거 DB 파이프라인 상세 인수인계.

## App Data Split: Current State

- `chicken-mvp/src/data.js`
  - 여전히 기본 화면 흐름과 카드 배열을 가진다.
  - 카드의 `qBtn` target과 화면 전환 구조는 대부분 여기 남아 있다.
  - 여러 카드의 `hint`, `val`, `row1Val`, `row1Label`, `tags`, `insights`는 빈 값으로 비워지고 JSON/metric patch에서 주입되도록 바뀌었다.
  - `auto-kyochon-news.json`의 교촌 뉴스 insight hydration은 유지된다.
  - 최종 export는 `applyMvpDbPatch(baseScreens, { screenPatches: [...], brandMetricColumns })` 형태로 바뀌었다.
  - `brandMetricColumns`도 export한다.

- `chicken-mvp/src/data/brandMetricColumns.json`
  - 새 파일.
  - 4개 메인 브랜드의 컬럼형 metric을 담는다.
  - 포함 의도: `displayName`, `aliases`, `screenKeys`, `sourceType`, `source`, `disclosureYear`, `storeCount`, `averageSalesManwon`, `totalStartupCostManwon`, `franchiseFeeManwon`, `depositManwon`, `officialBurdenManwon`, `profitEstimateManwonRange`, `confidence` 등.
  - 목적: DB/공식 수치처럼 구조화 가능한 값은 화면 카피 JSON이 아니라 이 파일로 분리한다.

- `chicken-mvp/src/data/mvpScreenPatches.json`
  - 기존 `chicken-mvp/src/mvp-db-patch.json`에서 이동/확장된 화면 패치 JSON.
  - 화면별 `cardsByTitle` 형태로, 카드 title에 맞춰 보이는 필드만 덮어쓴다.
  - 담당 영역: 태그, insight, source, 카드별 카피, 비수치성 표시값.
  - 이미 여러 화면의 카피가 이 파일로 이동되었다.

- `chicken-mvp/src/data/metricScreenPatches.js`
  - 새 파일.
  - `brandMetricColumns.json`의 수치 데이터를 화면 패치 형태로 변환한다.
  - 현재 생성 범위:
    - 홈 화면 `s0`의 브랜드별 기본 metric row
    - 브랜드 entry 화면의 `얼마 드나?` 카드
    - 브랜드 파워 화면의 가맹점 수 row
    - 비용 상세 화면의 가맹비/인테리어/장비/숨은 비용 카드 일부
  - 이 파일은 “DB 컬럼형 값 -> 기존 화면 카드 필드” 어댑터 역할이다.

- `chicken-mvp/src/applyMvpDbPatch.js`
  - 단일 patch payload만 받던 구조에서 여러 screen patch payload를 합치는 구조로 바뀌었다.
  - `screenPatches` 배열을 merge한다.
  - 카드 title 기준으로 patch를 적용한다.
  - `_meta`는 보존/병합한다.
  - `brandMetricColumns`로 브랜드 lookup을 만들고, 카드의 `brandKey` 또는 `title`과 매칭되면 `_meta.brandKey`, `_meta.brandMetrics`를 붙인다.
  - 의도: 화면 컴포넌트에서 필요하면 원본 metric을 추적할 수 있게 한다.

## Interrupted Work Resumed Details

- 토큰 소진으로 중단된 핵심 작업은 “하드코딩 화면 데이터 분리”였다.
- 작업은 한 번에 전체 앱을 갈아엎는 방식이 아니라, 화면 그룹을 조금씩 JSON/metric patch로 빼는 방식이었다.
- 이미 진행된 분리:
  - 홈 `s0` 4개 카드의 tags/insights/hint/value/copy 일부를 `mvpScreenPatches.json` 또는 metric patch로 이동.
  - BHC entry 화면 `sbhc0` 카드 4개 display/copy 데이터를 `mvpScreenPatches.json`로 이동.
  - 교촌/BBQ/푸라닭 entry 화면 `sgyo0`, `sbbq0`, `spura0` 카드 4개씩 display/copy 데이터를 `mvpScreenPatches.json`로 이동.
  - 상세 “해볼 만할까?” 계열 화면 `s1`, `sgyo1`, `sbbq1`, `spura1`의 display/copy 데이터를 상당 부분 `mvpScreenPatches.json`로 이동.
  - 비용 상세 화면 `s5`, `sgyo5`, `sbbq5`, `spura5`는 `_meta` 및 metric-derived patch 적용을 시작한 상태였다.
- 이번 이어서 진행한 작업:
  - `s5`, `sgyo5`, `sbbq5`, `spura5` 비용 상세 화면의 총 16개 카드에서 표시용 필드를 `mvpScreenPatches.json`로 이동했다.
  - `data.js`의 해당 카드 객체에는 `title`과 `qBtn`만 남겼다.
  - 기존 `official`, `hint`, `val`, `valColor`, `row1Val`, `row1Label`, `tags`, `insights` 등 표시 필드는 patch JSON으로 이동했다.
  - 단, `metricScreenPatches.js`가 공식/컬럼 수치 row를 생성하는 카드에서는 `val`, `row1Val`, `row1Label`을 `mvpScreenPatches.json`에 넣지 않아 metric-derived patch가 덮어써지지 않게 했다.
  - metric이 없는 BHC 인테리어/장비/숨은 비용 같은 카드에는 기존 표시값을 `mvpScreenPatches.json`에 보존했다.
  - `qBtn`의 label/target과 화면 이동 구조는 유지했다.
- 주의:
  - 카드 매칭은 `cardsByTitle`의 title 문자열에 의존한다. title을 바꾸면 patch 적용이 깨질 수 있다.
  - 브랜드 매칭은 `brandKey`, `title`, `displayName`, `aliases` 정규화에 의존한다.
  - 한글이 PowerShell 출력에서 깨져 보일 수 있다. 실제 파일 수정 전에는 에디터나 UTF-8 출력 설정으로 확인한다.
  - 다음 세션은 먼저 `npm.cmd run build`를 실행해 현재 중단 상태가 아직 빌드 가능한지 확인하는 것이 안전하다.

## Runtime / Lint Fixes Already Made

- `chicken-mvp/src/App.jsx`
  - `/api/gemini-cost` 로컬 응답이 비어 있을 때 `res.json()`이 터질 수 있어 `res.text()` 후 빈 문자열이면 `{}`로 처리하도록 수정했다.

- `chicken-mvp/src/components/Card.jsx`
  - `HubCostChart`에서 `apiLoading` 조건 return이 hook 호출보다 먼저 오던 문제를 수정했다.
  - `useCountUp`에서 조건부로 effect 안에서 바로 `setValue`하던 흐름을 정리해 lint 경고를 줄였다.
  - 로딩 count 표시에서 `apiLoading`이 아닐 때 파생값 `loadingCountNum`을 사용하도록 정리했다.
  - 단, 전체 lint 기준으로 `Card.jsx` exhaustive-deps 경고 2개가 남아 있다고 기록되어 있다.

- `chicken-mvp/eslint.config.js`
  - `api/**/*.js`에 Node globals를 추가했다.
  - 목적: `api/gemini-cost.js`의 `process` 같은 Node 전역을 ESLint가 브라우저 코드처럼 보지 않게 한다.

## Prior Data Corrections

- 공식 수치 교정이 반영된 것으로 기록되어 있다:
  - BHC franchise fee -> `1,100만`
  - Kyochon franchise fee -> `676.5만`
  - Kyochon deposit -> `100만`
  - BBQ official burden -> `9,078.9만`
  - Puradak franchise fee summary -> `1,100만`
- 추정 순이익 완화:
  - BHC profit range -> `100~150만`
  - BBQ profit range -> `140~170만`
- 아직 완전 교체하지 않은 영역:
  - 인지도/재방문/폐업률류 카드 의미와 근거 정리는 남아 있다.

## Changed Files In Working Tree

- `AGENTS.md`
  - 새로 생긴 루트 규칙 파일.
  - 사용자 제공 한국어 작업 규칙, 핸드오프 규칙, 아키텍처 메모가 들어 있다.

- `HANDOFF.md`
  - 이번 파일. 누적 인수인계를 최신 상태로 다시 정리했다.
  - 특히 토큰 소진으로 끊긴 “데이터 분리 중단 지점”을 상세 기록했다.

- `docs/reference/*`
  - 루트 Markdown 참고자료 이동 대상.
  - `git status`상 untracked로 보일 수 있으나 삭제 의도가 아니라 이동 정리다.

- `chicken-mvp/src/data.js`
  - 기본 화면 구조 유지.
  - 화면 카피/metric 값을 비우고 patch에서 주입하는 구조로 변경 중.
  - 비용 상세 화면 `s5`, `sgyo5`, `sbbq5`, `spura5`의 16개 카드는 `title`과 `qBtn`만 남긴 상태다.

- `chicken-mvp/src/applyMvpDbPatch.js`
  - 여러 patch payload merge, brand metric lookup, `_meta.brandMetrics` 부착 기능 추가.

- `chicken-mvp/src/data/brandMetricColumns.json`
  - 브랜드별 구조화 metric 새 파일.

- `chicken-mvp/src/data/mvpScreenPatches.json`
  - 화면 카피/태그/insight patch 파일.
  - 비용 상세 화면 `s5`, `sgyo5`, `sbbq5`, `spura5`의 표시 필드가 추가되었다.
  - metric-derived patch가 담당하는 수치 row는 일부러 비워 두거나 제외했다.

- `chicken-mvp/src/data/metricScreenPatches.js`
  - metric 기반 화면 patch 생성기.

- `chicken-mvp/src/App.jsx`
  - 빈 API 응답 JSON parsing 방어.

- `chicken-mvp/src/components/Card.jsx`
  - hook order와 synchronous effect setState 관련 수정.

- `chicken-mvp/eslint.config.js`
  - `api/**/*.js` Node globals 추가.

- `chicken-mvp/src/mvp-db-patch.json`
  - 삭제된 것으로 보임. 내용은 `chicken-mvp/src/data/mvpScreenPatches.json`로 이동된 상태로 봐야 한다.

## Current Git Status Notes

- 마지막 확인된 `git status --short` 핵심:
  - 루트 Markdown 다수 `D`
  - `docs/` `??`
  - `AGENTS.md` `??`
  - `chicken-mvp/src/data/` `??`
  - 앱 코드 여러 파일 `M`
- 이 상태에서 `git add -A`를 하면 문서 이동과 새 데이터 파일이 함께 staging된다.
- 문서 이동을 삭제로 오해해 되돌리지 말 것.
- 사용자 변경을 임의로 되돌리지 말 것.

## Verification Known From This Work

- 기록상 다음 검증이 통과했다:
  - `npm.cmd run build`: data structure split 이후 통과.
  - `npx.cmd eslint src/applyMvpDbPatch.js src/data.js`: 통과.
  - `npm.cmd run build`: metric-derived patch 확장 이후 통과.
  - `npx.cmd eslint src/applyMvpDbPatch.js src/data.js src/data/metricScreenPatches.js`: 통과.
  - `npm.cmd run build`: first-screen copy split 이후 통과.
  - `npm.cmd run build`: BHC entry screen copy split 이후 통과.
  - `npm.cmd run build`: `sgyo0`, `sbbq0`, `spura0` copy split 이후 통과.
  - `npm.cmd run build`: `s1`, `sgyo1`, `sbbq1`, `spura1` copy split 이후 통과.
  - `npm.cmd run lint`: 통과했지만 `Card.jsx` exhaustive-deps warning 2개가 남았다고 기록됨.
  - 로컬 dev server 재시작 후 `vite-dev.err.log`는 비어 있었다고 기록됨.
  - `GET http://127.0.0.1:5173/`: 200, React root 확인.
  - production bundle string check에서 `AIza`, `VITE_GEMINI_API_KEY`, direct Gemini endpoint, `key=undefined`가 없었다고 기록됨.
- 이번 이어서 진행한 뒤 새로 실행한 검증:
  - `npm.cmd run build`: 처음에는 샌드박스의 Tailwind native dependency/child process 제한으로 실패했으나, escalated 실행에서 통과.
  - `npx.cmd eslint src/data.js src/applyMvpDbPatch.js src/data/metricScreenPatches.js`: 통과.
  - 비용 상세 16개 카드 이동 후 `npm.cmd run build`: 통과.
  - 포맷 정리 후 `npm.cmd run build`: 통과.
  - 포맷 정리 후 `npx.cmd eslint src/data.js src/applyMvpDbPatch.js src/data/metricScreenPatches.js`: 통과.
  - `npm.cmd run dev -- --host 127.0.0.1`: 샌드박스에서는 Tailwind native dependency/child process 제한으로 실패했으나, escalated `Start-Process` 실행으로 dev server 시작 성공.
  - `Invoke-WebRequest http://127.0.0.1:5173/`: 200 응답 확인.

## Risks / Open Questions

- `docs/reference/교촌.md`는 매우 큰 원문 성격 자료이므로 repo에 계속 둘지 사용자 확인 필요.
- PowerShell 출력에서 한글이 깨져 보이는 경우가 있다. 실제 파일이 깨졌다고 단정하지 말고 UTF-8 기준으로 확인한다.
- 카드 title 기반 patch 구조는 title 변경에 취약하다.
- `metricScreenPatches.js`는 화면 title 문자열과 브랜드 key 문자열을 많이 참조하므로, 한글 인코딩/문자열 불일치가 있으면 patch가 조용히 누락될 수 있다.
- `Card.jsx` lint warning 2개는 남아 있을 수 있다. 기능에는 큰 문제 없어 보이나 다음 정리 후보다.
- DB/공식 수치와 MVP 추정치가 섞인 브랜드는 `sourceType: mixed`, `confidence: MEDIUM`처럼 명확히 표시해야 한다.
- 비용 상세 화면 `s5`, `sgyo5`, `sbbq5`, `spura5`는 코드 구조상 분리 완료 상태지만, 브라우저에서 실제 카드 표시가 이전과 맞는지 수동 확인은 아직 필요하다.

## Next Steps

1. 로컬 dev server는 `http://127.0.0.1:5173/`로 떠 있다. 브라우저에서 `s5`, `sgyo5`, `sbbq5`, `spura5`로 이동해 카드 값/태그/insight가 비어 보이지 않는지 수동 확인한다.
2. 다음 분리 대상은 수익 상세 화면 `s9`, `sgyo9`, `sbbq9`, `spura9`가 자연스럽다.
3. `metricScreenPatches.js`는 숫자/공식 metric만 담당하게 하고, `mvpScreenPatches.json`은 카피/태그/insight 중심으로 유지한다.
4. `data.js`에는 화면 흐름, 카드 순서, `qBtn` target 중심으로 남긴다.
5. 화면 하나를 옮길 때마다 build를 돌리고, 가능한 경우 브라우저에서 해당 화면의 카드가 비어 보이지 않는지 확인한다.
6. 이후 `docs/reference/`의 큰 참고 문서 보존 여부를 사용자에게 확인한다.

## Do Not Forget

- `.env.local`은 로컬 전용이며 커밋하지 않는다.
- API 키, Supabase credential, DB credential은 클라이언트 코드에 넣지 않는다.
- 프로덕션 번들에 Gemini 키, `VITE_GEMINI_API_KEY`, 직접 Gemini endpoint, `key=undefined`가 노출되지 않는지 계속 확인한다.
- 문서 이동을 삭제로 착각해 되돌리지 않는다.
- 사용자가 만든 변경은 임의로 revert하지 않는다.
- 다음 세션에서 코드 수정 전 관련 파일을 먼저 읽는다.
