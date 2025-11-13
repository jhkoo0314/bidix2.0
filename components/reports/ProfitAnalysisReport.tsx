/**
 * @file ProfitAnalysisReport.tsx
 * @description 수익 분석 상세 리포트 컴포넌트 (Premium, 잠금 상태)
 *
 * 주요 기능:
 * 1. Premium 리포트 잠금 UI 표시
 * 2. 리포트 미리보기 (선택적)
 *
 * 핵심 구현 로직:
 * - MVP에서는 잠금 UI만 표시
 * - v2.2+에서 실제 리포트 구현 예정
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/product/report-result.md} - 수익 분석 리포트 상세 명세
 * @see {@link /docs/product/prdv2.md} - Premium 기능 정책
 */

import { Button } from "@/components/ui/button";

export function ProfitAnalysisReport() {
  return (
    <div className="p-8 border rounded-lg text-center">
      <div className="space-y-4">
        <span className="text-6xl">🔒</span>
        <h2 className="text-2xl font-semibold">수익 분석 상세 리포트</h2>
        <p className="text-gray-600 dark:text-gray-400">
          이 리포트는 Premium 기능입니다.
        </p>
        <p className="text-sm text-gray-500 italic">
          "당신은 이미 물건의 '사실'을 파악했습니다. 이제 '분석'을 시작할 준비가
          되셨나요?"
        </p>
        <Button variant="outline" disabled>
          프리미엄 해설판 보기
        </Button>
      </div>
    </div>
  );
}

