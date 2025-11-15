# Changelog

All notable changes to BIDIX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-29

### Added

#### 성능 최적화
- Premium 리포트 컴포넌트 동적 로딩 (RightsAnalysisReport, ProfitAnalysisReport, AuctionAnalysisReport, CompetitorAnalysis)
- BidAmountInput 컴포넌트 최적화 (useCallback, useMemo 적용)
- FilterBar 컴포넌트 최적화 (useCallback 적용)
- PropertyCard, QuickStats, MetricsStrip, ExitScenarioTable 컴포넌트 메모이제이션 (React.memo 적용)
- SyncUserProvider 최적화 (memo 적용)
- next.config.ts 이미지 최적화 설정 추가 (AVIF/WebP 지원, device/image sizes, cache TTL)

#### SEO 및 메타데이터
- 정적 페이지 메타데이터 추가 (Landing, Dashboard, Simulations List, History)
- 동적 페이지 메타데이터 추가 (Simulation Detail, Bid, Result) - generateMetadata 함수 사용
- OG 이미지 설정 확인 및 적용
- 시맨틱 HTML 구조 개선 (article 태그 추가)

#### 접근성 (a11y)
- 키보드 내비게이션 개선 (버튼, 링크, 모달 포커스 스타일)
- 아이콘 버튼 ARIA 라벨 추가 (다크모드 토글, 메뉴 열기, 프리미엄 CTA 등)
- 입력 필드 ARIA 속성 추가 (htmlFor 연결, aria-required, aria-invalid, aria-describedby)
- 동적 콘텐츠 ARIA 라이브 영역 추가 (에러, 로딩, 성공 메시지에 role="alert", aria-live)
- 복잡한 UI 컴포넌트 ARIA 속성 추가 (섹션, 테이블, 배지에 role, aria-labelledby, aria-label)
- 색상 대비 개선 (text-gray-400/500를 text-muted-foreground로 변경, 접근성 유틸리티 클래스 추가)
- Skip Link 추가 (메인 콘텐츠로 건너뛰기 링크)

#### 문서화
- README.md를 BIDIX 프로젝트에 맞게 업데이트
- CHANGELOG.md 생성 (Keep a Changelog 형식)

### Changed

- 시맨틱 HTML 구조 개선 (Simulation Detail, Result 페이지에 article 태그 추가)
- BidAmountInput 컴포넌트에 Enter 키로 제출 기능 추가
- CreateSimulationButton 난이도 선택 버튼에 키보드 접근성 및 ARIA 속성 추가
- ExitScenarioTable 테이블 헤더에 scope 속성 추가, 첫 번째 열을 th로 변경

### Fixed

- 접근성 관련 이슈 수정 (아이콘에 aria-hidden 추가, 이모지에 aria-hidden 추가)
- 색상 대비 부족 문제 수정 (주요 텍스트 색상 개선)

## [Unreleased]

### Planned

- 경쟁자 시뮬레이션 기능 (v2.1+)
- 유료 결제 시스템 (v2.2+)
- B2B 교육자용 관리 대시보드 (v3.0+)

---

## 형식 참고

### 버전 형식

- **[MAJOR.MINOR.PATCH]** - 버전 번호
- 날짜 형식: YYYY-MM-DD

### 변경 유형

- **Added**: 새로운 기능 추가
- **Changed**: 기존 기능 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 변경

