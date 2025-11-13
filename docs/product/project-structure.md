
```md
# 📁 BIDIX v2.0 – Source Code Structure
**Version:** 2.0
**Last Updated:** 2025-01-28
**Status:** ✅ 최종 확정

## 1. 목적

이 파일은 프로젝트 루트의 `lib/` 및 `app/` 디렉토리 구조와 아키텍처 원칙을 정의하는 SSOT입니다. **코드 구조가 변경되면 반드시 이 문서를 갱신**하여, 설계와 실제 코드의 불일치를 방지합니다.

## 2. Directory Structure

> 이 구조는 프로젝트의 유일한 파일 구조 SSOT입니다.

```
app/
└─ action/                        # Server Actions
   ├─ generatesimulation.ts       # 시뮬레이션 생성 액션
   └─ submitbid.ts                # 입찰 제출 액션

lib/                              # 핵심 도메인 레이어 (UI와 100% 분리)
├─ types/                       # 📌 타입 SSOT (8개 파일)
│  ├─ Property.ts               # 매물 타입 정의
│  ├─ valuation.ts              # 감정가/평가 타입
│  ├─ rights.ts                 # 권리 타입 (18종)
│  ├─ cost.ts                   # 비용 타입
│  ├─ profit.ts                 # 수익 타입
│  ├─ courtdocs.ts              # 법원문서 타입
│  ├─ result.ts                 # 결과 타입
│  └─ index.ts                  # Barrel export
│
├─ policy/                      # 정책 레이어 (계산 로직에 사용되는 숫자/정책)
│  ├─ policy.ts                 # Policy 인터페이스 정의
│  ├─ defaultpolicy.ts          # 기본 정책값
│  ├─ difficultypolicy.ts       # 난이도별 정책
│  ├─ rightspolicy.ts           # 18종 권리 기준 테이블
│  └─ index.ts                  # Barrel export
│
├─ engines/                     # 계산 엔진 레이어 (Pure Function)
│  ├─ propertyengine.ts         # 매물 엔진
│  ├─ valuationengine.ts        # 감정가 엔진
│  ├─ courtdocslayer.ts         # 법원문서 레이어
│  ├─ rightsengine.ts           # 권리 엔진
│  ├─ costengine.ts             # 비용 엔진
│  ├─ profitengine.ts           # 수익 엔진
│  ├─ scoreengine.ts            # 점수 엔진
│  └─ auctionengine.ts           # 경매 엔진 (Seed → Result)
│
├─ generators/                  # 랜덤/모의 데이터 생성 레이어
│  ├─ datasetpresets.ts         # 지역/평형/유형 확률 테이블
│  ├─ generatorhelpers.ts       # 난수/가중치/ID 유틸
│  ├─ propertygenerator.ts      # 매물 생성기
│  ├─ courtdocsmocker.ts        # 법원문서 모킹
│  └─ Simulationgenerator.ts   # 시뮬레이션 생성기
│
├─ fixtures/                    # 실제 JSON 샘플 데이터 (테스트/데모용)
│  ├─ index.ts                  # Fixture 로더
│  ├─ loadScenario.ts           # 시나리오 로더
│  └─ scenarios/                # 시나리오 JSON 파일
│     ├─ apt-easy.json          # 아파트 쉬움 난이도
│     ├─ officetel-normal.json  # 오피스텔 보통 난이도
│     └─ land-hard.json         # 토지 어려움 난이도
│
├─ services/                    # 서비스 레이어 (비즈니스 로직 조합)
│  └─ simulationservice.ts      # 시뮬레이션 서비스
│
├─ supabase/                    # Supabase 클라이언트 (환경별 분리)
│  ├─ clerk-client.ts          # Client Component용
│  ├─ client.ts                 # 공개 데이터용 (anon key)
│  ├─ server.ts                 # Server Component용
│  └─ service-role.ts           # 관리자 권한용
│
├─ tests/                       # 단위 테스트
│  ├─ defaultpolicy.test.ts     # 기본 정책 테스트
│  ├─ rightsengine.test.ts      # 권리 엔진 테스트
│  └─ profitengine.test.ts      # 수익 엔진 테스트
│
├─ utils/                       # 유틸리티 함수 (현재 비어있음)
├─ utils.ts                     # 공통 유틸리티
└─ supabase.ts                  # 레거시 Supabase 클라이언트 (사용 지양)

```
## 3. 아키텍처 원칙 (Architecture Principles)

*   **UI Layer (`app/`):** 사용자 인터페이스. 오직 Server Actions를 통해서만 비즈니스 로직 호출.
*   **Service Layer (`lib/services/`):** 여러 엔진과 외부 서비스(DB)를 조합하여 비즈니스 로직 실행.
*   **Engine Layer (`lib/engines/`):** 순수 계산 함수. 외부 I/O 금지.
*   **Generator Layer (`lib/generators/`):** 랜덤 데이터 생성 및 모킹.
*   **Policy Layer (`lib/policy/`):** 계산에 사용되는 모든 규칙과 상수.
*   **Type Layer (`lib/types/`):** 모든 TypeScript 타입의 SSOT.

---
## 4. 핵심 파일명 규칙 (Naming Conventions) - 최종 확정

> **[중요]** 이 프로젝트의 파일명은 통일된 단일 규칙 대신, 역할에 따라 아래와 같이 복합적인 규칙을 따릅니다.

| 구분 | 규칙 | 예시 |
|:---|:---|:---|
| **일반 소스 코드** | **`alllowercase.ts`** | `auctionengine.ts`, `defaultpolicy.ts`, `courtdocsmocker.ts` |
| **특정 생성기** | **`PascalCase.ts`** | `Simulationgenerator.ts` |
| **특정 타입** | **`PascalCase.ts`** | `Property.ts` |
| **컴포넌트 파일** | **`PascalCase.tsx`** | `PropertyCard.tsx`, `ReportHeader.tsx` |

> **결론:** `src/` 폴더 내의 파일명을 새로 생성할 때는, **`Section 2. Directory Structure`에 있는 기존 파일들의 작명 스타일을 참고**하여 일관성을 유지한다.

```

## 4) Key Files Index

|   # | File                       | Path                                         | Purpose              | Status |
| --: | -------------------------- | -------------------------------------------- | -------------------- | ------ |
|   1 | Property Types             | `/lib/types/Property.ts`                 | 매물 타입 SSOT       | ✅     |
|   2 | Valuation Types            | `/lib/types/valuation.ts`                | 감정가 타입          | ✅     |
|   3 | Rights Types               | `/lib/types/rights.ts`                   | 권리 타입 (18종)     | ✅     |
|   4 | Cost Types                 | `/lib/types/cost.ts`                     | 비용 타입            | ✅     |
|   5 | Profit Types               | `/lib/types/profit.ts`                   | 수익 타입            | ✅     |
|   6 | Court Docs Types           | `/lib/types/courtdocs.ts`               | 법원문서 타입        | ✅     |
|   7 | Result Types               | `/lib/types/result.ts`                   | 결과 타입            | ✅     |
|   8 | Default Policy             | `/lib/policy/defaultpolicy.ts`           | 기본 정책값          | ✅     |
|   9 | Difficulty Policy          | `/lib/policy/difficultypolicy.ts`        | 난이도별 정책        | ✅     |
|  10 | Rights Policy              | `/lib/policy/rightspolicy.ts`            | 권리 정책 테이블     | ✅     |
|  11 | Property Engine            | `/lib/engines/propertyengine.ts`         | 매물 계산 엔진       | ✅     |
|  12 | Valuation Engine           | `/lib/engines/valuationengine.ts`        | 감정가 계산 엔진     | ✅     |
|  13 | Court Docs Layer           | `/lib/engines/courtdocslayer.ts`         | 법원문서 처리 레이어 | ✅     |
|  14 | Rights Engine              | `/lib/engines/rightsengine.ts`           | 권리 계산 엔진       | ✅     |
|  15 | Cost Engine                | `/lib/engines/costengine.ts`             | 비용 계산 엔진       | ✅     |
|  16 | Profit Engine              | `/lib/engines/profitengine.ts`           | 수익 계산 엔진       | ✅     |
|  17 | Score Engine               | `/lib/engines/scoreengine.ts`            | 점수 계산 엔진       | ✅     |
|  18 | Auction Engine             | `/lib/engines/auctionengine.ts`          | 경매 파이프라인 엔진 | ✅     |
|  19 | Property Generator         | `/lib/generators/propertygenerator.ts`   | 매물 생성기          | ✅     |
|  20 | Simulation Generator       | `/lib/generators/Simulationgenerator.ts` | 시뮬레이션 생성기    | ✅     |
|  21 | Court Docs Mocker          | `/lib/generators/courtdocsmocker.ts`     | 법원문서 모킹        | ✅     |
|  22 | Simulation Service         | `/lib/services/simulationservice.ts`     | 시뮬레이션 서비스    | ✅     |
|  23 | Generate Simulation Action | `/app/action/generatesimulation.ts`      | 시뮬레이션 생성 액션 | ✅     |
|  24 | Submit Bid Action          | `/app/action/submitbid.ts`               | 입찰 제출 액션       | ✅     |

## 5) Data Flow

```
User Input (UI)
    ↓
Server Action (app/action/)
    ↓
Service Layer (lib/services/)
    ↓
Engine Layer (lib/engines/)
    ↓
Result → UI
```

## 6) Import Conventions

### 6.1) Type Imports

```typescript
// ✅ DO: types에서 import
import { Property, Valuation, Rights } from "@/lib/types";

// ❌ DON'T: 직접 파일에서 import
import { Property } from "@/lib/types/Property";
```

### 6.2) Policy Imports

```typescript
// ✅ DO: policy에서 import
import { getDefaultPolicy } from "@/lib/policy";

// ❌ DON'T: 직접 파일에서 import
import { getDefaultPolicy } from "@/lib/policy/defaultpolicy";
```

### 6.3) Engine Usage

```typescript
// ✅ DO: Service에서 엔진 호출
import { calculateValuation } from "@/lib/engines/valuationengine";

// ❌ DON'T: UI에서 직접 엔진 호출
// UI는 Server Action을 통해서만 호출
```

## 7) Naming Conventions

- **파일명**: kebab-case (예: `propertyengine.ts`)
- **클래스/타입**: PascalCase (예: `Property`, `ValuationEngine`)
- **함수/변수**: camelCase (예: `calculateValuation`, `defaultPolicy`)
- **상수**: UPPER_SNAKE_CASE (예: `DEFAULT_POLICY`)

## 8) Testing

- **위치**: `lib/tests/`
- **규칙**:
  - 엔진은 순수 함수이므로 단위 테스트 작성 용이
  - 정책 변경 시 테스트 업데이트 필수
- **실행**: `pnpm test` 또는 `vitest`

## 9) Versioning & Maintenance

- 코드 구조 변경 시 **상단 메타**(Version / Last Updated) 갱신
- 새 파일 추가 시 **Key Files Index** 테이블 업데이트
- 아키텍처 변경 시 **Architecture Layers** 섹션 업데이트
- 배포 태그 시 **전체 구조 점검**

## 10) Related Documentation

- **프로젝트 구조**: `/docs/product/project-structure.md`
- **도메인 지식**: `/docs/Domian/`
- **엔진 명세**: `/docs/engine/`
- **타입 정의**: `/docs/domain/` + `/lib/types/`

**END OF FILE**
