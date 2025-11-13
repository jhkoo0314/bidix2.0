/**
 * @file SaleStatementReport.tsx
 * @description 매각물건명세서 해설판 리포트 컴포넌트 (첫 1회 무료)
 *
 * 주요 기능:
 * 1. 매각물건명세서 상세 해설 표시
 * 2. 첫 1회 무료 제공
 * 3. 사용량 체크
 *
 * 핵심 구현 로직:
 * - CourtDocsNormalized 데이터 사용
 * - prdv2.md의 Freemium 전략 반영 (일 1회 무료)
 * - 사용량 체크 필요
 *
 * @dependencies
 * - @/lib/types: CourtDocsNormalized 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/product/report-result.md} - 매각물건명세서 리포트 상세 명세
 * @see {@link /docs/product/prdv2.md} - Freemium 전략 (일 1회 무료)
 */

import { CourtDocsNormalized } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";

export interface SaleStatementReportProps {
  courtDocs: CourtDocsNormalized;
  isFreeAvailable?: boolean;
}

export function SaleStatementReport({
  courtDocs,
  isFreeAvailable = true,
}: SaleStatementReportProps) {
  if (!isFreeAvailable) {
    return (
      <div className="p-8 border rounded-lg text-center">
        <div className="space-y-4">
          <span className="text-6xl">🔒</span>
          <h2 className="text-2xl font-semibold">매각물건명세서 해설판</h2>
          <p className="text-gray-600 dark:text-gray-400">
            오늘의 무료 리포트를 모두 사용하셨습니다.
          </p>
          <p className="text-sm text-gray-500 italic">
            &quot;당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 &apos;분석&apos;을 시작할 준비가
            되셨나요?&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <SectionCard title="매각물건명세서 해설판">
      <div className="space-y-6">
        {/* 사건번호 */}
        <div>
          <h3 className="font-semibold mb-2">사건번호</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {courtDocs.caseNumber}
          </p>
        </div>

        {/* 등기 권리 */}
        {courtDocs.registeredRights && courtDocs.registeredRights.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">등기 권리</h3>
            <div className="space-y-2">
              {courtDocs.registeredRights.map((right, index) => (
                <div key={index} className="p-3 border rounded">
                  <p className="text-sm font-medium">{right.type}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {right.date} · {right.creditor} ·{" "}
                    {right.amount.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 점유자/임차인 */}
        {courtDocs.occupants && courtDocs.occupants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">점유자/임차인</h3>
            <div className="space-y-2">
              {courtDocs.occupants.map((occupant, index) => (
                <div key={index} className="p-3 border rounded">
                  <p className="text-sm font-medium">{occupant.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    전입일: {occupant.moveInDate} · 보증금:{" "}
                    {occupant.deposit.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 비고 */}
        {courtDocs.remarks && (
          <div>
            <h3 className="font-semibold mb-2">비고</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {courtDocs.remarks}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

