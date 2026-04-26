# Codex 전달용 확장 수정 지시서

## 목적

`data.js`의 수치 중 공정위 공식값과 불일치하는 항목뿐 아니라, 공개 출처로 교차검증이 어려운 브랜드별 추정 수치도 검증 가능한 대체 지표로 바꾼다. 이 문서는 코드 수정 전용이며, 앱 데이터 자체는 아직 수정하지 않는다.

## 작업 원칙

- 아래 표의 `수정값/대체값`을 기준으로 `data.js` 문자열을 수정한다.
- `폐업 원인`, `인지도`, `재방문율`, `배달앱 상위 %`처럼 출처 없는 브랜드별 비율은 숫자를 억지로 유지하지 말고 공개 출처가 있는 지표로 바꾼다.
- `월 순이익`은 브랜드별 실제 순이익 공개값이 아니라 추정치이므로, 단정형 숫자보다 `순이익률 7~12% 기준 추정` 같은 설명형으로 바꾼다.
- 앱 말투는 유지하되, “폐업의 38%”, “인지도 99%”처럼 근거가 약한 단정은 피한다.
- 아래에 없는 항목은 임의 수정하지 않는다.

## 출처 기준

- 공정위 정보공개서 공식값: 창업비, 가맹비, 교육비, 보증금, 인테리어비, 가맹점 수, 평균매출.
- 한국소비자원: 치킨 배달서비스 만족도, 선택 이유, 피해유형.
- 뉴스/보고서 인용: 치킨 원가율, 이익률, 음식업 폐업률, 사업 부진 폐업 사유, 시장 포화.
- 출처가 없는 브랜드별 내부 추정 비율은 앱 가정값으로 남기지 말고, 가능한 경우 검증 가능한 범용 지표로 교체한다.

## 1. 확정 수정 항목

공식값과 직접 불일치하거나 단위 오류 가능성이 큰 항목이다.

| 위치 힌트 | 항목 | 현재값 | 수정값 | 이유 | 근거 출처 |
|---|---|---|---|---|---|
| `s5` BHC 가맹비 카드 | BHC 가맹비 | `770만원` | `1,100만원` | 공식값 11,000천원 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `s5` BHC 가맹비 카드 | BHC 가맹비 설명 | `770만원 일시납 (딜리버리 기준)` | `1,100만원 일시납` | 타입별 770만원 근거 부족 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `s5` BHC 가맹비 카드 | BHC 가맹비 태그 | `비어존은 1,100만` | `공식 1,100만` | 타입별 차이보다 공식값 강조 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `s5` BHC 가맹비 카드 | BHC 가맹비 인사이트 | `딜리버리 770만, 비어존 1,100만 원이에요.` | `공식 가맹비는 1,100만 원이에요.` | 타입별 금액 문구 제거 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sbhc0` BHC 얼마 드나 카드 | BHC 가맹비 요약 태그 | `가맹비 900만` | `가맹비 1,100만` | 공식값과 불일치 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `spura0` 푸라닭 얼마 드나 카드 | 푸라닭 가맹비 요약 태그 | `가맹비 500만` | `가맹비 1,100만` | 공식값과 불일치 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sgyo5` 교촌 가맹비 카드 | 교촌 가맹비 | `660만원` | `676.5만원` | 공식값 6,765천원 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sgyo5` 교촌 가맹비 카드 | 교촌 가맹비 설명 | `660만원 일시납(표준·VAT)` | `676.5만원 일시납` | 공식값 반영 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sgyo5` 교촌 가맹비 카드 | 교촌 가맹비 인사이트 | `660만 원, 교육비 355만 별도예요.` | `676.5만 원, 교육비 355만 별도예요.` | 교육비는 유지, 가맹비만 수정 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sgyo5` 교촌 숨겨진 비용 카드 | 교촌 보증금 | `보증금 1,000만` | `보증금 100만` | 공식값 1,000천원 = 100만원 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sgyo5` 교촌 숨겨진 비용 카드 | 교촌 보증금 인사이트 | `보증금 1,000만은 계약 종료 시 돌려받아요.` | `보증금 100만은 계약 종료 시 돌려받아요.` | 단위 오류 수정 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sbbq0` BBQ 얼마 드나 카드 | BBQ 총 창업비용 요약 | `7,575만원` | `공식 부담금 9,078.9만원` | 공식 부담금 합계 90,789천원 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sbbq0` BBQ 얼마 드나 카드 | BBQ 총 창업비용 설명 | `총 7,575만원 (올리브치킨 15평)` | `공식 부담금 9,078.9만원` | “총” 범위가 불명확 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| `sbbq5` BBQ 섹션 제목 | BBQ 총 창업비용 섹션 제목 | `총 7,575만원 (올리브치킨 기준)` | `공식 부담금 9,078.9만원` | 총 창업비용 단정 회피 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
## 2. 운영수익 현실화 수정

월 순이익은 브랜드별 실제 공개값이 없으므로, 단정형 숫자보다 공개 원가율·이익률 기준의 추정 문구로 바꾼다. 프랜차이즈 치킨 한 마리 기준 이익률 11.7% 보도, 원가율 52.7% 보도, 치킨집 사례 순이익률 10% 미만 보도를 함께 고려한다.

| 위치 힌트 | 항목 | 현재값 | 수정값/대체값 | 이유 | 근거 출처 |
|---|---|---|---|---|---|
| `sbhc0` 얼마 남나 카드 | BHC 월 순이익 요약 | `약 280만` | `약 100~150만` | 월매출 1,200만원에 순이익 280만원은 약 23%로 낙관적 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbhc0` 얼마 남나 카드 | BHC row1Val | `월 순이익 280만원` | `월 순이익 약 100~150만원` | 10~12% 수준으로 현실화 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbhc0` 얼마 남나 카드 | BHC 인사이트 | `잘 되면 한 달에 280만 남아요.` | `월매출 1,200만이면 순이익은 100만대가 더 현실적이에요.` | 단정형 완화 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `s9` BHC 섹션 sub | BHC 수익 섹션 제목 | `월 순이익 약 280만 (20평·직원1명)` | `월 순이익 약 100~150만 (매출 1,200만 기준)` | 동일 값 정합성 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `s9` BHC 실제 순이익 카드 | BHC 실제 순이익 | `약 280만원` | `약 100~150만원` | 원가율·배달수수료 반영 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `s9` BHC 실제 순이익 카드 | BHC row1Val | `약 280만원` | `약 100~150만원` | 동일 값 정합성 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `s9` BHC 실제 순이익 카드 | BHC tag | `매출 1,500만 → 420만` | `매출 1,500만 → 150~180만` | 28% 수익률은 낙관적 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq0` 얼마 남나 카드 | BBQ 월 순이익 요약 | `약 340만` | `약 140~170만` | 월매출 1,400만원 기준 10~12% 수준 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq0` 얼마 남나 카드 | BBQ row1Val | `월 순이익 340만원` | `월 순이익 약 140~170만원` | 동일 값 정합성 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq0` 얼마 남나 카드 | BBQ 인사이트 | `잘 되면 한 달에 340만 남아요.` | `월매출 1,400만이면 순이익은 100만대 후반이 더 현실적이에요.` | 단정형 완화 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq9` BBQ 섹션 sub | BBQ 수익 섹션 제목 | `월 순이익 약 340만 (20평·직원1명)` | `월 순이익 약 140~170만 (매출 1,400만 기준)` | 동일 값 정합성 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq9` 실제 순이익 카드 | BBQ 실제 순이익 | `약 340만원` | `약 140~170만원` | 원가율·배달수수료 반영 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq9` 실제 순이익 카드 | BBQ row1Val | `약 340만원` | `약 140~170만원` | 동일 값 정합성 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sbbq9` 실제 순이익 카드 | BBQ tag | `매출 1,700만 → 480만` | `매출 1,700만 → 170~210만` | 28% 수익률은 낙관적 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sgyo0` 얼마 남나 카드 | 교촌 월 순이익 요약 | `약 500만` | `약 400~600만` 유지 가능 | 연 평균매출 7.3억 기준 7~10%면 월 426~606만원 수준 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `sgyo9` 실제 순이익 카드 | 교촌 순이익률 태그 | `순이익률 7~10%` | 유지 | 공개 사례 대비 보수적 범위 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `spura0` 얼마 남나 카드 | 푸라닭 월 순이익 요약 | `약 280만` | `약 260~380만` 또는 유지 | 연 평균매출 4.5억 기준 7~10%면 월 263~375만원 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `spura9` 실제 순이익 카드 | 푸라닭 순이익률 태그 | `순이익률 7~10%` | 유지 | 보수적 추정 범위 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
## 3. 인지도·재방문율 대체

브랜드별 `인지도 %`, `재방문율 %`, `배달앱 상위 %`는 공개 출처에서 같은 정의로 확인되지 않는다. 한국소비자원 만족도와 치킨 선택 이유 지표로 바꾼다.

공통 대체 기준:

- 한국소비자원 치킨 배달서비스 종합만족도: BBQ 3.63점, BHC 3.63점, 교촌 3.56점.
- 한국소비자원 치킨 선택 이유: 맛 58.4%, 가격 8.8%, 브랜드 신뢰 7.6%.
- 푸라닭은 해당 소비자원 8개 브랜드 조사 대상에 없어, 만족도 점수로 대체하지 말고 `소비자원 조사 대상 외` 또는 `가맹점 수 715개` 같은 공식 지표를 사용한다.

| 위치 힌트 | 항목 | 현재값 | 수정값/대체값 | 이유 | 근거 출처 |
|---|---|---|---|---|---|
| `s1` BHC 브랜드 파워 | BHC row1Val | `인지도 98%` | `만족도 3.63점` | 소비자원 조사값으로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `s1` BHC 브랜드 파워 | BHC row1Label | `재방문율 62% · 배달앱 상위 5%` | `브랜드 신뢰 선택 이유 7.6%` | 공개 출처 있는 지표로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `s1` BHC 브랜드 파워 | BHC tag | `로열티 2~3%` | `만족도 3.63점` 또는 삭제 | 로열티 수치 근거 불충분 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `s1` BHC 브랜드 파워 | BHC insight | `로열티가 매달 2~3% 빠져나가요.` | `브랜드 신뢰보다 맛과 가격이 선택을 더 크게 좌우해요.` | 소비자원 선택 이유 반영 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sgyo1` 교촌 브랜드 파워 | 교촌 row1Val | `인지도 99%` | `만족도 3.56점` | 소비자원 조사값으로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sgyo1` 교촌 브랜드 파워 | 교촌 row1Label | `재방문율 68% · 배달앱 상위 3%` | `맛 58.4% · 가격 8.8%가 선택 핵심` | 공개 출처 있는 지표로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sgyo1` 교촌 브랜드 파워 | 교촌 tag | `로열티 2%` | 삭제 또는 `가격 민감도 주의` | 로열티 수치 근거 불충분 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sgyo1` 교촌 브랜드 파워 | 교촌 insight | `로열티가 매달 2% 빠져나가요.` | `가격·가성비 만족도는 치킨 배달서비스의 약점이에요.` | 소비자원 조사 반영 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq1` BBQ 브랜드 파워 | BBQ row1Val | `인지도 97%` | `만족도 3.63점` | 소비자원 조사값으로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq1` BBQ 브랜드 파워 | BBQ row1Label | `재방문율 60% · 해외 50개국 진출` | `맛 58.4% · 브랜드 신뢰 7.6%` | 소비자 선택 이유로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq1` BBQ 브랜드 파워 | BBQ tag | `로열티 2~3%` | 삭제 또는 `가격 민감도 주의` | 로열티 수치 근거 불충분 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq1` BBQ 브랜드 파워 | BBQ insight | `로열티가 매달 2~3% 빠져나가요.` | `프리미엄 이미지는 강하지만 가격 민감도도 같이 봐야 해요.` | 공개 지표 기반 표현 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `spura1` 푸라닭 브랜드 파워 | 푸라닭 row1Val | `인지도 60%` | `가맹점 715개` | 공식 정보공개서 지표로 대체 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) / [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `spura1` 푸라닭 브랜드 파워 | 푸라닭 row1Label | `재방문율 55% · 허브치킨 마니아층` | `소비자원 8개 브랜드 만족도 조사 대상 외` | 동일 정의 출처 없음 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) / [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `spura1` 푸라닭 브랜드 파워 | 푸라닭 val | `중하위` | `중견` 또는 유지 | 숫자 과장 제거가 핵심 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) / [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
## 4. 폐업 원인 비율 대체

현재 브랜드별 `폐업의 35%`, `입지 38%`, `가격저항 32%`, `집객부족 40%`는 같은 정의의 공개 출처 확인이 어렵다. 음식업 폐업률 16.2%, 폐업 사유 중 사업 부진 48.9%, 치킨집 폐업 매년 8천개 이상 같은 검증 가능한 지표로 바꾼다.

공통 대체 기준:

- 음식업 폐업률: 16.2%.
- 전체 폐업 사업자 중 사업 부진 사유: 48.9%.
- 치킨집은 2016~2018년에 매년 8천개 이상 폐업한 것으로 보도됨.
- 따라서 브랜드별 원인 %를 제시하지 말고 `사업 부진·상권·비용 부담` 중심의 설명형 카드로 바꾼다.

| 위치 힌트 | 항목 | 현재값 | 수정값/대체값 | 이유 | 근거 출처 |
|---|---|---|---|---|---|
| `sbhc0` 왜 망하나 카드 | BHC val | `입지 1위` | `사업 부진 주의` | 브랜드별 원인 1위 근거 없음 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbhc0` 왜 망하나 카드 | BHC row1Val | `입지 미스매치 38%` | `음식업 폐업률 16.2%` | 공개 출처 있는 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbhc0` 왜 망하나 카드 | BHC tags | `입지 38%`, `자금 31%`, `본사갈등 18%` | `사업 부진 48.9%`, `상권 점검`, `비용 부담` | 근거 없는 세부 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `s1` 운영 고비 카드 | BHC row1Val | `3년 내 폐업률 30%` | `음식업 폐업률 16.2%` | 3년 내 브랜드별 폐업률 근거 부족 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `s13` BHC 입지 미스매치 카드 | BHC val/row1Val | `38%`, `폐업의 38%` | `사업 부진 48.9%` | 폐업 사유 공개 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `s13` BHC 자금 소진 카드 | BHC val | `31%` | `비용 부담` | 브랜드별 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `s13` BHC 본사 갈등 카드 | BHC val | `18%` | `계약 리스크` | 브랜드별 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `s13` BHC 체력 고비 카드 | BHC val/row1Val | `13%`, `폐업의 13%` | `장시간 운영 부담` | 브랜드별 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo0` 왜 망하나 카드 | 교촌 val | `자금 1위` | `비용 부담 주의` | 브랜드별 원인 1위 근거 없음 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo0` 왜 망하나 카드 | 교촌 row1Val | `자금 소진 35%` | `사업 부진 48.9%` | 공개 폐업 사유 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo0` 왜 망하나 카드 | 교촌 tags | `자금 35%`, `입지 33%`, `본사갈등 20%` | `사업 부진 48.9%`, `초기비용 부담`, `상권 점검` | 근거 없는 세부 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo1` 운영 고비 카드 | 교촌 row1Val | `3년 내 폐업률 28%` | `음식업 폐업률 16.2%` | 브랜드별 3년 폐업률 근거 부족 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo13` 자금 소진 카드 | 교촌 val/row1Val | `35%`, `폐업의 35%` | `사업 부진 48.9%` | 공개 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo13` 입지 미스매치 카드 | 교촌 val/row1Val | `33%`, `폐업의 33%` | `상권 미스매치` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo13` 본사 갈등 카드 | 교촌 val/row1Val | `20%`, `폐업의 20%` | `계약 리스크` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sgyo13` 체력 고비 카드 | 교촌 val/row1Val | `12%`, `폐업의 12%` | `장시간 운영 부담` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbbq0` 왜 망하나 카드 | BBQ val | `가격저항 1위` | `가격 민감도 주의` | 원인 1위 근거 없음 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbbq0` 왜 망하나 카드 | BBQ row1Val | `가격저항 32%` | `가격 선택 이유 8.8%` | 소비자원 선택 이유 지표로 대체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq0` 왜 망하나 카드 | BBQ tags | `가격저항 32%`, `입지 31%`, `자금소진 25%` | `가격 8.8%`, `상권 점검`, `사업 부진 48.9%` | 근거 있는 지표로 교체 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq1` 운영 고비 카드 | BBQ row1Val | `3년 내 폐업률 29%` | `음식업 폐업률 16.2%` | 브랜드별 3년 폐업률 근거 부족 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbbq13` 가격 저항 카드 | BBQ val/row1Val | `32%`, `폐업의 32%` | `가격 선택 이유 8.8%` | 가격 민감도를 폐업 원인처럼 표현하지 않기 | [한국소비자원](https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810) |
| `sbbq13` 입지 미스매치 카드 | BBQ val/row1Val | `31%`, `폐업의 31%` | `상권 미스매치` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbbq13` 자금 소진 카드 | BBQ val | `25%` | `비용 부담` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `sbbq13` 본사 갈등 카드 | BBQ val/row1Val | `12%`, `폐업의 12%` | `계약 리스크` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura0` 왜 망하나 카드 | 푸라닭 val | `집객 1위` | `집객 리스크` | 브랜드별 원인 1위 근거 없음 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura0` 왜 망하나 카드 | 푸라닭 row1Val | `집객 부족 40%` | `사업 부진 48.9%` | 공개 폐업 사유 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura0` 왜 망하나 카드 | 푸라닭 tags | `집객부족 40%`, `입지 30%`, `자금소진 20%` | `사업 부진 48.9%`, `상권 점검`, `마케팅비 부담` | 근거 없는 세부 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura1` 운영 고비 카드 | 푸라닭 row1Val | `3년 내 폐업률 33%` | `음식업 폐업률 16.2%` | 브랜드별 3년 폐업률 근거 부족 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura13` 집객 부족 카드 | 푸라닭 val/row1Val | `40%`, `폐업의 40%` | `사업 부진 48.9%` | 공개 폐업 사유 지표로 대체 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura13` 입지 미스매치 카드 | 푸라닭 val/row1Val | `30%`, `폐업의 30%` | `상권 미스매치` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura13` 자금 소진 카드 | 푸라닭 val | `20%` | `비용 부담` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
| `spura13` 체력 고비 카드 | 푸라닭 val/row1Val | `10%`, `폐업의 10%` | `운영·마케팅 부담` | 비율 제거 | [매일일보 폐업률](https://www.m-i.kr/news/articleView.html?idxno=1200418) |
## 5. 유지 가능 항목

아래는 크게 벗어나지 않거나 앱 가정값으로 둘 수 있어 우선 수정하지 않는다.

| 항목군 | 유지 이유 | 근거 출처 |
|---|---|---|
| `재료비 45~50%` | 치킨 원가율 52.7% 보도와 큰 방향이 맞음 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `순이익률 7~10%` | 치킨 한 마리 최종 이익률 11.7% 보도보다 보수적 | [매일일보 치킨 원가율](https://www.m-i.kr/news/articleView.html?idxno=949239) |
| `인건비 200~250만원` | 2025년 최저임금 월 환산액 2,096,270원, 2026년 2,156,880원 기준으로 크게 이상하지 않음 | [고용노동부 2025 최저임금](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16902) / [고용노동부 2026 최저임금](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144) |
| `임대료 120~150만원`, `상권에 따라 50~500만 차이` | 지역·상권 차이가 커서 범위형 표현은 유지 가능 | [뉴시스 상권자료](https://www.newsis.com/view/NISX20230428_0002285440) |
| `치킨집 전국 8.7만개` | 2019년 KB 자영업 분석 보도와 일치하는 과거 지표. 최신 지표로 바꾸려면 `전체 치킨전문점 3만9,789개(2023년)` 또는 `프랜차이즈 3만1,397개(2024년)`로 별도 일괄 변경 필요 | [연합뉴스 KB 치킨집 보고서](https://www.yna.co.kr/view/AKR20190602047700002) |
| 인테리어비 중 15평/33㎡/66㎡가 명시된 항목 | 기준 면적이 다르면 공식 66㎡ 값과 단순 비교하지 않음 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
| 장비/설비비 | 공식 기타비용과 1:1 대응되지 않아 임의 교체하지 않음 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
## 6. 선택 수정 항목

앱의 최신성을 높이고 싶으면 수정한다.

| 위치 힌트 | 항목 | 현재값 | 선택 수정값 | 이유 | 근거 출처 |
|---|---|---|---|---|---|
| 경쟁 강도 카드 공통 | 전국 치킨집 수 | `치킨집 전국 8.7만개` | `전체 치킨전문점 3만9,789개` | 8.7만은 2019년 KB 보고서 기준, 최신 국가통계포털 보도는 2023년 3만9,789개 | [연합뉴스 KB 치킨집 보고서](https://www.yna.co.kr/view/AKR20190602047700002) / [뉴시스 상권자료](https://www.newsis.com/view/NISX20230428_0002285440) |
| 경쟁 강도 카드 공통 | 프랜차이즈 시장 규모 | 없음 | `프랜차이즈 치킨 3만1,397개` | 2024년 프랜차이즈 통계 보도 기준 | [연합뉴스 KB 치킨집 보고서](https://www.yna.co.kr/view/AKR20190602047700002) / [뉴시스 상권자료](https://www.newsis.com/view/NISX20230428_0002285440) |
| `s0` 홈 카드 순위 | 교촌/BBQ/BHC 순위 | `업계 1/2/3위` | 기준에 따라 `매출: BHC 1위, BBQ 2위, 교촌 3위` 또는 `가맹점 수: BBQ 1위, BHC 2위, 교촌 3위` | 순위 기준 명시 필요 | [공정위 정보공개서](https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do) |
## 행별 출처 사용법

- 각 표의 `근거 출처` 컬럼은 해당 수정 제안의 최소 근거다.
- 공정위 공식값과 일반 기사·소비자원 지표가 충돌하면 공정위 공식값을 우선한다.
- 폐업 원인·인지도·재방문율처럼 기존 항목 정의가 공개 출처와 맞지 않는 경우, 기존 숫자를 유지하지 말고 표의 대체 지표로 바꾼다.
- `유지 가능 항목`은 Codex가 수정하지 않아야 하는 항목이다.

## 7. 예상 수정 개수

| 구분 | 예상 수정 단위 |
|---|---:|
| 확정 공식값 수정 | 14개 |
| 운영수익 현실화 수정 | 14개 수정, 4개 유지 |
| 인지도·재방문율 대체 | 15개 내외 |
| 폐업 원인 비율 대체 | 32개 내외 |
| 선택 수정 | 3개 내외 |
| 총 수정 가능 항목 | 약 75개 |
| 실제 권장 수정 항목 | 약 60~65개 |

## 8. 주요 출처

- 공정위 정보공개서 열람: https://franchise.ftc.go.kr/mnu/00013/program/userRqst/list.do
- 한국소비자원 치킨 배달서비스 만족도 조사: https://www.kca.go.kr/smartconsumer/sub.do?menukey=7714&mode=view&no=1002871810
- 치킨 원가율·이익률 보도: https://www.m-i.kr/news/articleView.html?idxno=949239
- 음식업 폐업률·사업 부진 폐업 사유 보도: https://www.m-i.kr/news/articleView.html?idxno=1200418
- 치킨 창업비·월매출·상권 자료 보도: https://www.newsis.com/view/NISX20230428_0002285440
- 2025년 최저임금 월 환산액: https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=16902
- 2026년 최저임금 월 환산액: https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144
- 치킨집 8.7만개 KB 보고서 인용 보도: https://www.yna.co.kr/view/AKR20190602047700002
