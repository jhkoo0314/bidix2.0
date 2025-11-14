

# 🎨 **BIDIX Design System v2.2 – Brand Integrated Edition (SSOT)**

**Version:** 2.2 (Brand-Integrated)
**Status:** 🔵 Stable
**Last Updated:** 2025-11-13
**Applies To:** BIDIX Web (Next.js 15), Auction Engine v2.2, ScoreEngine v2.0, Policy v2.x

---

# 1. 브랜드 기반 디자인 시스템의 목적

이 문서는 BIDIX의 **브랜드 아이덴티티(정체성) + UI/UX 설계 + 엔진 매핑 규칙**을 완전 통합한 **단일 진실 공급원(SSOT)** 이다.

브랜드 문서에서 제시된 BIDIX의 핵심 가치:

### **“당신의 경험을, 데이터로 증명하다.”**

이 가치를 실제 제품 화면(UI)에서 경험적으로 느껴지도록 다음 4가지 축으로 통합했다.

1. **Infinite eXperience (경험)** → 사용자가 반복 경험할 영역 구조
2. **Insight (통찰)** → 복기 리포트/지표 그래픽
3. **Index (지표)** → 점수·레벨·정확도 기반 UI
4. **Fail Safe (브랜드 톤)** → 실패를 허용하는 따뜻한 UX 메시지

브랜드가 말하는 BIDIX =
UI가 보여주는 BIDIX
이 되도록 설계한다.

---

# 2. 브랜드 보이스 기반 UI 원칙 (Brand Voice → UI Expression)

브랜드 문서의 톤을 그대로 UI에 반영한다.

## 🔵 “전문적이지만 따뜻한 멘토” 톤을 UI에 표현하는 방식

| 브랜드 가이드              | UI 표현 방식                      |
| -------------------- | ----------------------------- |
| “실패는 자산입니다.”         | ResultPage 실패 화면 상단의 브랜드 메시지  |
| “당신의 성장은 숫자로 증명됩니다.” | MetricsStrip와 Score 표시에 강조 문구 |
| “당신은 이미 충분히 공부했습니다.” | 랜딩 페이지 첫 문구                   |
| “생각하는 과정을 훈련한다.”     | 권리/수익/경매 분석의 단계별 구조           |

## 🔵 UI 텍스트 톤 매트릭스 적용 (자동화 규칙)

* **Data-focused**(차트/표/지표) → 건조한 문체
* **User feedback**(결과/실패/성공) → 브랜드 톤의 따뜻한 응원
* **Premium 안내** → 브랜드 기반 “통찰을 얻을 준비가 되었나요?” 톤

---

# 3. 브랜드 기반 비주얼 시스템 (Color / Typography / Composition)

## 🎨 3.1 Color Tokens (Brand Integrated)

브랜드 Primary/Accent를 정식 시스템 토큰으로 통합:

```css
:root {
  /* Backgrounds */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;

  /* Brand Primary */
  --primary: 222 47% 11%;
  --primary-foreground: 0 0% 98%;

  /* Brand Accent Colors */
  --accent-green: 142 70% 45%; /* 성장 Growth */
  --accent-amber: 38 92% 55%; /* 경고 / 학습 시그널 */
  --accent-blue: 222 85% 55%; /* Financial clarity 핵심 */

  /* Functional Colors */
  --success: 142 76% 36%;
  --warning: 48 96% 53%;
  --danger: 0 84% 60%;
  --info: 212 100% 50%;

  /* Border / Card */
  --border: 214 32% 91%;
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
}
```

### Accent Colors 사용 규칙

* Green → 점수 상승, MoS+, 긍정적 시나리오
* Amber → 리스크, 경고, Hard 모드
* Blue → Premium CTA, 정보 강조

---

## ✒ 3.2 Typography (Brand → UI)

브랜드 톤에 맞춰 다음 기준 통일:

* **Heading (H1–H4):** Inter / Poppins — 기하학적, 안정감
* **Body:** Pretendard / Noto Sans KR — 높은 가독성
* **Numeric Highlight:** tabular-nums 지원 글꼴 필수

사용 규칙:

* 점수/금액/ROI는 **Numeric Highlight 스타일** (두껍고 선명하게)
* 브랜드 문구는 **넓은 letter-spacing + 얇은 weight**

예:

```
실패는 비용이 아니라, 자산입니다.
```

---

## 🧱 3.3 Layout Rules

브랜드가 추구하는 “SaaS + 경험 기반 교육 시스템”을 반영:

* **좌측 메인 정보 → 우측 인사이트 구조**
* **간격은 넓게, 경계는 옅게 (눈이 시리지 않게)**
* **요약 → 상세 → 인사이트** 순서

---

# 4. 전체 페이지 구조 (Brand + UX 통합)

아래는 브랜드 톤을 반영한 UI 구조의 완전한 목록이다.

---

## 🟦 4.1 LandingPage — 브랜드 톤이 가장 직접 반영되는 영역

```
┌─────────────────────────────────────────────┐
│ BIDIX                                        │
│ 당신의 경험을, 데이터로 증명하다.              │
│                                              │
│ Fail Safe, Bid Better.                       │
│                                              │
│ [시작하기]                                    │
└─────────────────────────────────────────────┘
```

### **추가 브랜드 규칙**

* Hard 모드를 소개하는 문구:
  *“실패는 비용이 아닙니다. 여기서는 데이터가 됩니다.”*

---

## 🟦 4.2 Dashboard — Index(지표) 중심 구조

브랜드 Value Chain 반영:

```
[Experience Module] - 이번 주 시뮬레이션 횟수
[Insight Module]    - 무료 리포트 조회 수
[Index Module]      - 점수/레벨/히스토리
```

이 3개 모듈은 브랜드 가치 IX 그대로 UI로 표현한다.

---

## 🟦 4.3 SimulationDetail

브랜드 문구 삽입:

> “사실을 먼저 이해한 다음, 분석이 시작됩니다.”

---

## 🟦 4.4 ResultPage — 브랜드 핵심이 가장 드러나는 페이지

브랜드 메시지 layer 추가:

```
┌─────────────────────────────────────────┐
│ [브랜드 메시지]                         │
│ 실패는 비용이 아니라, 자산입니다.         │
│-----------------------------------------│
│ BidOutcomeBlock                          │
│ MetricsStrip                              │
│ ExitScenarioTable                         │
│-------------------------------------------│
│ PremiumReportCTA                          │
│-------------------------------------------│
│ ResultActions                              │
└─────────────────────────────────────────┘
```

### Premium CTA 문구도 수정 (브랜드 톤):

> **“사실을 이해하셨습니다.
> 이제 분석을 시작할 준비가 되셨나요?”**

---

# 5. 컴포넌트 시스템 v2.2 (Brand Integrated)

## 주요 변경 사항 (Brand 적용)

* **모든 Summary 컴포넌트에 감성·멘토 톤의 한 줄 메시지 추가**
* **Score / ROI / MoS는 Numeric Accent 스타일 적용**
* **Premium Report CTA는 브랜드 Accent Color(blue/amber)**
* **Failure 메시지는 따뜻함 + 데이터 기반 톤**

---

# 6. Data Mapping (엔진 → 브랜드 경험)

브랜드의 “데이터로 증명”을 위해 다음 UI 원칙을 강화한다:

| 엔진 원천 데이터                    | UI 메시지/표현                    |
| ---------------------------- | ---------------------------- |
| `profit.initialSafetyMargin` | “당신의 안전마진은 X%였습니다.”          |
| `rights.evictionRisk`        | “이 리스크는 Hard 모드에서 자주 등장합니다.” |
| `valuation.adjustedFMV`      | “현재 시장가 기준 판단 정확도는 XX%입니다.”  |
| Score                        | “당신의 경험은 숫자로 증명됩니다.”         |

→ 계산 결과가 **브랜드 메시지를 직결**해서 나타냄

---

# 7. 인터랙션 규칙 (Brand Behavior)

## 브랜드 기반 인터랙션

### Hover

* 소극적 강조, 낮은 채도
* 브랜드 메시지 포함 미세툴팁 제공:
  *“이 값은 시세 대비 정확도를 의미합니다.”*

### Error/Empty State

브랜드 톤:

* 단호하지만 따뜻하게
* 사용자를 평가하지 않음

예:

> “이 결과는 당신의 학습을 위한 데이터입니다.”

---

# 8. Free / Premium UI 정책 (Brand Tone 적용)

### Premium 버튼 텍스트 변경

기존: “🔒 프리미엄 리포트 보기”
브랜드 기반:

> **🔒 더 깊은 분석을 원하신가요?**
> “당신은 이미 사실을 이해했습니다.
> 이제 분석을 시작할 준비가 되셨습니다.”

---

# 9. 브랜드 기반 컴포넌트 패치 (전체 목록)

컴포넌트들이 브랜드 기반으로 패치된 사항:

| 컴포넌트              | 브랜드 패치                          |
| ----------------- | ------------------------------- |
| LandingMessage    | 브랜드 모토 직접 출력                    |
| ResultHeader      | “실패는 자산입니다” 메시지                 |
| MetricsStrip      | 브랜드 Numeric Highlight 적용        |
| ExitScenarioTable | Amber/Green 기준 색상               |
| PremiumReportCTA  | 브랜드 tone + blue accent          |
| DashboardStats    | Experience/Insight/Index 기반 3모듈 |

---

# 10. 최종 요약 — Brand × Design Full Synchronization

### 브랜드 가치

```
Infinite Experience → Insight → Index
```

### UI 구조

```
경험(Dashboard) → 통찰(Result/Reports) → 지표(Score/History)
```

### 브랜드 메시지

```
실패는 비용이 아니라 자산입니다.
당신의 성장은 숫자로 증명됩니다.
사실을 이해하고, 분석을 시작하십시오.
```

### 제품 비주얼

```
Primary Dark Blue
Accent Green / Amber / Blue
Data-first SaaS Look
```

→ **브랜드가 말하는 BIDIX와
UI가 표현하는 BIDIX가 완벽히 일치하는 버전입니다.**

---


