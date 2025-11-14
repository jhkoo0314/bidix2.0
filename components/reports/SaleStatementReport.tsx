/**
 * @file SaleStatementReport.tsx
 * @description 매각물건명세서 해설판 리포트 컴포넌트 (Freemium: 일 1회 무료)
 *
 * 주요 기능:
 * 1. 매각물건명세서 상세 해설 표시 - report-result.md Section 4 기반 구조
 * 2. Freemium 전략 반영 - isFreeAvailable prop으로 잠금/해제 제어
 * 3. CourtDocsNormalized 타입 구조 100% 준수
 *
 * 핵심 구현 로직:
 * - isFreeAvailable이 false이면 잠금 UI 표시
 * - isFreeAvailable이 true이면 실제 리포트 내용 표시
 * - 사건번호, 등기 권리 타임라인, 점유자/임차인 분석, 비고 표시
 * - CourtDocsNormalized의 모든 필드 활용 (registeredRights, occupants, baseRightDate 등)
 * - SectionCard 및 DataRow 사용하여 레이아웃 구성
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "당신은 이미 물건의 '사실'을 파악했습니다. 이제 '분석'을 시작할 준비가 되셨나요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심) - 잠금 UI에만 적용
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 *
 * @dependencies
 * - @/lib/types: CourtDocsNormalized 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - SaleStatementReport Props 명세 (v2.2)
 * @see {@link /docs/product/report-result.md} - 매각물건명세서 리포트 상세 명세 (Section 4)
 * @see {@link /docs/product/prdv2.md} - Freemium 전략 (일 1회 무료)
 * @see {@link /docs/ui/design-system.md} - Color Tokens 및 Layout Rules
 */

import { CourtDocsNormalized } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";

export interface SaleStatementReportProps {
  courtDocs: CourtDocsNormalized;
  isFreeAvailable?: boolean; // Freemium 전략: 일 1회 무료
}

export function SaleStatementReport({
  courtDocs,
  isFreeAvailable = true,
}: SaleStatementReportProps) {
  console.group("SaleStatementReport Component");
  console.log("Court docs:", {
    caseNumber: courtDocs.caseNumber,
    registeredRightsCount: courtDocs.registeredRights.length,
    occupantsCount: courtDocs.occupants.length,
    baseRightDate: courtDocs.baseRightDate,
    propertyDetails: courtDocs.propertyDetails,
    remarks: courtDocs.remarks,
  });
  console.log("Is free available:", isFreeAvailable);
  console.groupEnd();

  // Freemium 전략: 무료 사용 불가 시 잠금 UI 표시
  if (!isFreeAvailable) {
    return (
      <div className="p-6 border rounded-lg border-dashed border-[hsl(var(--accent-blue))]/30 bg-[hsl(var(--accent-blue))]/5 dark:bg-[hsl(var(--accent-blue))]/10">
        <div className="space-y-4 text-center">
          <span className="text-4xl">🔒</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            매각물건명세서 해설판
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            오늘의 무료 리포트를 모두 사용하셨습니다.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            &quot;당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 &apos;분석&apos;을 시작할 준비가
            되셨나요?&quot;
          </p>
        </div>
      </div>
    );
  }

  // 실제 리포트 내용 표시
  return (
    <SectionCard title="매각물건명세서 해설판">
      <div className="space-y-6">
        {/* 사건번호 */}
        <div className="pb-4 border-b">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            사건번호
          </h3>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {courtDocs.caseNumber}
          </p>
        </div>

        {/* 부동산 표시 (propertyDetails) */}
        {courtDocs.propertyDetails && (
          <div className="pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              부동산 표시
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {courtDocs.propertyDetails}
            </p>
          </div>
        )}

        {/* 등기 권리 타임라인 */}
        {courtDocs.registeredRights && courtDocs.registeredRights.length > 0 && (
          <div className="pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              등기 권리 타임라인
            </h3>
            <div className="space-y-3">
              {courtDocs.registeredRights.map((right, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${
                    right.isBaseRight
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {right.type}
                      </p>
                      {right.isBaseRight && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          말소기준권리
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold numeric-highlight">
                      {right.amount.toLocaleString()}원
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      등기일자: {right.date}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      채권자: {right.creditor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {courtDocs.baseRightDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                말소기준일: {courtDocs.baseRightDate}
              </p>
            )}
          </div>
        )}

        {/* 점유자·임차인 분석 */}
        {courtDocs.occupants && courtDocs.occupants.length > 0 && (
          <div className="pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              점유자·임차인 분석
            </h3>
            <div className="space-y-3">
              {courtDocs.occupants.map((occupant, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {occupant.name}
                    </p>
                    {occupant.hasCountervailingPower && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        대항력 있음
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <DataRow
                      label="전입일"
                      value={occupant.moveInDate}
                      type="text"
                    />
                    {occupant.fixedDate && (
                      <DataRow
                        label="확정일자"
                        value={occupant.fixedDate}
                        type="text"
                      />
                    )}
                    <DataRow
                      label="보증금"
                      value={occupant.deposit}
                      type="currency"
                    />
                    {occupant.rent > 0 && (
                      <DataRow
                        label="월 임대료"
                        value={occupant.rent}
                        type="currency"
                      />
                    )}
                    {occupant.dividendRequested && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        배당요구: 있음
                      </p>
                    )}
                    {occupant.evictionRiskLevel && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        명도 위험도: {occupant.evictionRiskLevel}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 비고 */}
        {courtDocs.remarks && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              비고
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {courtDocs.remarks}
            </p>
          </div>
        )}

        {/* 브랜드 메시지 (Freemium 안내) */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            이 리포트는 일 1회 무료로 제공됩니다. 더 깊은 분석이 필요하시다면
            프리미엄 리포트를 확인해보세요.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

