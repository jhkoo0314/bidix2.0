/**
 * @file BidAmountInput.tsx
 * @description 입찰가 입력 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 입찰가 숫자 입력 - 천 단위 구분자 처리
 * 2. 현금 입력 시 대출 자동 계산 (입찰가 - 현금)
 * 3. 대출 입력 시 현금 자동 계산 (입찰가 - 대출)
 * 4. 대출 금액 표시 시 입찰가 대비 비율(%) 표시
 * 5. 최저 입찰가 검증 - minBid 기준 검증
 * 6. 제출 핸들러 - onSubmit 콜백 호출
 *
 * 핵심 구현 로직:
 * - Client Component로 구현 ("use client")
 * - useState를 통한 입력 상태 관리
 * - 숫자 입력 검증 (NaN, 0 이하, 최저 입찰가 미만)
 * - 현금/대출 상호 자동 계산
 * - 현금 + 대출 = 입찰가 검증
 * - 브랜드 톤 에러 메시지 적용
 * - 디버깅 로그 추가
 *
 * 브랜드 통합:
 * - 브랜드 톤 에러 메시지: 단호하지만 따뜻하게
 * - 사용자를 평가하지 않는 메시지
 * - 실패를 허용하는 톤
 *
 * @dependencies
 * - react: useState, useEffect (상태 관리)
 * - @/components/ui/input: shadcn 입력 컴포넌트
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - BidAmountInput Props 명세 (v2.2)
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
 * @see {@link /docs/ui/design-system.md} - 에러 메시지 톤 가이드
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BidAmountInputProps {
  initialValue?: number;
  minBid?: number;
  onSubmit: (data: {
    bidAmount: number;
    cashAmount?: number;
    loanAmount?: number;
  }) => void;
  disabled?: boolean;
}

export function BidAmountInput({
  initialValue,
  minBid,
  onSubmit,
  disabled = false,
}: BidAmountInputProps) {
  const [bidAmount, setBidAmount] = useState<string>(
    initialValue?.toString() || ""
  );
  const [cashAmount, setCashAmount] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // 마지막으로 변경된 필드를 추적하여 무한 루프 방지
  const lastChangedField = useRef<"cash" | "loan" | "bid" | null>(null);

  // 현금/대출 자동 계산 (입찰가 기반)
  useEffect(() => {
    const bid = Number(bidAmount.replace(/[^0-9]/g, "")) || 0;
    const cash = Number(cashAmount.replace(/[^0-9]/g, "")) || 0;
    const loan = Number(loanAmount.replace(/[^0-9]/g, "")) || 0;
    
    // 입찰가가 없으면 계산하지 않음
    if (bid <= 0) return;
    
    // 현금이 입력되었고 대출이 비어있을 때: 대출 자동 계산
    if (lastChangedField.current === "cash" && cash > 0 && !loanAmount) {
      if (cash <= bid) {
        const calculatedLoan = bid - cash;
        setLoanAmount(calculatedLoan.toString());
        lastChangedField.current = null; // 계산 완료 후 리셋
      }
      return;
    }
    
    // 대출이 입력되었고 현금이 비어있을 때: 현금 자동 계산
    if (lastChangedField.current === "loan" && loan > 0 && !cashAmount) {
      if (loan <= bid) {
        const calculatedCash = bid - loan;
        setCashAmount(calculatedCash.toString());
        lastChangedField.current = null; // 계산 완료 후 리셋
      }
      return;
    }
  }, [bidAmount, cashAmount, loanAmount]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setBidAmount(numericValue);
    setError("");
    lastChangedField.current = "bid";
  };

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setCashAmount(numericValue);
    setError("");
    lastChangedField.current = "cash";
    // 현금 입력 시 대출 자동 계산을 위해 loanAmount 초기화
    if (numericValue && loanAmount) {
      const bid = Number(bidAmount.replace(/[^0-9]/g, "")) || 0;
      const cash = Number(numericValue) || 0;
      if (bid > 0 && cash <= bid) {
        setLoanAmount(""); // 자동 계산을 위해 초기화
      }
    }
  };

  const handleLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setLoanAmount(numericValue);
    setError("");
    lastChangedField.current = "loan";
    // 대출 입력 시 현금 자동 계산을 위해 cashAmount 초기화
    if (numericValue && cashAmount) {
      const bid = Number(bidAmount.replace(/[^0-9]/g, "")) || 0;
      const loan = Number(numericValue) || 0;
      if (bid > 0 && loan <= bid) {
        setCashAmount(""); // 자동 계산을 위해 초기화
      }
    }
  };

  // 대출 비율 계산 (입찰가 대비 백분율)
  const calculateLoanRatio = () => {
    const bid = Number(bidAmount.replace(/[^0-9]/g, "")) || 0;
    const loan = Number(loanAmount.replace(/[^0-9]/g, "")) || 0;
    if (bid > 0 && loan > 0) {
      return Math.round((loan / bid) * 100);
    }
    return 0;
  };

  // 실시간 합계 계산
  const calculateTotal = () => {
    const cash = cashAmount ? Number(cashAmount.replace(/[^0-9]/g, "")) : 0;
    const loan = loanAmount ? Number(loanAmount.replace(/[^0-9]/g, "")) : 0;
    return cash + loan;
  };

  const handleSubmit = () => {
    console.group("Bid Submission");
    
    const bid = Number(bidAmount.replace(/[^0-9]/g, ""));
    const cash = cashAmount ? Number(cashAmount.replace(/[^0-9]/g, "")) : undefined;
    const loan = loanAmount ? Number(loanAmount.replace(/[^0-9]/g, "")) : undefined;

    console.log("Validation check:", {
      bidAmount: bid,
      cashAmount: cash,
      loanAmount: loan,
      minBid,
      isValid: !isNaN(bid) && bid > 0,
      meetsMinBid: minBid ? bid >= minBid : true,
    });

    // 입찰가 유효성 검증
    if (isNaN(bid) || bid <= 0) {
      const errorMsg = "유효한 입찰가를 입력해주세요. 숫자만 입력 가능합니다.";
      console.warn("Validation failed: Invalid bid amount", { bid });
      setError(errorMsg);
      console.groupEnd();
      return;
    }

    // 최저 입찰가 검증
    if (minBid && bid < minBid) {
      const errorMsg = `최저 입찰가(${minBid.toLocaleString()}원) 미만입니다. 다시 확인해주세요.`;
      console.warn("Validation failed: Below minimum bid", {
        bid,
        minBid,
        difference: minBid - bid,
      });
      setError(errorMsg);
      console.groupEnd();
      return;
    }

    // 현금/대출 검증
    // 둘 다 입력했으면 합이 입찰가와 일치해야 함
    if (cash !== undefined && loan !== undefined) {
      if (cash + loan !== bid) {
        const errorMsg = "현금과 대출의 합이 입찰가와 일치해야 합니다.";
        console.warn("Validation failed: Cash + Loan != Bid", {
          cash,
          loan,
          sum: cash + loan,
          bid,
        });
        setError(errorMsg);
        console.groupEnd();
        return;
      }
    }
    // 하나만 입력해도 자동 계산되므로 허용 (둘 다 비워도 정책 기본값 사용)

    console.log("Bid submission successful:", { bid, cash, loan });
    setError("");
    onSubmit({ bidAmount: bid, cashAmount: cash, loanAmount: loan });
    console.groupEnd();
  };

  const total = calculateTotal();
  const bidNum = Number(bidAmount.replace(/[^0-9]/g, "")) || 0;
  const isTotalMatch = cashAmount && loanAmount && total === bidNum;

  return (
    <div className="space-y-4">
      {/* 입찰가 입력 */}
      <div>
        <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">
          입찰가
        </label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="입찰가를 입력하세요 (숫자만)"
          value={bidAmount ? Number(bidAmount).toLocaleString() : ""}
          onChange={handleBidChange}
          disabled={disabled}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {minBid && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            최저 입찰가: <span className="font-semibold">{minBid.toLocaleString()}원</span>
          </p>
        )}
      </div>

      {/* 자금 구성 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          자금 구성
        </h3>

        {/* 현금 입력 */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            현금
          </label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="현금 금액을 입력하세요"
            value={cashAmount ? Number(cashAmount).toLocaleString() : ""}
            onChange={handleCashChange}
            disabled={disabled}
            className={cashAmount && !loanAmount ? "bg-gray-50 dark:bg-gray-900" : ""}
          />
          {cashAmount && !loanAmount && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              대출이 자동으로 계산됩니다
            </p>
          )}
        </div>

        {/* 대출 입력 */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
            대출
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="대출 금액을 입력하세요"
              value={loanAmount ? Number(loanAmount).toLocaleString() : ""}
              onChange={handleLoanChange}
              disabled={disabled}
              className={loanAmount && !cashAmount ? "bg-gray-50 dark:bg-gray-900" : ""}
            />
            {loanAmount && bidAmount && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                ({calculateLoanRatio()}%)
              </span>
            )}
          </div>
          {loanAmount && !cashAmount && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              현금이 자동으로 계산됩니다
            </p>
          )}
        </div>

        {/* 합계 표시 */}
        {(cashAmount || loanAmount) && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                합계:
              </span>
              <span className={`text-sm font-semibold ${isTotalMatch ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {total.toLocaleString()}원
                {isTotalMatch ? " ✓" : " ✗"}
              </span>
            </div>
            {!isTotalMatch && cashAmount && loanAmount && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                입찰가({bidNum.toLocaleString()}원)와 일치하지 않습니다.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      <Button onClick={handleSubmit} size="lg" className="w-full" disabled={disabled}>
        입찰 제출
      </Button>
    </div>
  );
}

