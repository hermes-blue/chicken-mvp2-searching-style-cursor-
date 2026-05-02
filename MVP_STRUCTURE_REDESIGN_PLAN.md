# MVP Structure Redesign Plan

## 목적

치킨 창업 시뮬레이터 MVP는 기존에 `data.js` 중심의 하드코딩 구조로 만들어져 있다.
이제 DB 파이프라인과 연결하기 위해 MVP 구조를 다음처럼 정리한다.

```text
하드코딩 일부 유지
+ DB 컬럼 일부 사용
+ JSON 일부 사용
```

목표는 MVP 전체를 한 번에 갈아엎는 것이 아니라,
브랜드별 데이터만 점진적으로 DB/JSON 기반으로 옮기는 것이다.

---

## 기본 원칙

### 1. 하드코딩은 완전히 없애지 않는다

하드코딩으로 남겨도 되는 것:

```text
화면 흐름
질문 구조
버튼명
기본 UX 문구
공통 안내문
```

예:

```text
어느 브랜드가 궁금해?
이거 괜찮을까?
얼마 드나?
얼마 남나?
어디서 망하나?
```

이런 것은 서비스의 기본 구조이므로 코드에 남겨도 된다.

---

### 2. DB 컬럼은 핵심 숫자/비교값만 사용한다

컬럼으로 둘 값:

```text
brand_name
brand_key
disclosure_year
total_estimated_startup_cost_krw
average_sales_krw
initial_fee_krw
education_fee_krw
deposit_krw
interior_cost_krw
overall_risk_grade
```

기준:

```text
검색, 정렬, 비교, 계산에 자주 쓰는 값은 컬럼
```

예:

```text
창업비용 낮은 순
평균매출 높은 순
위험등급 비교
브랜드별 비용 비교
```

이런 값은 JSON보다 컬럼이 적합하다.

---

### 3. JSON은 설명/분석/출처/유연한 값을 담는다

JSON에 둘 값:

```text
AI 요약문
주의사항
브랜드별 해석
MVP용 카피
출처 정보
신뢰도
뉴스 요약
추정값 여부
빈값 상태
```

예:

```json
{
  "summary": "초기 비용은 낮지만 추가 비용 확인이 필요합니다.",
  "tags": ["숨은 비용 주의", "운영 자율성 확인"],
  "sources": {
    "startupCost": "공정위 정보공개서",
    "marketTrend": null
  },
  "confidence": {
    "startupCost": "HIGH",
    "profit": "UNKNOWN"
  }
}
```

기준:

```text
자주 바뀌거나 실험 중인 값은 JSON
```

---

## MVP 데이터 구조 방향

MVP는 최종적으로 다음 JSON을 읽는 구조가 좋다.

```text
src/data/mvp_answer_cards.json
```

예상 구조:

```json
{
  "brands": [
    {
      "brandKey": "pura",
      "brandName": "푸라닭",
      "displayName": "푸라닭치킨",
      "screens": {
        "overview": {
          "question": "이거 괜찮을까?",
          "value": "주의",
          "summary": "브랜드는 안정적이나 비용 구조 확인이 필요합니다.",
          "tags": ["숨은 비용 주의", "자율성 확인 필요"],
          "sourceType": "mixed",
          "confidence": "MEDIUM"
        },
        "startupCost": {
          "question": "얼마 드나?",
          "value": "7,854만원",
          "rawValue": 78540000,
          "summary": "공정위 기준 총 예상 창업비용입니다.",
          "sourceType": "official",
          "source": "공정위 정보공개서",
          "confidence": "HIGH"
        },
        "profit": {
          "question": "얼마 남나?",
          "value": null,
          "summary": "공식 자료만으로는 순이익 추정이 어렵습니다.",
          "sourceType": "unknown",
          "confidence": "UNKNOWN"
        },
        "failureRisk": {
          "question": "어디서 망하나?",
          "value": "추가 비용 확인 필요",
          "summary": "창업비용 외 추가 비용과 운영 자율성을 확인해야 합니다.",
          "sourceType": "analysis",
          "confidence": "MEDIUM"
        }
      }
    }
  ]
}
```

---

## 하드코딩 / 컬럼 / JSON 역할 분리

| 구분 | 역할 | 예시 |
|---|---|---|
| 하드코딩 | 앱의 기본 흐름 | 질문명, 버튼명, 화면 순서 |
| DB 컬럼 | 핵심 숫자/비교값 | 창업비용, 평균매출, 위험등급 |
| JSON | 설명/분석/출처 | 요약문, 태그, 신뢰도, 뉴스 해석 |

---

## 단계별 전환 계획

### 1단계: 4개 브랜드 부분 연결

대상:

```text
교촌치킨
비비큐(BBQ)
비에이치씨(BHC)
푸라닭
```

작업:

```text
기존 UX와 문구는 최대한 유지
DB에서 온 값으로 일부만 교체
```

우선 연결할 값:

```text
총 예상 창업비용
평균매출
위험등급
주의 태그
```

목표:

```text
DB → JSON → MVP 화면
```

이 흐름이 실제로 되는지 확인한다.

---

### 2단계: MVP 데이터 JSON화

기존 `data.js`에 박혀 있는 브랜드별 값을 줄이고,
브랜드 데이터는 JSON으로 분리한다.

남겨둘 것:

```text
화면 구조
공통 질문
공통 버튼
```

JSON으로 뺄 것:

```text
브랜드명
브랜드별 비용
브랜드별 매출
브랜드별 위험등급
브랜드별 요약문
브랜드별 태그
```

---

### 3단계: 10개 브랜드로 확장

4개 연결이 성공하면 브랜드를 10개 정도로 늘린다.

예상 후보:

```text
교촌치킨
비비큐(BBQ)
비에이치씨(BHC)
푸라닭
굽네치킨
네네치킨
처갓집양념치킨
페리카나
멕시카나
호식이두마리치킨
```

이때 목표는 브랜드 수가 아니라:

```text
브랜드 목록만 늘리면 JSON이 다시 생성되고 MVP가 읽는 구조
```

을 확인하는 것이다.

---

## 빈값 처리 원칙

못 채우는 값은 억지로 추정하지 않는다.

```json
{
  "profit": {
    "value": null,
    "sourceType": "unknown",
    "summary": "공식 자료 부족으로 아직 제공하지 않습니다."
  }
}
```

화면에서는 이렇게 표시한다.

```text
데이터 준비 중
공식 자료 부족
추정 보류
```

---

## 추정값 처리 원칙

추정값을 사용할 경우 반드시 표시한다.

```json
{
  "laborCost": {
    "value": 3500000,
    "sourceType": "estimate",
    "source": "기본 시나리오",
    "confidence": "LOW"
  }
}
```

공식값과 추정값을 섞어 쓰지 않는다.

---

## DB 파이프라인과의 연결

DB 프로젝트는 MVP가 바로 읽을 수 있는 JSON을 export해야 한다.

흐름:

```text
Supabase franchise_analysis
→ export script
→ mvp_answer_cards.json
→ chicken-mvp/src/data/
→ React 화면
```

MVP는 DB 구조를 직접 몰라도 된다.
MVP는 최종 JSON 형식만 읽는다.

---

## 중요한 판단

지금 단계에서 MVP 전체를 DB 구조에 맞춰 갈아엎으면 안 된다.

```text
DB에 맞춰 UX를 바꾸는 것 ❌
UX에 맞게 DB 출력물을 가공하는 것 ⭕
```

즉:

```text
franchise_analysis = 원자료/분석 저장소
mvp_answer_cards.json = MVP 화면용 가공 데이터
```

역할을 분리한다.

---

## 최종 방향

```text
하드코딩 = 화면 뼈대
DB 컬럼 = 핵심 숫자
JSON = 설명, 분석, 출처, 실험값
```

이 3개를 섞어서 MVP를 점진적으로 개선한다.

목표는 완벽한 DB 설계가 아니라:

```text
데이터가 MVP 화면까지 도착하고,
사용자가 판단할 수 있는 형태로 보이는 것
```

이다.
