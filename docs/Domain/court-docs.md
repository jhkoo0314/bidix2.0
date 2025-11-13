# 📋 Court Documents Data Specification (v2.2)
**Version:** 2.2  
**Last Updated:** 2025-11-13  
**Status:** ✅ 최신 버전  
**Owner:** BIDIX Core Team  

---

# 1. 목적 및 역할

본 문서는 BIDIX Engine이 사용하는 **CourtDocsNormalized** 구조의  
SSOT(단일 진실 공급원)이다.

### v2.2 주요 업데이트
- 명도/권리 로직 고도화로 인해 **Occupant.hasCountervailingPower** 필수화  
- **RegisteredRight**의 날짜/순위 규칙 정교화  
- v2.2 ProfitEngine(3/6/12개월)에서 필요한 **baseRightDate 일관성 규칙 강화**  
- CourtDocsLayer에서 “파생 데이터(derived fields)” 추가 가능성 확장

데이터 흐름:
> `courtdocsmocker.ts` 생성 → `court-docs-layer.ts` 정규화 → `RightsEngine` 소비

---

# 2. CourtDocsNormalized (v2.2)

```ts
export interface CourtDocsNormalized {
  caseNumber: string;
  propertyDetails: string;
  registeredRights: RegisteredRight[];
  occupants: Occupant[];
  baseRightDate: string; // YYYY-MM-DD
  remarks?: string;
}
필드	설명	v2.2 변경점
caseNumber	가상의 사건번호	동일
propertyDetails	“부동산 표시” 원문	동일
registeredRights	등기 목록	isBaseRight 고정 1개 규칙 강화
occupants	점유자/임차인 정보	hasCountervailingPower 계산 필수
baseRightDate	말소기준권리 날짜	모든 occupant/권리 날짜 비교 기준
remarks	비고	동일

3. RegisteredRight (v2.2)
ts
코드 복사
export interface RegisteredRight {
  type: RightType;
  date: string;
  creditor: string;
  amount: number;
  isBaseRight?: boolean;
}
v2.2 변경 사항
isBaseRight: true 반드시 하나만 존재

CourtDocsMocker는 baseRight를 먼저 생성하고
이후 날짜를 baseRightDate보다 “뒤”로 생성해 논리적 일관성을 강제

RightsEngine이 FMV 기반 수익엔진과 연결되므로
등록일(date)은 무조건 ISO 형식(YYYY-MM-DD)

4. Occupant (점유자) — v2.2
ts
코드 복사
export interface Occupant {
  name: string;
  moveInDate: string;
  fixedDate?: string;
  dividendRequested: boolean;
  deposit: number;
  rent: number;
  hasCountervailingPower?: boolean;
}
v2.2 핵심 변경
hasCountervailingPower 는 이제 optional이지만
CourtDocsLayer가 반드시 채우는 파생 필드

계산 규칙 (v2.2 SSOT):

ini
코드 복사
hasCountervailingPower = (moveInDate < baseRightDate)
ProfitEngine(3/6/12)에서 rights.assumableRightsTotal에
정확히 반영되므로 필수 데이터

5. CourtDocsLayer (정규화 레이어)
v2.2 변경 요약
모든 Occupant에 대해 hasCountervailingPower 계산

파생 필드를 더 쉽게 추가할 수 있도록 구조 확장

날짜 변환 및 누락값 보정 강화

6. CourtDocsMocker (시나리오 생성기)
v2.2 변경점
시나리오	설명
SAFE_PROPERTY	임차인 없음 or 대항력 없음
PROTECTED_TENANT	대항력 + 확정일자 + 배당요구 조합
COMPLEX_RIGHTS	저당권 + 압류 + 가등기 등 복합 권리

v2.2 요구사항
baseRightDate 생성 후 모든 권리/임차인은 날짜 일관성을 가져야 함

왕복 테스트가 가능하도록 deterministic generator 유지