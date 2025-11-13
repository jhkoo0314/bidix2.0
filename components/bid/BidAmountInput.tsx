/**
 * @file BidAmountInput.tsx
 * @description 입찰가 입력 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 입찰가 숫자 입력
 * 2. 최저 입찰가 검증
 * 3. 제출 핸들러
 *
 * 핵심 구현 로직:
 * - Client Component로 구현
 * - react-hook-form 사용 (선택적)
 * - 숫자 입력 검증
 *
 * @dependencies
 * - react: useState
 * - @/components/ui/input: shadcn 입력 컴포넌트
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/component-spec.md} - BidAmountInput Props 명세
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

  const handleSubmit = () => {
    const amount = Number(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError("유효한 금액을 입력해주세요.");
      return;
    }

    if (minBid && amount < minBid) {
      setError(`최저 입찰가(${minBid.toLocaleString()}원) 이상 입력해주세요.`);
      return;
    }

    setError("");
    onSubmit(amount);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold mb-2 block">입찰가</label>
        <Input
          type="number"
          placeholder="입찰가를 입력하세요"
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(e.target.value);
            setError("");
          }}
          className={error ? "border-red-500" : ""}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {minBid && (
          <p className="text-sm text-gray-500 mt-1">
            최저 입찰가: {minBid.toLocaleString()}원
          </p>
        )}
      </div>
      <Button onClick={handleSubmit} size="lg" className="w-full">
        입찰 제출
      </Button>
    </div>
  );
}

