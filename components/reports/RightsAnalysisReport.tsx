/**
 * @file RightsAnalysisReport.tsx
 * @description 권리 분석 상세 리포트 컴포넌트 (Premium, 잠금 상태)
 *
 * 주요 기능:
 * 1. Premium 리포트 잠금 UI 표시 - PremiumReportCTA 스타일 참조
 * 2. 리포트 설명 표시 - report-result.md 기반 상세 설명
 * 3. 브랜드 메시지 및 Accent Color 적용
 *
 * 핵심 구현 로직:
 * - MVP에서는 잠금 UI만 표시
 * - Props는 받지만 실제 리포트 내용은 표시하지 않음
 * - v2.2+에서 실제 리포트 구현 예정
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "당신은 이미 물건의 '사실'을 파악했습니다. 이제 '분석'을 시작할 준비가 되셨나요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심)
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 *
 * @dependencies
 * - @/lib/types: Rights, CourtDocsNormalized 타입
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - RightsAnalysisReport Props 명세 (v2.2)
 * @see {@link /docs/product/report-result.md} - 권리 분석 리포트 상세 명세
 * @see {@link /docs/product/prdv2.md} - Premium 기능 정책 및 브랜드 메시지
 * @see {@link /docs/ui/design-system.md} - Color Tokens (accent-blue)
 * @see {@link /components/result/PremiumReportCTA.tsx} - 잠금 UI 스타일 참조
 */

import { Rights, CourtDocsNormalized } from "@/lib/types";
import { Button } from "@/components/ui/button";

export interface RightsAnalysisReportProps {
  rights: Rights;
  courtDocs: CourtDocsNormalized;
}

export function RightsAnalysisReport({
  rights,
  courtDocs,
}: RightsAnalysisReportProps) {
  console.group("RightsAnalysisReport Component");
  console.log("Rights data:", {
    assumableRightsTotal: rights.assumableRightsTotal,
    evictionCostEstimated: rights.evictionCostEstimated,
    evictionRisk: rights.evictionRisk,
    riskFlags: rights.riskFlags,
  });
  console.log("Court docs:", {
    caseNumber: courtDocs.caseNumber,
    registeredRightsCount: courtDocs.registeredRights.length,
    occupantsCount: courtDocs.occupants.length,
  });
  console.groupEnd();

  return (
    <div className="p-6 border rounded-lg border-dashed border-[hsl(var(--accent-blue))]/30 bg-[hsl(var(--accent-blue))]/5 dark:bg-[hsl(var(--accent-blue))]/10">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            권리 분석 상세 리포트
          </h3>
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            임대 권리 관계, 우선순위 분석, 명도비용 상세
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            등기 권리 타임라인, 점유자·임차인 분석, 명도비용 추정을 포함한 종합 권리 분석 리포트입니다.
          </p>
        </div>

        {/* 리포트 주요 내용 미리보기 (교육용) */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            이 리포트에 포함될 내용:
          </p>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>등기 권리 타임라인 (말소기준권리 분석)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>점유자·임차인 상세 분석 (대항력, 우선변제권)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>명도비용 추정 및 총 인수금액 계산</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>리스크 등급 및 핵심 판단 기준</span>
            </li>
          </ul>
        </div>

        {/* 브랜드 메시지 */}
        <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 dark:bg-[hsl(var(--accent-blue))]/20 dark:border-[hsl(var(--accent-blue))]/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
            &quot;사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?&quot;
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 더 깊은
            &apos;분석&apos;을 통해 통찰을 얻을 준비가 되셨나요?
          </p>
        </div>

        {/* CTA 버튼 */}
        <Button
          variant="outline"
          disabled
          className="w-full border-[hsl(var(--accent-blue))]/30 text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10"
        >
          🔒 프리미엄 해설판 보기
        </Button>
      </div>
    </div>
  );
}

