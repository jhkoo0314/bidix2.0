# 🕹️ Difficulty Modes Specification (v2.0)
**Version:** 2.0
**Last Updated:** 2025-11-09
**Status:** ✅ 설계 확정

## 1. 난이도 시스템 철학

BIDIX의 난이도는 단순히 점수를 더 주거나 덜 주는 시스템이 아니다. 각 모드는 **사용자가 마주하는 '정보의 복잡성'과 '의사결정의 리스크' 수준**을 조절하여, 특정 학습 목표를 달성하도록 설계된다.

*   **Easy:** 경매의 기본 흐름과 핵심 용어를 안전하게 학습하는 **'튜토리얼'** 모드.
*   **Normal:** 현실에서 가장 흔하게 마주칠 수 있는 일반적인 사례들을 통해 실전 감각을 기르는 **'표준 실습'** 모드.
*   **Hard:** 복합적인 권리 관계와 숨겨진 변수들을 해결하며 전문가 수준의 판단력을 훈련하는 **'심화 챌린지'** 모드.

---

## 2. 난이도별 상세 설계 비교표

| 구분 | 🌱 Easy Mode |  Balanced Normal Mode | 🔥 Hard Mode |
| :--- | :--- | :--- | :--- |
| **학습 목표** | **성공 경험, 용어 학습** | **현실적인 수익/비용 구조 이해** | **리스크 관리, 최적 입찰가 훈련** |
| **`Property` 생성** | <li>**아파트, 오피스텔** 등 정형화된 매물 위주</li><li>층, 연식 등 조건이 양호한 편</li> | <li>**모든 주거용/상업용 매물**이 확률적으로 등장</li><li>조건이 좋거나 나쁠 수 있음</li> | <li>**빌라, 토지, 다가구** 등 비정형/고난도 매물 등장 확률 ▲</li><li>'대지권 미등기' 등 하자 발생 가능</li> |
| **`CourtDocs` 시나리오** | <li>**90% `SAFE_PROPERTY`** (깨끗한 권리)</li><li>10% `PROTECTED_TENANT` (단순 대항력 임차인)</li> | <li>**50% `SAFE_PROPERTY`**</li><li>**50% `PROTECTED_TENANT`**</li> | <li>**70% `PROTECTED_TENANT`**</li><li>**30% `COMPLEX_RIGHTS`** (선순위 가처분, 유치권 등 복합 리스크)</li> |
| **`Policy` 재정의** | <li>**수익 목표 하향** (`targetROI: 7%`)</li><li>**금융 조건 완화** (`loanLTV: 80%`)</li><li>**빠른 매각** (`exitDiscountRate` 높임)</li> | <li>**`default-policy.ts`** 기준 사용</li><li>(우리가 조정한 `targetROI: 10%`)</li> | <li>**수익 목표 상향** (`targetROI: 20%`)</li><li>**금융 조건 악화** (`loanLTV: 60%`)</li><li>**느린 매각** (`exitDiscountRate` 낮춤)</li><li>**예상치 못한 비용** (`repairRate` 높임)</li> |
| **`ScoreEngine` 보정** | <li>획득 점수 **x1.0**</li><li>(별도 보너스 없음)</li> | <li>획득 점수 **x1.0**</li><li>(기준 점수)</li> | <li>획득 점수 **x1.2** (하이 리스크, 하이 리턴)</li> |

---

## 3. 구현 계획 (Implementation Plan)

1.  **`difficultypolicies.ts` 파일 생성:** `lib/policy/` 폴더에 난이도별 정책 재정의 값을 담은 파일을 신규 생성한다.
2.  **`simulationgenerator.ts` 로직 수정:** 난이도에 따라 다른 `CourtDocs` 시나리오를 생성하도록 분기 로직을 수정한다.
3.  **서버 액션(`Action`)에서 정책 병합:** UI에서 전달받은 `difficulty` 값에 따라 최종 정책을 조합하고 엔진을 실행한다.

---
END OF DOCUMENT