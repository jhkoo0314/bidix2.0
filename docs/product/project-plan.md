
```md
# 🗺️ Project Plan for BIDIX v2.0
**Version:** 2.0
**Last Updated:** 2025-11-09
**Status:** ✅ **Build Ready**

## 1. 프로젝트 미션 및 MVP 목표

본 문서는 `/docs/product/PRDv2.md`에 정의된 목표를 달성하기 위한 구체적인 실행 계획과 우선순위를 정의합니다.

*   **프로젝트 미션:** 경매 초보를 ‘입찰 가능한 상태’까지 끌어올리는 실전 훈련 도구 제공.
*   **MVP(v2.0) 핵심 목표:** 핵심 가치(안전한 실패를 통한 학습)를 검증하고, 상세 리포트의 기술적 기반을 완성하여 빠른 유료화 전환의 발판을 마련한다.

---

## 2. 개발 전략: '스켈레톤 우선' 하이브리드

우리는 전통적인 폭포수 모델 대신, 빠른 피드백과 안정성을 모두 잡는 하이브리드 전략을 채택한다.

*   **Phase 1: UI Skeleton (뼈대 구축):** 먼저 클릭 가능한 웹사이트의 기본 형태를 빠르게 구축한다.
*   **Phase 2: Core Brain (핵심 로직 완성):** UI와 독립적으로, 데이터 생성부터 계산, 저장까지의 모든 백엔드 로직을 완성하고 검증한다.
*   **Phase 3: Assembly (조립 및 상세 구현):** 완성된 '두뇌'를 '뼈대'에 연결하고, 상세 UI 컴포넌트를 채워 넣어 애플리케이션을 완성한다.

---

## 3. MVP 기능 목록 및 우선순위 (Phase 기준 재구성)

| ID | 기능 (Feature) | Phase | 우선순위 | 참고 문서 |
|:---|:---|:---|:---|:---|
| **P1** | **[UI Skeleton]** |
| F01| 프로젝트 초기 설정 및 환경 구축 | **P1** | **Critical** | - |
| F02| 글로벌 레이아웃 및 페이지 라우팅 골격 생성 | **P1** | **Critical** | `design-system.md` |
| U01| Clerk 기반 기본 인증 연동 | **P1** | **High** | - |
| **P2**| **[Core Brain]** |
| T01| 핵심 타입 최종 확정 (`/lib/types`) | **P2** | **Critical** | `json-schema.md` |
| P01| 정책 시스템 구현 (`/lib/policy`) | **P2** | **Critical** | `default-policy.md` |
| G01| 시나리오 생성기 전체 구현 (`/lib/generators`)| **P2** | **Critical** | `difficulty-modes.md`|
| E01| 계산 엔진 전체 구현 (`/lib/engines`) | **P2** | **Critical** | `*-logic.md` |
| S01| 서비스 및 서버 액션 구현 (`/lib/services`, `/app/actions`)| **P2**| **Critical** | `api-contracts.md` |
| T02| 핵심 로직 통합 테스트 (`test-run.ts`) | **P2** | **Critical** | - |
| **P3**| **[Assembly]** |
| U02| 대시보드 UI 및 데이터 연동 | **P3** | **Critical** | `component-architecture.md` |
| U03| 시뮬레이션 목록/상세/입찰 페이지 UI 연동 | **P3** | **Critical** | `component-architecture.md` |
| U04| 입찰 결과 요약 UI 연동 | **P3** | **Critical** | `component-architecture.md` |
| U05| **(개발자 MVP)** 상세 리포트 컴포넌트 구현 | **P3** | **High** | `report-result.md` |
| U06| 히스토리 페이지 UI 및 데이터 연동 | **P3** | **High** | `component-architecture.md`|

---

## 4. Post-MVP 로드맵 (v2.0 이후)

MVP 출시 후 시장 반응에 따라 다음 기능을 순차적으로 개발한다.

| 버전 | 핵심 기능 | 목표 |
|:---|:---|:---|
| **v2.1** | 상세 리포트 UI 노출 및 유료화 연동 (토스페이먼츠) | 첫 매출 발생 |
| **v2.2** | 챌린지 모드 / 시나리오 모드 | 사용자 유지(Retention) 극대화 |
| **v2.3** | 가상 자본금 / 파산 시스템 도입 | 게임화 고도화 |
| **v3.0+**| 경쟁자 AI 시뮬레이션 / B2B SaaS 버전 | 훈련 현실성 강화 및 시장 확장 |

---
**END OF DOCUMENT**
```

