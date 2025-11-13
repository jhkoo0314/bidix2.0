# 📚 BIDIX AI – Documentation Index

**Version:** v2.0
**Last Updated:** 2025-01-28
**Status:** ✅ Active
**Owner:** 재현 

## 1) Purpose

이 파일은 문서의 SSOT(단일 진실 공급원)다. **문서가 변경/추가되면 반드시 이 인덱스를 갱신**한다. 코드와 문서의 드리프트를 방지한다.

## 2) Folder Structure

```
/docs
 ├─ Domain/                     (도메인 지식)
 │   ├─ glossary.md
 │   ├─ property-types.md
 │   ├─ rights-types.md
 │   ├─ court-docs.md
 │   ├─ default-policy.md
 │   ├─ policy-keys.md
 │   └─ valuation-logic.md
 │
 ├─ engine/                     (비즈니스 로직)
 │   ├─ auction-flow.md
 │   ├─ cost-profit-logic.md
 │   ├─ json-schema.md
 │   ├─ fixtures-spec.md
 │   └─ api-contracts.md
 │
 ├─ ui/                         (UI/UX 명세)
 │   ├─ design-system.md
 │   ├─ component-spec.md
 │   └─ component-architecture.md
 │
 ├─ product/                    (제품 기획)
 │   ├─ prdv2.md
 │   ├─ project-plan.md
 │   ├─ project-structure.md
 │   ├─ point-level-system.md
 │   ├─ user-flow.md
 │   ├─ plan.md
 │   ├─ report-result.md
 │   ├─ TODOv2.0.md
 │   └─ todov3.md
 │
 ├─ system/                     (시스템 설정)
 │   └─ difficulty-modes.md
 │
 ├─ meta/                       (메타 문서)
 │   ├─ index.md     ← THIS FILE
 │   └─ changelog.md
 │
 ├─ DIR.md                      (프로젝트 구조)
 └─ TODO.md                     (작업 목록)

/supabase/migrations/mvp_schema.sql
```

## 3) Document Index Table

|   # | File                   | Path                                  | Purpose                | Status | Updated  |
| --: | ---------------------- | ------------------------------------- | ---------------------- | ------ | -------- |
|   1 | Glossary               | `/docs/Domain/glossary.md`            | 용어 SSOT              | ✅     | 25-11-08 |
|   2 | Property Types         | `/docs/Domain/property-types.md`      | 매물 11종 정의         | ✅     | 25-11-08 |
|   3 | Rights Types           | `/docs/Domain/rights-types.md`        | 권리 18종 정의         | ✅     | 25-11-08 |
|   4 | Court Docs             | `/docs/Domain/court-docs.md`          | 법원문서 3종 표준화    | ✅     | 25-11-08 |
|   5 | Default Policy         | `/docs/Domain/default-policy.md`      | 정책 테이블 SSOT       | ✅     | 25-11-08 |
|   6 | Policy Keys            | `/docs/Domain/policy-keys.md`         | 정책키/경로/UI 매핑    | ✅     | 25-11-08 |
|   7 | Valuation Logic        | `/docs/Domain/valuation-logic.md`     | 감정가→FMV→최저가      | ✅     | 25-11-08 |
|   8 | Auction Flow           | `/docs/engine/auction-flow.md`        | Seed→Result 파이프라인 | ✅     | 25-11-08 |
|   9 | Cost & Profit          | `/docs/engine/cost-profit-logic.md`   | 취득/보유/ROI/MoS      | ✅     | 25-11-08 |
|  10 | JSON Schema            | `/docs/engine/json-schema.md`         | SSOT 결과 스키마       | ✅     | 25-11-08 |
|  11 | Fixtures Spec          | `/docs/engine/fixtures-spec.md`       | 시나리오 프리셋 규격   | ✅     | 25-11-08 |
|  12 | API Contracts          | `/docs/engine/api-contracts.md`       | REST 명세              | ✅     | 25-11-09 |
|  13 | Supabase Schema        | `/supabase/migrations/schema.sql`     | DB 테이블 정의         | ✅     | 25-11-09 |
|  14 | Design System          | `/docs/ui/design-system.md`           | 토큰/톤앤매너/레이아웃 | ✅     | 25-11-09 |
|  15 | Component Spec         | `/docs/ui/component-spec.md`          | shadcn+custom 명세     | ✅     | 25-11-09 |
|  16 | Component Architecture | `/docs/ui/component-architecture.md`  | 컴포넌트 아키텍처      | ✅     | 25-01-27 |
|  17 | PRD v2                 | `/docs/product/prdv2.md`              | PRD v2.0               | ✅     | 25-01-27 |
|  18 | Project Plan           | `/docs/product/project-plan.md`       | 로드맵/우선순위        | ✅     | 25-11-08 |
|  19 | Project Structure      | `/docs/product/project-structure.md`  | 프로젝트 구조          | ✅     | 25-01-27 |
|  20 | Point/Level System     | `/docs/product/point-level-system.md` | 점수/레벨/랭킹         | ✅     | 25-11-09 |
|  21 | User Flow              | `/docs/product/user-flow.md`          | 사용자 플로우차트      | ✅     | 25-01-28 |
|  22 | Plan                   | `/docs/product/plan.md`               | 계획 문서              | ✅     | 25-01-27 |
|  23 | Report Result          | `/docs/product/report-result.md`      | 리포트 결과 명세       | ✅     | 25-01-27 |
|  24 | TODO v2.0              | `/docs/product/TODOv2.0.md`           | 작업 목록 v2.0         | ✅     | 25-01-28 |
|  25 | TODO v3                | `/docs/product/todov3.md`             | 작업 목록 v3.0         | ✅     | 25-01-28 |
|  26 | Difficulty Modes       | `/docs/system/difficulty-modes.md`    | 난이도 모드 설정       | ✅     | 25-01-27 |
|  27 | Changelog              | `/docs/meta/changelog.md`             | 변경 이력              | ✅     | 25-01-27 |
|  28 | DIR                    | `/docs/DIR.md`                        | 프로젝트 디렉토리 구조 | ✅     | 25-01-27 |
|  29 | TODO                   | `/docs/TODO.md`                       | 작업 목록              | ✅     | 25-01-27 |

## 4) Versioning & Maintenance

- 커밋 프리픽스:
  - `docs(domain): update property types v1.1`
  - `docs(engine): add api-contracts`
  - `docs(product): PRD v2.0 → v2.1`
  - `docs(product): add TODOv2.0.md`
  - `docs(system): add difficulty modes`
- 문서 변경 시 **상단 메타**(Version / Last Updated) 갱신
- 기능 변경 → Domain/Engine/UI/Product/System 중 해당 섹션 동시 업데이트
- 배포 태그 시 **index.md 테이블의 Updated** 일괄 점검

## 5) Notes

- **폴더명**: `Domain/` (도메인 지식 폴더)
- **파일명 규칙**:
  - Product: `prdv2.md`, `TODOv2.0.md`, `todov3.md` (버전 포함)
- **루트 문서**: `DIR.md`, `TODO.md`는 `/docs/` 루트에 위치
- **제거된 문서**:
  - `ui/pages-ascii.md` (더 이상 사용하지 않음)
  - `product/flowchart.md` (user-flow.md로 대체됨)
  - `product/data-flow.md` (더 이상 사용하지 않음)

## 6) Future Docs Slots

- `/docs/engine/competitor-logic.md` (v2.2)
- `/docs/ui/report-spec.md` (권리/수익/경매 리포트 v1.2)
- `/docs/product/pricing.md` (유료 정책)

**END OF FILE**
