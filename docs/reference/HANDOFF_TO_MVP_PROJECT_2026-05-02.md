# Handoff to MVP Project - Franchise DB Pipeline

작성일: 2026-05-02

## 목적

이 문서는 `franchise-db-pipeline` 프로젝트에서 현재까지 만든 데이터 파이프라인 상태를 MVP 프로젝트 쪽에 전달하기 위한 문서다.

핵심 목적은 MVP 프로젝트가 이 데이터를 어떤 JSON 구조나 화면 구조로 받아야 할지 자율적으로 판단할 수 있게 하는 것이다.

현재 목표는 완성된 상용 DB가 아니라, 다음 흐름을 실제로 경험하고 검증하는 것이다.

```text
source data -> parsing/filtering -> LLM interpretation -> database writing -> MVP connection
```

현재 이 중 `database writing` 단계까지 성공했다.

## 현재 완료된 단계

### 1. 원본 데이터

공정위 가맹사업 정보공개서 API/XML 데이터를 사용했다.

원본 XML은 이 프로젝트에 저장되어 있다.

```text
data/raw_api/ftc_content_<jngIfrmpSn>.xml
data/raw_api/ftc_title_<jngIfrmpSn>.xml
data/raw_api/ftc_sample_<jngIfrmpSn>.json
```

`jngIfrmpSn`은 공정위 정보공개서 문서 식별자로 사용하고 있다.

### 2. 필터링

큰 XML 전체를 바로 LLM에 넣지 않고, 주요 섹션만 추려서 LLM 입력 파일을 만들었다.

생성 위치:

```text
data/filtered/ftc_<jngIfrmpSn>_llm_input.txt
data/filtered/ftc_<jngIfrmpSn>_filter_report.json
data/filtered/ftc_<jngIfrmpSn>_llm_input_view.xls
```

이 단계는 의미를 해석하는 단계가 아니라, LLM에 보낼 원문 범위를 줄이는 전처리 단계다.

### 3. Gemini 분석

필터링된 텍스트를 Gemini에 보내서 `facts`와 `analysis` 구조의 JSON을 만들었다.

생성 위치:

```text
data/analysis/ftc_<jngIfrmpSn>_facts_analysis.json
data/analysis/ftc_<jngIfrmpSn>_facts_analysis_view.xls
```

분석 결과에는 대략 다음 내용이 들어간다.

```text
facts:
- 브랜드명
- 회사명
- 가맹점/직영점/개폐점 관련 정보
- 평균 매출
- 초기 비용
- 보증금
- 인테리어 비용
- 총 예상 창업 비용
- 로열티/광고비/필수 구매 관련 내용
- 계약 기간
- 운영 제한

analysis:
- exit_risk_grade
- hidden_cost_grade
- autonomy_grade
- overall_risk_grade
- overall_risk_summary
- evidence
- missing_or_unclear
```

위험도 등급은 다음 ASCII 값만 사용하도록 했다.

```text
HIGH
MEDIUM
LOW
UNKNOWN
```

금액 필드는 `_krw` suffix를 사용하며 원 단위 integer로 맞추는 보정 로직을 추가했다.

## 20건 테스트 상태

20건 자동화 테스트가 완료되었다.

요약 CSV:

```text
data/analysis/facts_analysis_20_summary.csv
```

업로드 상태 CSV:

```text
data/analysis/supabase_upload_20_status.csv
```

20건 모두 분석 및 DB 저장에 성공했다.

```text
completed: 20
failed: 0
```

대상 문서:

```text
207710 윤이불닭발
208362 하태준의 효자동닭꼬치
209044 비광닭발
209880 꾸바라치킨
212570 불로만치킨바베큐
212158 진도리닭도리탕
216466 슈퍼치킨
216940 한가네숯불닭갈비
219092 홍희통닭
230896 굽는치킨
230930 닭봉씨치즈순살두마리치킨
232674 추억닭발
232652 김선하의 닭갈비 궁중누룽지탕
232784 픽스치킨(PICKS CHICKEN)
234910 예술치킨(artchicken)
236104 새우치킨덤
236610 잉치킨
236164 홍초불닭발&막창
237100 코리엔탈깻잎두마리치킨
237106 꽉찬쌀통닭
```

## Supabase 저장 상태

Supabase에는 두 방식으로 저장되어 있다.

### 기존 연습용 구조

기존 테이블:

```text
brands
disclosure_documents
disclosure_extractions
```

분석 결과는 `disclosure_extractions`에 저장되어 있다.

구분값:

```text
extraction_version = v1-filtered-analysis
```

이 구조에서는 핵심 비교값은 `key_metrics` JSON에 들어가고, 전체 결과는 `extracted_json` JSON에 들어간다.

### 새 1차 wide 테이블

새 테이블도 생성되어 있다.

```text
public.franchise_analysis
```

20건이 저장되어 있다.

이 테이블은 MVP 연결을 실험하기 쉽게 만든 1차 테이블이다.  
완성 스키마가 아니라, MVP 연결과 조회 연습을 위한 넓은 구조다.

주요 컬럼:

```text
id
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
source
model
created_at
updated_at
```

저장 방식:

```text
Gemini 분석 결과 전체
-> full_result_json에 보관

facts만 따로
-> facts_json에 보관

analysis만 따로
-> analysis_json에 보관

MVP/검색/정렬에 자주 쓸 값
-> 일반 컬럼으로 복사
```

즉 Gemini 결과를 버린 것이 아니라, 전체 JSON을 보존하면서 핵심 값만 컬럼으로 한 번 더 꺼낸 구조다.

## 샘플 데이터 형태

`franchise_analysis` 테이블의 일부 row는 다음과 같은 의미를 가진다.

```text
jng_ifrmp_sn: 207710
brand_name: 윤이불닭발
company_name: (주)블러프컴퍼니
overall_risk_grade: MEDIUM
total_estimated_startup_cost_krw: 82500000
```

```text
jng_ifrmp_sn: 208362
brand_name: 하태준의 효자동닭꼬치
company_name: 하랑
overall_risk_grade: MEDIUM
total_estimated_startup_cost_krw: 30800000
```

```text
jng_ifrmp_sn: 209880
brand_name: 꾸바라치킨
company_name: (주)공존컴퍼니
overall_risk_grade: MEDIUM
total_estimated_startup_cost_krw: 20700000
```

## MVP 프로젝트에서 확인된 현재 구조

MVP 저장소:

```text
https://github.com/hermes-blue/chicken-mvp2-searching-style-cursor-.git
```

참고용으로 이 프로젝트 안에도 클론해 확인했다.

```text
external/chicken-mvp2/chicken-mvp
```

확인한 MVP 구조:

```text
React / Vite
```

핵심 파일:

```text
chicken-mvp/src/data.js
chicken-mvp/src/App.jsx
chicken-mvp/src/components/Card.jsx
chicken-mvp/src/lib/supabaseClient.js
```

현재 MVP는 대부분 `src/data.js`의 `screens` 객체에 하드코딩된 데이터를 사용한다.

MVP 카드 데이터는 대략 다음 구조를 기대한다.

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

반면 DB 테이블은 다음처럼 브랜드 분석 중심이다.

```text
brand_name
company_name
total_estimated_startup_cost_krw
overall_risk_grade
overall_summary
facts_json
analysis_json
full_result_json
```

따라서 DB row를 MVP에 바로 꽂으면 구조가 맞지 않는다.  
중간 변환층이 필요하다.

## MVP 연결 방향에 대한 현재 판단

이 문서 작성 시점의 판단은 다음과 같다.

MVP도 아직 확정된 구조가 아니고, DB도 학습용 1차 구조다.  
따라서 DB 구조를 MVP에 너무 강하게 맞추거나, MVP를 바로 DB 중심 앱으로 바꾸는 것은 아직 이르다.

안전한 방향은 다음 중 하나다.

### 방향 A: DB -> MVP용 JSON 생성

Supabase의 `franchise_analysis`를 읽어서 MVP가 쓰기 쉬운 JSON으로 변환한다.

예상 형태:

```text
Supabase franchise_analysis
-> generated franchise cards JSON
-> MVP data.js 또는 별도 JSON에서 사용
```

장점:

```text
기존 MVP 구조를 크게 깨지 않음
DB 연결 결과를 안정적으로 검증 가능
화면 문구와 카드 구조는 MVP 쪽에서 자유롭게 조정 가능
```

### 방향 B: MVP에서 Supabase 직접 조회

MVP 앱에서 `supabaseClient.js`를 사용해 `franchise_analysis`를 직접 조회한다.

장점:

```text
DB 변경이 즉시 MVP에 반영됨
나중에 검색/필터링 기능으로 확장하기 좋음
```

주의점:

```text
로딩 상태 필요
조회 실패 fallback 필요
현재 하드코딩 screens 구조와 충돌 가능
MVP 화면 흐름을 다시 설계해야 할 수 있음
```

### 방향 C: 정적 screens 일부만 DB 결과로 교체

현재 `screens` 구조는 유지하고, 브랜드 카드의 일부 숫자나 summary만 DB 기반 값으로 교체한다.

장점:

```text
가장 작은 변경으로 MVP 연결 경험 가능
기존 화면 흐름 유지
```

주의점:

```text
장기적으로는 데이터 구조가 지저분해질 수 있음
DB row와 화면 카드의 의미가 1:1로 맞지 않을 수 있음
```

## MVP 쪽에서 자율적으로 결정하면 좋은 질문

MVP 프로젝트 쪽에서는 다음 질문에 답하면서 JSON 형식을 정하는 것이 좋다.

```text
1. MVP는 브랜드 리스트를 보여줄 것인가, 질문형 화면 흐름을 유지할 것인가?
2. DB의 risk grade를 카드의 val로 쓸 것인가, 보조 태그로 쓸 것인가?
3. total_estimated_startup_cost_krw는 대표 비용으로 노출할 것인가?
4. overall_summary는 insight 문구로 쓸 것인가?
5. facts_json/analysis_json의 상세 정보는 상세 화면에서 열어볼 것인가?
6. Supabase 직접 조회가 필요한가, 아니면 정적 JSON 생성으로 충분한가?
```

## 주의할 점

### 1. 현재 분석 결과는 학습용이다

Gemini 분석은 실험용이며, 법률/투자 판단용으로 확정된 데이터가 아니다.

### 2. 금액 단위는 보정했지만 재검토 여지가 있다

`_krw` 필드는 원 단위로 맞추는 보정 로직을 넣었다.  
하지만 LLM 추출값이므로 MVP에서 중요한 숫자로 크게 노출하기 전에는 표본 검토가 필요하다.

### 3. risk grade는 비교용 신호다

`overall_risk_grade`, `exit_risk_grade`, `hidden_cost_grade`, `autonomy_grade`는 정량 점수가 아니라 LLM의 해석 결과다.  
MVP에서는 단정적 표현보다 “주의 신호” 또는 “요약 신호”로 쓰는 편이 안전하다.

### 4. MVP의 현재 텍스트 일부는 인코딩이 깨져 보인다

현재 MVP 코드의 일부 한글 문자열은 깨져 보인다.  
MVP 쪽에서 수정할 때 인코딩을 확인해야 한다.

### 5. DB와 MVP 구조는 의도적으로 다르다

DB는 원자료와 분석 결과 보존에 초점을 둔다.  
MVP는 사용자가 이해하기 쉬운 카드/질문 흐름에 초점을 둔다.  
따라서 둘 사이에 변환층이 있는 것이 자연스럽다.

## 이 프로젝트에서 만들어진 관련 파일

20건 준비:

```text
scripts/16_prepare_20_filtered_analysis_inputs.ps1
```

20건 필터링/분석:

```text
scripts/17_run_20_filtered_analysis_batch.ps1
```

기존 Supabase 구조 업로드:

```text
scripts/18_upload_20_analysis_to_supabase.ps1
```

새 wide 테이블 SQL:

```text
supabase/franchise_analysis_v1.sql
```

새 wide 테이블 업서트:

```text
scripts/19_upsert_franchise_analysis_table.mjs
```

20건 분석 요약:

```text
data/analysis/facts_analysis_20_summary.csv
```

20건 DB 업로드 상태:

```text
data/analysis/supabase_upload_20_status.csv
```

## 현재 상태 요약

```text
원본 XML 수집: 성공
필터링: 성공
Gemini facts + risk analysis: 20건 성공
Supabase 기존 구조 저장: 20건 성공
Supabase franchise_analysis 테이블 생성: 성공
franchise_analysis 20건 저장: 성공
MVP 연결: 아직 시작 전
```

현재 다음 단계는 MVP 프로젝트에서 이 데이터를 어떤 화면 구조나 JSON 구조로 받을지 결정하는 것이다.
