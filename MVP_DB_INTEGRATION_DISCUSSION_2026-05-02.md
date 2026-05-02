# MVP DB Integration Discussion

작성일: 2026-05-02

## 목적

이 문서는 chicken MVP 프로젝트와 franchise-db-pipeline 프로젝트를 어떻게 연결할지 다른 AI 또는 개발자와 토론하기 위한 정리 문서다.

핵심 질문은 다음이다.

```text
현재 MVP의 질문형 UX를 유지하면서,
DB 파이프라인에서 만든 프랜차이즈 분석 데이터를 어떻게 붙일 것인가?
```

## 관련 프로젝트

### MVP 프로젝트

```text
C:\Users\keato\coding\chicken-mvp2-searching-style-cursor-
```

주요 앱 경로:

```text
chicken-mvp/src/data.js
chicken-mvp/src/App.jsx
chicken-mvp/src/components/Card.jsx
```

현재 MVP는 React/Vite 앱이며, 대부분의 화면 데이터는 `src/data.js`의 `screens` 객체에 하드코딩되어 있다.

### DB 파이프라인 프로젝트

```text
C:\Users\keato\coding\franchise-db-pipeline
```

주요 파일:

```text
supabase/franchise_analysis_v1.sql
scripts/19_upsert_franchise_analysis_table.mjs
scripts/20_export_mvp_cards.mjs
data/exports/mvp_franchise_cards.json
data/exports/mvp_franchise_cards_major4.json
docs/MVP_JSON_BRIDGE_PLAN_2026-05-02.md
```

## 현재 MVP 구조

MVP는 질문형 흐름을 가진다.

대표 질문:

```text
어느 브랜드가 궁금해?
이거 괜찮을까?
얼마 드나?
얼마 남나?
어디서 망하나?
```

현재 첫 화면에는 대략 다음 4개 브랜드 카드가 있다.

```text
교촌치킨
BBQ
BHC
푸라닭
```

카드 데이터는 대략 다음 구조를 사용한다.

```text
title
hint
val
valColor
row1Val
row1Label
tags
insights
qBtn
brandKey
```

`Card.jsx`는 이 카드 데이터를 받아 화면만 그린다. DB 컬럼명을 직접 알지 않는다.

## 현재 DB 구조

DB 파이프라인은 Supabase에 다음 테이블을 만들었다.

```text
public.franchise_analysis
```

주요 컬럼:

```text
jng_ifrmp_sn
brand_name
company_name
disclosure_year
initial_fee_krw
education_fee_krw
deposit_krw
interior_cost_krw
total_estimated_startup_cost_krw
average_sales_krw
exit_risk_grade
hidden_cost_grade
autonomy_grade
overall_risk_grade
overall_summary
facts_json
analysis_json
full_result_json
```

이 테이블은 원자료와 LLM 분석 결과를 보존하기 위한 넓은 구조다.

## 생성된 JSON

DB 파이프라인에서 MVP용 JSON export를 만들었다.

### 전체 20건

```text
C:\Users\keato\coding\franchise-db-pipeline\data\exports\mvp_franchise_cards.json
```

20개 브랜드가 들어 있다.

### major 4 브랜드

```text
C:\Users\keato\coding\franchise-db-pipeline\data\exports\mvp_franchise_cards_major4.json
```

카드 수:

```text
4
```

브랜드:

```text
푸라닭
비에이치씨(BHC)
비비큐(BBQ)
교촌치킨
```

JSON 구조는 기존 `mvp_franchise_cards.json`과 같은 `cards` 배열 구조다.

예: 푸라닭 카드의 주요 값

```text
title: 푸라닭
val: 주의
row1Val: 7,854만원
row1Label: 총 예상 창업 비용
tags:
- 종합 위험 주의
- 숨은 비용 주의
- 자율성 정보 부족
```

## 이미 해본 테스트

### 20건 JSON 테스트

`generated-franchise-cards.json`으로 MVP 첫 카드 1개를 임시 교체해 본 적이 있다.

결과:

```text
npm run build 성공
dev server HTTP 200 응답 확인
```

브라우저 스크린샷 검증은 이 환경에서 브라우저 실행 파일이 바로 잡히지 않아 하지 못했다.

테스트 후 MVP 코드는 원래 상태로 복구했다.

현재 MVP 저장소에는 테스트용 mapper/data.js 변경이 남아 있지 않다.

## 확인된 문제

### 1. DB 구조와 MVP UX 구조가 다르다

DB는 브랜드별 분석 row 구조다.

```text
brand_name
total_estimated_startup_cost_krw
average_sales_krw
overall_risk_grade
overall_summary
```

MVP는 질문형 UX 구조다.

```text
이거 괜찮을까?
얼마 드나?
얼마 남나?
어디서 망하나?
```

따라서 DB row를 그대로 MVP 카드로 넣으면 화면의 성격이 바뀐다.

### 2. 첫 화면 카드 전체 교체는 UX를 크게 바꾼다

예: 푸라닭

기존 MVP 느낌:

```text
푸라닭치킨
소자본 가능
1억으로 치킨집, 진짜 될까?
```

DB JSON 적용 느낌:

```text
푸라닭
주의
7,854만원
총 예상 창업 비용
```

이 경우 기존 MVP의 말투, 질문형 흐름, 스토리텔링이 약해지고 데이터 리포트처럼 보인다.

### 3. 버튼 target이 아직 실제 MVP 화면과 안 맞는다

export JSON의 `qBtn.target`은 다음처럼 생겼다.

```text
brand-289728
```

하지만 MVP의 실제 화면 키는 다음과 같다.

```text
spura0
sbhc0
sbbq0
sgyo0
```

따라서 JSON의 버튼을 그대로 쓰면 없는 화면으로 이동할 위험이 있다.

테스트 단계에서는 `qBtn`을 끄거나 기존 target으로 별도 매핑해야 한다.

### 4. 첫 화면은 DB, 상세 화면은 하드코딩이면 흐름이 어색하다

예:

```text
첫 화면: 푸라닭 / 주의 / 7,854만원
상세 화면: 소자본 가능 / 1억 내외 / 기존 카피
```

이렇게 되면 사용자가 숫자와 메시지가 안 맞는다고 느낄 수 있다.

## 현재 판단

현재 DB에 MVP UX를 맞춰서 화면을 바꾸는 것은 적절하지 않다.

이유:

```text
DB도 아직 실험 단계
MVP도 아직 하드코딩 기반 실험 단계
DB 정보량이 아직 UX를 재설계할 만큼 충분하지 않음
첫 화면만 DB형으로 바꾸면 상세 흐름과 일관성이 깨짐
```

더 적절한 방향은 다음이다.

```text
MVP가 검증하려는 질문형 UX를 먼저 유지한다.
그 UX가 필요한 데이터 항목을 정의한다.
DB 파이프라인이 그 항목을 뽑도록 추출 스키마를 보강한다.
```

즉:

```text
DB에 맞춰 UX를 바꾸는 것
```

보다

```text
UX에 맞춰 DB 추출 항목을 설계하는 것
```

이 현재 단계에서는 더 안전하다.

## 권장 아키텍처

기존 `franchise_analysis` 테이블은 유지한다.

이 테이블은 원자료/분석 보존용이다.

그 위에 MVP용 가공 레이어를 추가한다.

가능한 형태:

```text
data/exports/mvp_answer_cards.json
```

또는 나중에:

```text
public.franchise_mvp_cards
```

역할 분리:

```text
franchise_analysis
= 원자료/분석 보관용

mvp_answer_cards 또는 franchise_mvp_cards
= MVP 질문형 화면에 바로 쓰기 좋은 구조
```

흐름:

```text
원자료
-> Gemini facts/analysis
-> franchise_analysis 저장
-> MVP 질문별 mapper/추가 분석
-> MVP용 JSON 또는 테이블 생성
-> MVP 화면
```

## MVP용 스키마 방향

MVP 질문별 answer block 구조가 필요하다.

예상 예:

```json
{
  "brand": "푸라닭",
  "screens": {
    "overview": {
      "title": "이거 괜찮을까?",
      "value": "주의",
      "summary": "브랜드는 안정적이나 비용 구조 확인 필요",
      "confidence": "MEDIUM"
    },
    "startupCost": {
      "title": "얼마 드나?",
      "value": "7,854만원",
      "note": "공정위 기준 총 예상 창업 비용",
      "confidence": "MEDIUM"
    },
    "profit": {
      "title": "얼마 남나?",
      "value": "추정 보류",
      "note": "평균매출은 있으나 인건비/월세 정보 부족",
      "confidence": "LOW"
    },
    "failureRisk": {
      "title": "어디서 망하나?",
      "value": "숨은 비용 주의",
      "note": "추가 비용과 운영 자율성 확인 필요",
      "confidence": "MEDIUM"
    }
  }
}
```

이 구조가 안정되면 나중에 테이블로 만들 수 있다.

## 선택지

### 선택지 A: major4 JSON으로 첫 화면 4개 카드만 교체

장점:

```text
DB export가 MVP에서 렌더링되는지 빠르게 확인 가능
작업 범위가 작음
```

단점:

```text
첫 화면 톤이 데이터 리포트처럼 바뀜
상세 화면과 메시지 불일치 가능
qBtn target 처리 필요
```

### 선택지 B: 첫 카드 1개만 교체

장점:

```text
가장 안전한 렌더링 테스트
기존 카드와 비교 가능
```

단점:

```text
DB 연결 실험으로는 제한적
UX 전체 판단은 어려움
```

### 선택지 C: 기존 카드에 DB 근거만 주입

예:

```text
기존 푸라닭 카드 유지
row1Val 또는 tag 일부만 DB 값으로 교체
```

장점:

```text
UX 변화가 작음
기존 화면 흐름 유지
```

단점:

```text
기존 하드코딩 수치와 DB 수치가 충돌할 수 있음
사용자가 일관성 부족을 느낄 수 있음
```

### 선택지 D: DB 파이프라인 추출 스키마를 MVP 질문형으로 보강

장점:

```text
장기적으로 가장 일관성 있음
UX를 DB에 끌려가게 하지 않음
MVP 질문에 맞는 데이터가 쌓임
```

단점:

```text
추가 설계와 파이프라인 수정이 필요
즉시 화면 연결 테스트는 느려짐
```

## 현재 추천

단기:

```text
major4 JSON을 MVP에 바로 영구 적용하지 않는다.
필요하면 첫 카드 또는 첫 화면 4개 렌더링 테스트만 하고 원복한다.
```

중기:

```text
MVP 질문형 UX 기준으로 필요한 데이터 항목을 정의한다.
DB 파이프라인에 MVP answer block export를 추가한다.
```

장기:

```text
정적 JSON export로 안정화
-> Supabase 직접 조회 또는 MVP용 테이블로 전환
```

## 다른 AI에게 묻고 싶은 질문

1. 현재 단계에서 DB row 기반 카드 전체 교체가 적절한가?
2. MVP 질문형 UX를 유지하려면 어떤 answer schema가 가장 좋을까?
3. `franchise_analysis` 위에 MVP용 view/table을 추가하는 것이 좋은가, 아니면 JSON export만 유지하는 것이 좋은가?
4. 공정위 정보공개서 원자료만으로 "얼마 남나?"를 어디까지 안전하게 말할 수 있는가?
5. 기존 MVP의 감성 카피와 DB 분석 요약을 어떻게 분리/결합해야 UX가 덜 깨지는가?
