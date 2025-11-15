/**
 * @file RightsAnalysisReport.tsx
 * @description 권리 분석 상세 리포트 컴포넌트 (Premium)
 *
 * 주요 기능:
 * 1. 권리 분석 상세 리포트 표시 - report-result.md Section 1 기반 구조
 * 2. 등기 권리 타임라인, 점유자·임차인 분석, 명도비용 상세 제공
 * 3. CourtDocsNormalized 및 Rights 타입 구조 100% 준수
 *
 * 핵심 구현 로직:
 * - Part 1: Executive Summary (리스크 등급, 주요 리스크, 예상 인수금액, 핵심 판단 기준)
 * - Part 2: 등기 권리 타임라인 (registeredRights 테이블, 말소기준권리 하이라이트)
 * - Part 3: 점유자·임차인 분석 (occupants 카드, 대항력/우선변제권 판단)
 * - Part 4: 명도비용 상세 (evictionCostEstimated, 총 인수금액)
 * - SectionCard 및 DataRow 사용하여 레이아웃 구성
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심)
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 *
 * @dependencies
 * - @/lib/types: Rights, CourtDocsNormalized 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 컴포넌트
 * - @/components/ui/table: shadcn 테이블 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - RightsAnalysisReport Props 명세 (v2.2)
 * @see {@link /docs/product/report-result.md} - 권리 분석 리포트 상세 명세 (Section 1)
 * @see {@link /docs/product/prdv2.md} - Premium 기능 정책 및 브랜드 메시지
 * @see {@link /docs/ui/design-system.md} - Color Tokens 및 Layout Rules
 */

import { Rights, CourtDocsNormalized } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    baseRightDate: courtDocs.baseRightDate,
  });
  console.groupEnd();

  // 리스크 등급 매핑 (evictionRisk: 0-5 범위)
  const getRiskGrade = (risk: number): "Low" | "Medium" | "High" => {
    if (risk <= 1.5) return "Low";
    if (risk <= 3.5) return "Medium";
    return "High";
  };

  const riskGrade = getRiskGrade(rights.evictionRisk);

  // 예상 인수금액 계산
  const totalAssumableAmount =
    rights.assumableRightsTotal + rights.evictionCostEstimated;

  // 핵심 판단 기준 분석
  const hasCountervailingPower = courtDocs.occupants.some(
    (occ) => occ.hasCountervailingPower,
  );
  const hasFixedDate = courtDocs.occupants.some((occ) => occ.fixedDate);
  const hasDividendRequest = courtDocs.occupants.some(
    (occ) => occ.dividendRequested,
  );

  return (
    <SectionCard title={`권리 분석 상세 리포트 - ${courtDocs.caseNumber}`}>
      <div className="space-y-6">
        {/* Part 1: Executive Summary */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 1] Executive Summary
          </h3>

          <div className="space-y-3">
            <DataRow
              label="리스크 등급"
              value={riskGrade}
              type="text"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                주요 리스크:
              </p>
              <div className="flex flex-wrap gap-2">
                {rights.riskFlags.length > 0 ? (
                  rights.riskFlags.map((flag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                    >
                      {flag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    주요 리스크 없음
                  </span>
                )}
              </div>
            </div>
            <DataRow
              label="예상 인수금액"
              value={totalAssumableAmount}
              type="currency"
            />
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              핵심 판단 기준:
            </p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                1. 전입신고일이 말소기준권리보다 빠름 →{" "}
                {hasCountervailingPower ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    대항력 발생
                  </span>
                ) : (
                  "대항력 없음"
                )}
              </li>
              <li>
                2. 확정일자 {hasFixedDate ? "있음" : "없음"} →{" "}
                {hasFixedDate ? (
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    우선변제권 있음
                  </span>
                ) : (
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    우선변제권 없음
                  </span>
                )}
              </li>
              <li>
                3. 배당요구 {hasDividendRequest ? "있음" : "없음"} →{" "}
                {hasDividendRequest
                  ? "보증금 일부 인수"
                  : "보증금 전액 인수"}
              </li>
            </ul>
          </div>
        </div>

        {/* Part 2: 등기 권리 타임라인 */}
        {courtDocs.registeredRights && courtDocs.registeredRights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              [Part 2] 등기 권리 타임라인
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>등기일자</TableHead>
                    <TableHead>권리명</TableHead>
                    <TableHead>채권자</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>분석</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courtDocs.registeredRights.map((right, index) => (
                    <TableRow
                      key={index}
                      className={
                        right.isBaseRight
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{right.date}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{right.type}</p>
                          {right.isBaseRight && (
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              말소기준권리
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{right.creditor}</TableCell>
                      <TableCell className="text-right numeric-highlight">
                        {right.amount.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        {right.isBaseRight ? (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            말소기준권리
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            후순위 → 소멸
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {courtDocs.baseRightDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <strong>BIDIX Note:</strong> 말소기준권리는 RightsEngine이{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                  registry.baseRight
                </code>{" "}
                으로 산출한 값과 동일합니다. 말소기준일: {courtDocs.baseRightDate}
              </p>
            )}
          </div>
        )}

        {/* Part 3: 점유자·임차인 분석 */}
        {courtDocs.occupants && courtDocs.occupants.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              [Part 3] 점유자·임차인 분석
            </h3>
            <div className="space-y-3">
              {courtDocs.occupants.map((occupant, index) => {
                const hasPriority = !!occupant.fixedDate;
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {occupant.name}
                      </p>
                      {occupant.hasCountervailingPower && (
                        <span className="text-xs px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium">
                          대항력 있음
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <DataRow
                        label="전입일"
                        value={occupant.moveInDate}
                        type="text"
                      />
                      <DataRow
                        label="확정일자"
                        value={occupant.fixedDate || "없음"}
                        type="text"
                      />
                      <DataRow
                        label="배당요구"
                        value={occupant.dividendRequested ? "있음" : "없음"}
                        type="text"
                      />
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          분석 결과:
                        </p>
                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <li>
                            대항력:{" "}
                            {occupant.hasCountervailingPower ? (
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                있음
                              </span>
                            ) : (
                              "없음"
                            )}
                          </li>
                          <li>
                            우선변제권:{" "}
                            {hasPriority ? (
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                있음 (확정일자 기준)
                              </span>
                            ) : (
                              "없음"
                            )}
                          </li>
                        </ul>
                      </div>
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
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                결론:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {hasDividendRequest
                  ? "배당요구가 있어 보증금 일부 인수 대상"
                  : "배당요구가 없어 보증금 전액 인수 대상"}
              </p>
            </div>
          </div>
        )}

        {/* Part 4: 명도비용 상세 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 4] 명도비용 상세
          </h3>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              RightsEngine v2.2 산출 공식:
            </p>
            <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-3">
              evictionCostEstimated = baseCost(2~3백만원) + negotiation buffer +
              special flags (tenant type)
            </code>
            <div className="space-y-2">
              <DataRow
                label="추정 명도비용"
                value={rights.evictionCostEstimated}
                type="currency"
              />
              <DataRow
                label="총 인수금액"
                value={totalAssumableAmount}
                type="currency"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                계산식: {rights.assumableRightsTotal.toLocaleString()}원 +{" "}
                {rights.evictionCostEstimated.toLocaleString()}원 ={" "}
                <span className="font-semibold numeric-highlight">
                  {totalAssumableAmount.toLocaleString()}원
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 브랜드 메시지 */}
        <div className="pt-4 border-t">
          <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20 dark:bg-[hsl(var(--accent-blue))]/20 dark:border-[hsl(var(--accent-blue))]/30">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              &quot;사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?&quot;
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
