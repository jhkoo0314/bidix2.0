/**
 * @file outcome.ts
 * @description 입찰 결과 관련 유틸리티 함수
 *
 * 주요 기능:
 * 1. outcome 값을 UI 표시용으로 포맷팅
 *
 * 핵심 구현 로직:
 * - outcome 타입에 따라 아이콘, 라벨, 색상 반환
 * - 브랜드 톤 반영
 *
 * @see {@link /docs/ui/design-system.md} - 브랜드 Accent Colors
 */

export interface OutcomeDisplay {
  label: string;
  icon: string;
  color: string;
}

/**
 * 입찰 결과를 UI 표시용으로 포맷팅
 * @param outcome - 입찰 결과 ("win" | "lose" | "overpay" | "pending")
 * @returns UI 표시 정보 (라벨, 아이콘, 색상)
 */
export function formatOutcome(
  outcome: string,
): OutcomeDisplay {
  switch (outcome) {
    case "win":
      return { label: "입찰", icon: "✅", color: "green" };
    case "lose":
      return { label: "입찰", icon: "❌", color: "red" };
    case "overpay":
      return { label: "근소 차이", icon: "⚠️", color: "amber" };
    default:
      return { label: "대기", icon: "⏳", color: "gray" };
  }
}

