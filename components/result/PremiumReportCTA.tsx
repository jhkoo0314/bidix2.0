/**
 * @file PremiumReportCTA.tsx
 * @description 프리미엄 리포트 CTA 컴포넌트
 *
 * 주요 기능:
 * 1. Premium 리포트 잠금 UI 표시 - 🔒 아이콘 및 브랜드 메시지
 * 2. 리포트별 설명 표시 - report-result.md 기반 상세 설명
 * 3. 브랜드 CTA 버튼 - v2.2에서는 비활성 (잠금 상태)
 *
 * 핵심 구현 로직:
 * - prdv2.md의 Premium CTA 메시지 반영
 * - 브랜드 Accent Color 적용 (Blue - Financial clarity)
 * - 브랜드 보이스 가이드 준수 (격려하되 과장하지 않음)
 * - report-result.md 참조하여 리포트별 설명 보강
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
 * - 또는: "🔒 더 깊은 분석을 원하신가요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심)
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - @/components/common/SectionCard: 섹션 카드 (선택적)
 *
 * @see {@link /docs/ui/component-spec.md} - PremiumReportCTA Props 명세 (v2.2)
 * @see {@link /docs/ui/design-system.md} - Color Tokens (accent-blue)
 * @see {@link /docs/product/prdv2.md} - Premium CTA 메시지
 * @see {@link /docs/product/report-result.md} - 리포트 상세 명세
 */

import { Button } from "@/components/ui/button";

export interface PremiumReportCTAProps {
  type: "rights" | "profit" | "auction";
}

const reportConfig = {
  rights: {
    title: "권리 분석 상세 리포트",
    description: "임대 권리 관계, 우선순위 분석, 명도비용 상세",
    detail:
      "등기 권리 타임라인, 점유자·임차인 분석, 명도비용 추정을 포함한 종합 권리 분석 리포트입니다.",
  },
  profit: {
    title: "수익 분석 상세 리포트",
    description: "비용 구조, 수익 시나리오, 수익분기점 분석",
    detail:
      "취득비용, 보유비용, 3/6/12개월 수익 시나리오, 수익분기점 분석을 포함한 종합 수익 분석 리포트입니다.",
  },
  auction: {
    title: "경매 분석 상세 리포트",
    description: "입찰 전략의 점수 상세, 개선 포인트",
    detail:
      "정확성/수익성/안정성 점수 상세 분석, 입찰 전략 개선 포인트, 리스크 평가를 포함한 종합 경매 분석 리포트입니다.",
  },
};

export function PremiumReportCTA({ type }: PremiumReportCTAProps) {
  const config = reportConfig[type];

  console.group("PremiumReportCTA Component");
  console.log("Report type:", type);
  console.log("Config:", config);
  console.groupEnd();

  return (
    <div className="p-6 border rounded-lg border-dashed border-[hsl(var(--accent-blue))]/30 bg-[hsl(var(--accent-blue))]/5 dark:bg-[hsl(var(--accent-blue))]/10">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🔒</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-[var(--font-inter)]">
            {config.title}
          </h3>
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
            {config.description}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
            {config.detail}
          </p>
        </div>

        {/* 브랜드 메시지 */}
        <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 dark:bg-[hsl(var(--accent-blue))]/20 dark:border-[hsl(var(--accent-blue))]/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2 font-[var(--font-noto-sans-kr)] brand-message">
            &quot;사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?&quot;
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
            당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 더 깊은
            &apos;분석&apos;을 통해 통찰을 얻을 준비가 되셨나요?
          </p>
        </div>

        {/* CTA 버튼 */}
        <Button
          variant="outline"
          disabled
          aria-label="프리미엄 해설판 보기 (현재 잠금 상태)"
          className="w-full border-[hsl(var(--accent-blue))]/30 text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10 font-[var(--font-noto-sans-kr)]"
        >
          <span aria-hidden="true">🔒</span> 프리미엄 해설판 보기
        </Button>
      </div>
    </div>
  );
}

