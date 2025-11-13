# 📦 BIDIX v2.2 – Fixtures Specification
**Version:** 2.2  
**Last Updated:** 2025-11-13  
**Status:** ✅ 업데이트 완료  

---

# 1. 목적

Fixture는 다음 용도로 쓰이는 “결정형 시뮬레이션 데이터”이다.

- 엔진 회귀 테스트  
- UI Demo  
- 시나리오 학습  
- 온보딩 튜토리얼  

v2.2에서는 Profit/ExitPrice가 **3·6·12개월 Multi Scenario**로 확장되었으므로  
Fixture 스키마도 이에 맞춰 강화되었다.

---

# 2. 파일 구조

/fixtures/
└─ scenarios/
easy-apt.json
normal-villa.json
hard-land.json

makefile
코드 복사

규칙:
{difficulty}-{type}.json

yaml
코드 복사

---

# 3. FixtureSimulation Schema (v2.2)

```ts
interface FixtureSimulation {
  meta: {
    id: string;
    version: "2.2";
    difficulty: DifficultyMode;
    createdAt: string;
    description: string;
  };

  seed: PropertySeed;
  userBid: number;
  result: AuctionAnalysisResult; // v2.2 구조
}
v2.2 변경점
result.profit.scenarios 필수

exitPrice_3m/6m/12m 포함

ROI 정합성 검사 규칙 강화

4. 난이도 기준 (v2.2)
Mode	매물 예시	권리	ROI 범위	목적
Easy	Apt / Officetel	인수권리 없음	+5~20%	UI 데모
Normal	Villa / Multi	대항력 1	-5~+10%	실전 학습
Hard	Land / Mixed	복합 권리	음수 가능	리스크 학습

5. JSON 검증 규칙 (v2.2)
ROI/수익 정합성
pgsql
코드 복사
profit.scenarios[i].netProfit 
  == valuation.exitPrice_Xm - costs.totalCost_Xm
안전마진
pgsql
코드 복사
profit.initialSafetyMargin 
  = (valuation.adjustedFMV - costs.totalCost_0m) / valuation.adjustedFMV
recommendedBidRange
arduino
코드 복사
min >= minBid
max <= adjustedFMV
determinism
난수 없음 → 재생성 시 값 동일해야 함

