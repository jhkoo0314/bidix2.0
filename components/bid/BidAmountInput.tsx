/**
 * @file BidAmountInput.tsx
 * @description 입찰가 입력 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 입찰가 숫자 입력 - 천 단위 구분자 처리
 * 2. 최저 입찰가 검증 - minBid 기준 검증
 * 3. 제출 핸들러 - onSubmit 콜백 호출
 *
 * 핵심 구현 로직:
 * - Client Component로 구현 ("use client")
 * - useState를 통한 입력 상태 관리
 * - 숫자 입력 검증 (NaN, 0 이하, 최저 입찰가 미만)
 * - 브랜드 톤 에러 메시지 적용
 * - 디버깅 로그 추가
 *
 * 브랜드 통합:
 * - 브랜드 톤 에러 메시지: 단호하지만 따뜻하게
 * - 사용자를 평가하지 않는 메시지
 * - 실패를 허용하는 톤
 *
 * @dependencies
 * - react: useState (상태 관리)
 * - @/components/ui/input: shadcn 입력 컴포넌트
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - BidAmountInput Props 명세 (v2.2)
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
 * @see {@link /docs/ui/design-system.md} - 에러 메시지 톤 가이드
 */

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BidAmountInputProps {
  initialValue?: number;
  minBid?: number;
  onSubmit: (bid: number) => void;
}

export function BidAmountInput({
  initialValue,
  minBid,
  onSubmit,
}: BidAmountInputProps) {
  const [bidAmount, setBidAmount] = useState<string>(
    initialValue?.toString() || ""
  );
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 숫자만 입력 허용 (천 단위 구분자 제거)
    const numericValue = value.replace(/[^0-9]/g, "");
    
    console.log("Bid amount input:", {
      raw: value,
      numeric: numericValue,
      parsed: Number(numericValue),
    });
    
    setBidAmount(numericValue);
    setError("");
  };

  const handleSubmit = () => {
    console.group("Bid Submission");
    
    const amount = Number(bidAmount);
    
    console.log("Validation check:", {
      bidAmount,
      parsedAmount: amount,
      minBid,
      isValid: !isNaN(amount) && amount > 0,
      meetsMinBid: minBid ? amount >= minBid : true,
    });

    // 유효성 검증
    if (isNaN(amount) || amount <= 0) {
      const errorMsg = "유효한 금액을 입력해주세요. 숫자만 입력 가능합니다.";
      console.warn("Validation failed: Invalid amount", { amount });
      setError(errorMsg);
      console.groupEnd();
      return;
    }

    // 최저 입찰가 검증
    if (minBid && amount < minBid) {
      const errorMsg = `최저 입찰가(${minBid.toLocaleString()}원) 미만입니다. 다시 확인해주세요.`;
      console.warn("Validation failed: Below minimum bid", {
        amount,
        minBid,
        difference: minBid - amount,
      });
      setError(errorMsg);
      console.groupEnd();
      return;
    }

    console.log("Bid submission successful:", { amount });
    setError("");
    onSubmit(amount);
    console.groupEnd();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">
          입찰가
        </label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="입찰가를 입력하세요 (숫자만)"
          value={bidAmount ? Number(bidAmount).toLocaleString() : ""}
          onChange={handleInputChange}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            {error}
          </p>
        )}
        {minBid && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            최저 입찰가: <span className="font-semibold">{minBid.toLocaleString()}원</span>
          </p>
        )}
      </div>
      <Button onClick={handleSubmit} size="lg" className="w-full">
        입찰 제출
      </Button>
    </div>
  );
}

