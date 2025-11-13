/**
 * @file UsageIndicator.tsx
 * @description 사용량 표시 컴포넌트
 *
 * 주요 기능:
 * 1. 일일 사용량 표시 (used / limit)
 * 2. 프로그레스바 형태
 * 3. 남은 횟수 강조
 * 4. 5회 초과 시 메시지 표시
 *
 * 핵심 구현 로직:
 * - 사용량과 제한을 받아 프로그레스바 표시
 * - prdv2.md의 Freemium 전략 반영 (일 5회 제한)
 *
 * @dependencies
 * - tailwindcss: 프로그레스바 스타일링
 *
 * @see {@link /docs/product/prdv2.md} - Freemium 전략 (일 5회 제한)
 */

export interface UsageIndicatorProps {
  used: number;
  limit: number;
}

export function UsageIndicator({ used, limit }: UsageIndicatorProps) {
  const remaining = limit - used;
  const percentage = (used / limit) * 100;
  const isExceeded = used >= limit;

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">일일 사용량</h2>
        <span
          className={`text-sm font-medium ${
            isExceeded
              ? "text-red-600 dark:text-red-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {used} / {limit}회
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isExceeded
              ? "bg-red-500"
              : percentage >= 80
              ? "bg-yellow-500"
              : "bg-primary"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isExceeded ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          일일 사용량을 초과했습니다. 내일 다시 시도해주세요.
        </p>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          남은 횟수: <span className="font-semibold">{remaining}회</span>
        </p>
      )}
    </div>
  );
}

