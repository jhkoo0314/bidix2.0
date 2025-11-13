/**
 * @file PremiumReportCTA.tsx
 * @description 프리미엄 리포트 CTA 컴포넌트
 *
 * 주요 기능:
 * 1. Premium 리포트 잠금 UI 표시
 * 2. 브랜드 메시지 표시
 * 3. 로그인 버튼 (v2.2에서는 비활성)
 *
 * 핵심 구현 로직:
 * - prdv2.md의 Premium CTA 메시지 반영
 * - 잠금 아이콘 및 브랜드 메시지
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - PremiumReportCTA Props 명세
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
  },
  profit: {
    title: "수익 분석 상세 리포트",
    description: "비용 구조, 수익 시나리오, 수익분기점 분석",
  },
  auction: {
    title: "경매 분석 상세 리포트",
    description: "입찰 전략의 점수 상세, 개선 포인트",
  },
};

export function PremiumReportCTA({ type }: PremiumReportCTAProps) {
  const config = reportConfig[type];

  return (
    <div className="p-6 border rounded-lg border-dashed">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🔒</span>
        <h3 className="text-xl font-semibold">{config.title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {config.description}
      </p>
      <p className="text-sm text-gray-500 italic mb-4">
        &quot;당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 &apos;분석&apos;을 시작할 준비가
        되셨나요?&quot;
      </p>
      <Button variant="outline" disabled>
        프리미엄 해설판 보기
      </Button>
    </div>
  );
}

