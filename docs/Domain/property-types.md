```md
# 🏠 Property Type Specification for v2.2
**Version:** 2.2  
**Last Updated:** 2025-11-13  

> 이 문서는 BIDIX AI의 "매물 타입(Type) 시스템"에 대한 SSOT(Single Source of Truth)입니다.  
> **타입 코드 기준:** `/lib/types/property.ts`  
> **생성기 기준:** `/lib/generators/datasetpresets.ts`  
> **감정가/시세 기준:** `propertyengine.ts` + `valuationengine.ts`  
> **정책 기준:** `/lib/policy/defaultpolicy.ts`
> **한글 라벨 기준:** `/lib/utils/property-labels.ts`

---

## 1. 매물 분류 체계 (2단 구조)

| 1차 분류 (Category) | 2차 분류 (Type) 개수 | 적용 시점 | 설명 |
|:---|:---|:---|:---|
| **Residential (주거용)** | 6종 | ✅ **v2.x MVP 포함** | 엔진 및 UI의 기본 생성/분석 대상 |
| **Commercial (상업용)** | 5종 | ⏳ **v2.1+ 예정** | MVP에서는 생성 및 분석 비활성화 |

---

## 2. 주거용 6종 (MVP 적용 대상)

> 각 유형의 특성은 `/lib/generators/datasetpresets.ts`의 **면적 범위, 층수 범위, 지역별 가중치**에 반영됩니다.  
> 또한 **감정가(PropertyEngine)** 및 **FMV(ValuationEngine)** 계산 시 정책값에 간접적으로 영향을 줍니다.

| Enum 값 | 유형명 | 주요 특징 | 평균 명도 리스크 | 주요 학습 포인트 |
|:---|:---|:---|:---|:---|
| `apartment` | 아파트 | 가장 표준적인 주거용 매물. 시세 파악이 쉽고 거래량이 많음. | 낮음 | 기본 수익 구조 및 입찰가 산정, 안전마진 개념 이해 |
| `villa` | 빌라/다세대 | 시세 편차가 크고 소액임차인 등 권리 변수가 많음. | 중간 | 소액임차인, 확정일자, 보증금 인수 여부 분석 |
| `officetel` | 오피스텔 | 주거/업무 혼합, 임대수익형 성격 강함. | 낮음 | 임대수익률, 공실 리스크 반영한 FMV/Exit 분석 |
| `multi_house` | 다가구주택 | 임차인 다수, 명도 난이도 높음. | 높음 | 다수 임차인 명도 전략, 명도비용/시간 반영 |
| `detached` | 단독주택 | 건물+토지 가치 분리 평가, 노후도 영향 큼. | 중간 | 토지 가치, 노후도, 리모델링/재건축 시나리오 |
| `res_land` | 대지(주거) | 건물 없이 토지 단독. 개발/건축 계획 중요. | 없음 | 법정지상권, 분묘기지권 등 특수 권리 및 Exit 전략 |

---

## 3. 상업용 5종 (v2.1 이후 확장)

| Enum 값 | 유형명 | 핵심 리스크 요소 | 수익 구조 |
|:---|:---|:---|:---|
| `store` | 상가 | 공실, 상권 변화, 권리금 | 임대수익(NOI) |
| `office` | 사무실 | 공실, 경기 변동 | 임대수익(NOI) |
| `factory` | 공장 | 환경/산업 규제, 특수 설비 | 임대 또는 매각 |
| `warehouse` | 창고 | 물류 수요 변동 | 임대수익(NOI) |
| `com_land` | 상업용 토지 | 인허가, 용도지역, 개발 가능성 | 개발 또는 매각 |

---

## 4. 유형별 정책(Policy) 연관 키

> 각 매물 유형은 **직접적인 정책 키**는 적지만,  
> 감정가/시세/비용/수익 계산에 **간접적인 영향**을 줍니다.

| 정책 영역 | 키 (예시) | 설명 | 유형과의 관계 |
|:---|:---|:---|:---|
| Valuation | `baseFMVRate` | 감정가 대비 FMV 평균 비율 | 유형별 감정가 수준은 PropertyEngine에서, FMV 비율은 전 유형 공통 정책으로 관리 |
| Valuation | `fmvClamp.min/max` | 감정가 대비 시세 하/상한 | 시세가 과도하게 낮거나 높은 유형을 보호하는 안정장치 |
| Cost | `repairRate` | 감정가 대비 수리비 비율 | 단독/다가구는 상대적으로 높은 수리비, 아파트/오피스텔은 낮음 |
| Cost | `loanLtvDefault` | 기본 LTV 비율 | 아파트/오피스텔 > 빌라 > 토지 순으로 적용 가능 (난이도 정책에서 조절) |
| Profit | `targetMarginRate` | 목표 초기 안전마진 | Easy/Hard 모드에서 동일 유형이라도 다른 목표 적용 |

---

## 5. 타입 enum 정의 (SSOT: `property.ts`)

```ts
// /lib/types/property.ts
export enum PropertyCategory {
  Residential = "residential",
  Commercial = "commercial",
}

export enum PropertyType {
  Apartment       = "apartment",
  Villa           = "villa",
  Officetel       = "officetel",
  MultiHouse      = "multi_house",
  Detached        = "detached",
  ResidentialLand = "res_land",

  Store           = "store",
  Office          = "office",
  Factory         = "factory",
  Warehouse       = "warehouse",
  CommercialLand  = "com_land",
}
```

---

## 6. UI 표시 및 한글 라벨

> UI에서 PropertyType enum을 표시할 때는 반드시 한글 라벨 유틸리티를 사용해야 합니다.

### 한글 라벨 유틸리티

**파일 경로:** `/lib/utils/property-labels.ts`

**사용 방법:**
```ts
import { getPropertyTypeLabel } from "@/lib/utils/property-labels";

// PropertyType enum 값을 한글 라벨로 변환
const label = getPropertyTypeLabel(PropertyType.Apartment); // "아파트"
```

**매핑 규칙:**
- 모든 PropertyType enum은 `PROPERTY_TYPE_LABELS` 객체에 한글 라벨이 정의되어 있음
- 타입 안전성 보장: `Record<PropertyType, string>` 사용
- Fallback 처리: 매핑이 없으면 enum 값 그대로 반환

**적용 위치:**
- `components/simulations/PropertyCard.tsx` - 매물 타입 표시
- `components/simulations/SaleStatementSummary.tsx` - 부동산 표시
- `components/simulations/FilterBar.tsx` - 필터 버튼
- `app/simulations/[id]/page.tsx` - 메타데이터
- `app/simulations/[id]/result/page.tsx` - 메타데이터

**주의사항:**
- ❌ `property.type`을 직접 표시하지 않음 (영어 enum 값이 그대로 표시됨)
- ✅ 항상 `getPropertyTypeLabel(property.type)` 사용

---

## 7. FMV & 안전마진 관점에서의 타입 중요도
아파트/오피스텔

FMV 및 ExitPrice의 예측 가능성이 높음

초보자 튜토리얼, Easy 모드의 기본 학습 타겟

빌라/다가구/단독

FMV는 감정가 대비 낮게 책정되는 경우가 많음

초기 안전마진이 마이너스라도, Exit 기준 플러스가 될 수 있는 대표 케이스

토지(res_land/com_land)

단기 FMV보다 미래 Exit 시나리오의 비중이 큼

Profit/Exit 레이어 설계 시 주의 필요

END OF DOCUMENT

yaml
코드 복사

---

## 3️⃣ `/docs/engine/fixtures-spec.md` (FMV/마진 구조 반영)

```md
# 📦 Fixtures Specification for v2.2
BIDIX AI – 엔진/시뮬레이션 샘플 데이터 규격  
**Version:** 2.2  
**Last Updated:** 2025-11-13  
**Purpose:** ✅ 개발 테스트 / ✅ UI Mock / ✅ 회귀 검증

---

## 1. 목적

| 목적           | 설명                              | 사용 위치                 |
|:--------------|:----------------------------------|:--------------------------|
| 엔진 테스트   | 계산 정확도 회귀 체크             | Vitest + engines         |
| UI 데모       | 프론트엔드 개발 시 목업 데이터    | `/app/(demo)/`           |
| API 검증      | 서버 액션의 입/출력 계약 검증     | `test-run.ts`            |
| 학습 시나리오 | 난이도별 예제 제공               | 튜토리얼 / 온보딩        |

---

## 2. 저장 경로

```text
/fixtures/
 └── simulations/
     ├── easy-apartment.json
     ├── normal-officetel.json
     └── hard-land.json
✅ 파일명 규칙: {difficulty}-{type}.json

3. JSON 구조 (최종 산출물)
ts
코드 복사
interface FixtureSimulation {
  meta: {
    id: string;
    version: "2.2";
    difficulty: DifficultyMode;
    createdAt: string;
    description: string;  // 이 시나리오의 학습 목표 설명
  };
  seed: PropertySeed;            // 엔진 입력값 (Generator → Engine)
  userBid: number;               // 사용자가 입력한 입찰가
  result: AuctionAnalysisResult; // AuctionEngine 최종 출력값
}
⚠️ seed와 result는 항상 lib/types/*.ts의 타입 정의와 100% 일치해야 합니다.

4. 난이도 기준
난이도	특징	권리	수익률	목적
easy	아파트/오피스텔 위주	인수 권리 없음	ROI 7% 이상	UI/체험/튜토리얼
normal	빌라/다가구 위주	단순 대항력	ROI -10~+10%	현실적인 학습
hard	토지/복합건물, 복잡한 권리	유치권 등 가능	ROI 음수도 가능	리스크 관리/전략 학습

5. 주요 필드 정의
5.1 meta
json
코드 복사
"meta": {
  "id": "sim_easy_apt_001",
  "version": "2.2",
  "difficulty": "easy",
  "createdAt": "2025-11-13T10:00:00.000Z",
  "description": "권리관계가 깨끗한 아파트의 기본적인 수익 구조를 학습합니다."
}
5.2 seed: PropertySeed
types/property.ts의 PropertySeed와 완벽하게 일치.

Generator가 만든 원시 매물 입력값.

5.3 userBid: number
이 result를 만들어낸 실제 사용자의 입찰가

예: 560000000

5.4 result: AuctionAnalysisResult
types/result.ts와 완벽하게 일치해야 합니다.

valuation / rights / costs / profit / summary를 모두 포함.

예시 구조(핵심 필드만):

json
코드 복사
{
  "property": { "... Property 타입 객체 ..." },
  "valuation": {
    "appraisalValue": 720000000,
    "baseFMV": 650000000,
    "adjustedFMV": 640000000,
    "minBid": 576000000,
    "recommendedBidRange": { "min": 595000000, "max": 625000000 },
    "confidence": 0.83
  },
  "rights": {
    "assumableRightsTotal": 0,
    "evictionCostEstimated": 1200000,
    "evictionRisk": 1.2,
    "breakdown": []
  },
  "costs": {
    "totalAcquisition": 580000000,
    "holdingCost": 8400000,
    "interestCost": 7200000,
    "totalCost": 595600000,
    "ownCash": 210000000,
    "loanPrincipal": 370000000
  },
  "profit": {
    "netProfit": 44400000,
    "roi": 0.21,
    "annualizedRoi": 0.35,
    "initialSafetyMargin": 0.07,
    "projectedProfitMargin": 0.11,
    "breakevenExit": 595600000,
    "meetsTargetMargin": true,
    "meetsTargetROI": true
  },
  "summary": {
    "isProfitable": true,
    "grade": "A",
    "riskLabel": "Low",
    "recommendedBidRange": { "min": 595000000, "max": 625000000 },
    "generatedAt": "2025-11-13T10:00:00.000Z"
  }
}
6. 검증 규칙
✅ AuctionEngine.run({ seed, userBid, policy }) 결과가 fixture result와 논리적으로 일치해야 함 (deep compare 기준).

✅ profit.netProfit ≈ exitPrice - costs.totalCost
(exitPrice는 Profit 레이어 내부 값)

✅ profit.initialSafetyMargin = (valuation.adjustedFMV - costs.totalCost) / valuation.adjustedFMV

✅ profit.projectedProfitMargin = (exitPrice - costs.totalCost) / exitPrice

✅ profit.roi < 0 이면 summary.grade는 "D" 이어야 함.

✅ valuation.recommendedBidRange.min ≥ valuation.minBid

7. 작성 가이드
항목	규칙
숫자	정수 또는 소수 2자리 이하
ID	snake_case, 버전별 재사용 가능
주소	시/구 포함, 상세는 가명 처리
금액	원 단위, 콤마 없는 정수
난수계	❌ 없음 – fixture는 완전 결정형
날짜/시간	ISO 8601 문자열

8. 확장 계획
버전	내용
v2.3	Commercial 유형 fixture 3종 추가
v2.4	competitorBids 필드 추가 (경쟁자 입찰 분포)

9. 커밋 규칙
bash
코드 복사
fixtures(simulations): add easy-apartment v2.2.0
fixtures(simulations): update normal-officetel FMV/ROI
fixtures(simulations): remove outdated hard-land v2.0.0
END OF DOCUMENT

yaml
코드 복사
