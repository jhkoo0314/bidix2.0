

```md
# 📖 BIDIX AI – Glossary for v2.2 (용어사전)

> 경매/부동산/시뮬레이션/엔진/정책 문맥에서 사용되는 **표준 용어 집합**입니다.  
> 코드, UI, PRD, 정책 문서와 **동일한 용어만 사용**해야 합니다. (SSOT)

---

## 1. 경매 기본 용어

| 용어 | 정의 | 비고 |
|------|------|------|
| 매각기일 | 법원이 해당 물건을 입찰·매각하는 날짜 | UI: Result Header |
| 최저매각가격(최저가) | 법원에서 정한 입찰 시작가. 감정가 × 회차별 비율 | Engine: Valuation |
| 감정가(Appraisal) | 감정평가사가 산정한 기준가. 시뮬레이션에서는 PropertyEngine이 생성 | `property.appraisalValue` |
| 유찰 | 입찰 없음/낙찰 실패 → 다음 회차로 넘어감 | `property.auctionStep` |
| 입찰보증금 | 보통 최저가 × 10% 예치 | (후속 버전에서 계산 예정) |
| 낙찰가 | 실제 입찰 성공 금액 (= userBid 또는 simulation 낙찰가) | Engine Input |

---

## 2. 부동산 / 매물 속성

| 용어 | 정의 | 비고 |
|:---|:---|:---|
| `PropertySeed` | Generator가 생성한 매물 입력 원본 데이터 | `types/property.ts` |
| `Property` | PropertyEngine이 정규화한, 계산 가능한 상태의 매물 데이터 | `types/property.ts` |
| 난이도(difficulty) | Easy / Normal / Hard. 생성/정책/수익 목표에 영향을 미치는 핵심 변수 | `types/property.ts`, `difficulty-policy` |

---

## 3. 시세 / 가치 평가 관련 용어

| 용어 | 정의 | 비고 |
|:-----|:-----|:-----|
| `appraisalValue` | 감정가. 법원 또는 감정평가사가 산정한 기준가. | `Property.appraisalValue` |
| `baseFMV` | 감정가에 정책 비율을 곱해 얻는 1차 시세. | `valuation.baseFMV` |
| `adjustedFMV` | 정책 클램프를 적용해 보정된 **현재 시세**. 초기 안전마진 계산 기준. | `valuation.adjustedFMV` |
| `exitPrice` | 보유 후(예: 6~12개월) 예상 매각가. 순이익/최종 마진 계산 기준. | ProfitEngine 내부 값 |
| `minBid` | 현재 회차에서의 최저입찰가(법원 최저가). | `valuation.minBid` |
| `recommendedBidRange` | AI가 제시하는 권장 입찰가 범위. | `valuation.recommendedBidRange` |
| `confidence` | 시세 평가에 대한 신뢰도(0.0~1.0). | `valuation.confidence` |

---

## 4. 권리 / 점유 관련 용어

| 용어 | 정의 | 비고 |
|:-----|:-----|:-----|
| `assumableRightsTotal` | 낙찰자가 승계해야 하는 권리(빚)의 총액. | `rights.assumableRightsTotal` |
| 말소기준권리(Base Right) | 인수/소멸 여부를 가르는 기준이 되는 권리. | `types/court-docs.ts` |
| 대항력 | 임차인이 새로운 집주인에게 권리를 주장할 수 있는 법적 힘. | CourtDocsLayer |
| `evictionCostEstimated` | 예상 명도 비용(협상·법적 비용 포함). | `rights.evictionCostEstimated` |

---

## 5. 수익 / 안전마진 관련 용어

| 용어 | 정의 | 비고 |
|:-----|:-----|:-----|
| `totalCost` | 취득비용+보유비용+이자비용 등을 모두 합친 총 원가. | `costs.totalCost` |
| 초기 안전마진 (`initialSafetyMargin`) | `(adjustedFMV - totalCost) / adjustedFMV` – **지금 당장 팔면 얼마나 싸게 산 것인가?** | `profit.initialSafetyMargin` |
| 예상 수익 마진 (`projectedProfitMargin`) | `(exitPrice - totalCost) / exitPrice` – **보유 후 매각 시 어느 정도 수익이 나는가?** | `profit.projectedProfitMargin` |
| ROI (`roi`) | `(netProfit / ownCash)` – 내 돈 기준 수익률. | `profit.roi` |
| 연환산 ROI (`annualizedRoi`) | 보유 기간을 1년 기준으로 환산한 ROI. | `profit.annualizedRoi` |
| 손익분기 매각가 (`breakevenExit`) | 손실을 보지 않는 최소 매각 가격 (= totalCost). | `profit.breakevenExit` |

> 💡 **중요 패턴:**  
> - `initialSafetyMargin` < 0 이지만  
> - `projectedProfitMargin` > 0 인 매물이 존재해야 한다.  
>   → “지금 팔면 손해지만, 6~12개월 보유 후 매각하면 이익”인 케이스를 시뮬레이션 가능해야 함.

---

## 6. 정책 / 시뮬레이션 용어

| 용어 | 정의 | 비고 |
|:-----|:-----|:-----|
| `Policy` | 계산에 사용되는 상수/규칙의 집합. | `lib/policy/policy.ts` |
| `defaultPolicy` | Normal 모드의 기준 정책. | `lib/policy/default-policy.ts` |
| 난이도별 정책 (`difficultyPolicy`) | Easy/Hard 모드에서 기본 정책을 덮어쓰기 위한 값. | `lib/policy/difficultypolicy.ts` |
| `simulationGenerator` | 난이도에 맞춰 PropertySeed + CourtDocs를 생성하는 총괄 생성기. | `lib/generators/` |
| `fixtures` | 고정된 테스트/데모용 시나리오 JSON. | `/fixtures/` |

---

## 7. UI / 학습 관련 용어

| 용어 | 정의 | 비고 |
|------|------|------|
| 입찰 추천가 | `valuation.recommendedBidRange`를 기반으로 안내하는 입찰가 범위 | Result UI |
| Risk Label | Low / Medium / High 형태의 위험도 라벨 | `summary.riskLabel` |
| Grade | S/A/B/C/D 등급 | `summary.grade` |
| History Mode | 사용자의 누적 시뮬레이션 기록 화면 | `/simulation/history` |

---

## 8. 문서 / PRD 관련 용어

| 용어 | 정의 |
|------|------|
| PRD | Product Requirement Document |
| SSOT | Single Source of Truth (단일 진실 공급원) |
| Domain Doc | 도메인 규격/정책을 정의하는 문서 |
| Fixture Spec | JSON 구조를 정의하는 문서(테스트/데모용) |

---

🔒 **END OF FILE**  
> Glossary는 용어가 추가/변경될 때 **가장 먼저** 업데이트해야 하는 문서입니다.
