/**
 * @file page.tsx
 * @description BIDIX Landing Page - 브랜드 메시지 중심
 *
 * 주요 기능:
 * 1. 브랜드 슬로건 및 핵심 가치 제안 표시
 * 2. 서비스 소개 및 주요 기능 안내
 * 3. CTA 버튼 (원가로 시작하기)
 *
 * 핵심 구현 로직:
 * - prdv2.md의 브랜드 메시지 반영
 * - "Fail Safe, Bid Better." 슬로건 강조
 * - Financial Clarity 원칙 준수 (과도한 이모지 금지)
 *
 * @dependencies
 * - next/link: 내비게이션
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/product/prdv2.md} - 브랜드 메시지 및 프로로고
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-8 py-16 lg:py-24">
      {/* 히어로 섹션 */}
      <section className="w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            BIDIX
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 font-medium">
            Fail Safe, Bid Better.
          </p>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mt-4">
            당신의 경험을, 데이터로 증명하다.
          </p>
        </div>

        <div className="space-y-6 pt-8">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            초보 투자자가 실패의 두려움 없이 무한히 실전 경험을 쌓아,
            스스로 좋은 의사결정을 내릴 수 있는 판단력을 기르도록 돕는
            AI 기반 실전 훈련 시뮬레이터입니다.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              원가로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 주요 기능 소개 섹션 */}
      <section className="w-full max-w-6xl mx-auto mt-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold">무한한 경험</h3>
            <p className="text-gray-600 dark:text-gray-400">
              난이도별 시나리오로 안전하게 실패하며 경험을 쌓습니다.
            </p>
          </div>
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold">날카로운 통찰</h3>
            <p className="text-gray-600 dark:text-gray-400">
              데이터 기반 상세 복기 리포트로 왜 그런 결과가 나왔는지
              분석합니다.
            </p>
          </div>
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold">성장의 지표</h3>
            <p className="text-gray-600 dark:text-gray-400">
              정확성/수익성/안정성 3가지 기준으로 객관적인 점수와 레벨을
              제공합니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
