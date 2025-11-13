

```md
# 🏆 Point & Level System Specification for v2.0
**Version:** 2.0
**Status:** ✅ Core Design Finalized
**Last Updated:** 2025-11-10
**Applies To:** Auction Engine v2.0

---

## 1. 시스템 개요

**목적:**
경매 시뮬레이션 수행 결과를 "데이터 기반 성장 경험"으로 전환하기 위한 **점수·레벨·랭킹 체계**를 정의합니다. 이는 단순한 게임화가 아닌, **의사결정의 품질을 평가하는 핵심 메트릭 시스템**입니다.

*   **점수:** 입찰 행위의 정확성, 수익성, 안정성을 종합 평가.
*   **레벨:** 누적된 학습량의 시각적 지표.
*   **랭킹:** 선의의 경쟁을 통한 학습 동기 부여.

---

## 2. 점수 구성 개요

```
Final Score (0 ~ 1,000) =
  Accuracy Score (0 ~ 400) +
  Profitability Score (0 ~ 400) +
  Risk Control Score (0 ~ 200)
```
> **설계 의도:** 실전에서 "정확히 쓰는 것 ≠ 수익이 나는 것 ≠ 리스크가 적은 것"은 독립적인 역량이므로, 세 영역을 분리하여 평가합니다.

---

## 3. 점수 산출 상세

### **3.1. 정확도 점수 (Accuracy Score)**
*   **기준:** 사용자의 입찰가(`userBid`)가 AI 권장 입찰가 범위(`recommendedBidRange`)의 중앙값과 얼마나 근접했는가.
```
accuracyScore = 400 - (|userBid - idealBid| / idealBid) * 400
```

### **3.2. 수익성 점수 (Profitability Score)**
*   **기준:** `ROI` 구간에 따른 기본 점수 + 보너스 점수. 모든 데이터는 `profitengine`의 최종 출력물(`Profit` 객체)을 사용합니다.

| 수익 구간 (ROI) | 기본 점수 |
|:---|:---:|
| 20% 이상 | 350-400 |
| 10% ~ 19% | 280-340 |
| 0% ~ 9% | 150-260 |
| 0% 미만 (손실) | 0-120 |

**보조 변수 (보너스):**
| 변수 | 설명 | 가중치 |
|:---|:---|:---:|
| `annualizedRoi` | **(효율성)** 연환산 ROI가 높을수록 가점 | +0 ~ 50 |
| **`initialSafetyMargin`** | **(안정성)** '초기 안전마진'이 높을수록 가점 | +0 ~ 30 |
| `breakevenExit` | **(안정성)** 손익분기점이 시세 대비 낮을수록 가점 | +0 ~ 20 |

### **3.3. 리스크 통제 점수 (Risk Control Score)**
*   **기준:** 인수해야 할 권리 금액, 명도 리스크 등을 얼마나 잘 통제했는가. "관리할수록 가점" 방식.

| 항목 | 기준 | 점수 |
|:---|:---|:---:|
| `assumableRightsTotal`| 인수 권리금액이 FMV 대비 낮을수록 가점 | 0-120 |
| `evictionRisk` | 명도 위험도가 낮을수록 가점 | 0-50 |
| `evictionCostEstimated`| 예상 명도 비용이 낮을수록 가점 | 0-30 |

---

## 4. 최종 점수 → 등급 변환

```
score → letter grade → UI 표시 → 랭킹 반영
```

| 점수 | 등급 | UI 색상 (Tailwind Token) |
|:---|:---|:---|
| 900~1000 | S | `text-purple-500` |
| 750~899 | A | `text-blue-500` |
| 600~749 | B | `text-green-500` |
| 450~599 | C | `text-yellow-500` |
| 0~449 | D | `text-red-500` |

---

## 5. 레벨 시스템 (Tier + Level)

*   **구조:** 점수는 매회차 계산, 레벨은 누적 경험치(EXP) 기반, 티어는 레벨 그룹명.
*   **경험치 획득 공식:**
    ```
    expGain = round(finalScore * 0.6 * difficultyMultiplier)
    ```
    *   `difficultyMultiplier`: Easy=0.8, Normal=1.0, Hard=1.2

| 티어 | 레벨 범위 | 필요 누적 EXP |
|:---|:---|:---|
| Bronze | Lv.1 ~ Lv.10 | 0 ~ 3,000 |
| Silver | Lv.11 ~ Lv.20 | 3,001 ~ 9,000 |
| Gold | Lv.21 ~ Lv.30 | 9,001 ~ 18,000 |
| Platinum | Lv.31 ~ Lv.40 | 18,001 ~ 30,000 |
| Diamond | Lv.41+ | 30,000+ |

---

## 6. 랭킹 구조

| 종류 | 설명 |
|:---|:---|
| **주간 랭킹** | 최근 7일 동안 획득한 누적 점수(`finalScore`의 합) 기준 |
| **통합 랭킹** | 전체 누적 경험치(`totalExp`) 기준 |
| **표시 방식** | 닉네임 / 레벨 / 티어 / 최근 최고 등급 노출 |

---

## 7. DB 연동 (Supabase)

| 테이블 | 주요 저장 필드 |
|:---|:---|
| `simulations` | `score_awarded` |
| `scores` | `user_id`, `level`, `score` (누적) |

> **SSOT:** 상세 스키마는 `/supabase/migrations/mvp_schema.sql`를 따릅니다.

---

## 8. 엔진 연결 방식

```
AuctionAnalysisResult (from auctionengine)
    ↓
scoreengine.calculate({ result, userBid, prevTotalExp })
    ↓
{ finalScore, grade, expGain, levelInfo? }
    ↓
DB 저장 (`simulations`, `scores` 테이블 업데이트)
```
> **SSOT:** `scoreengine.ts`의 계산 로직은 본 문서를 따릅니다.

---

## 9. Post-MVP 확장 계획

| 기능 | 버전 | 설명 |
|:---|:---:|:---|
| Daily Challenge 점수 보너스 | v2.1 | 연속 도전(streak) 시 보너스 EXP |
| 득점 그래프 / 히트맵 | v2.1 | 자신의 점수 분포를 시각적으로 분석 |
| PVP 모드 (동시 입찰 비교) | v2.2 | 다른 사용자와 동일한 시나리오로 실시간 경쟁 |

---
**END OF DOCUMENT**
```