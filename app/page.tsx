/**
 * @file page.tsx
 * @description BIDIX Landing Page - 브랜드 메시지 중심
 *
 * 주요 기능:
 * 1. 브랜드 슬로건 및 핵심 가치 제안 표시
 * 2. 서비스 소개 및 주요 기능 안내 ('ix' 가치 사슬)
 * 3. Hard 모드 소개
 * 4. CTA 버튼 (첫 입찰 시작)
 * 5. Footer (브랜드명, 링크, 저작권)
 *
 * 핵심 구현 로직:
 * - prdv2.md 및 brand-story.md의 브랜드 메시지 완전 반영
 * - "Fail Safe, Bid Better." 슬로건 및 부제 강조
 * - 브랜드 에센스 "당신의 경험을, 데이터로 증명하다." (brand-message 클래스 적용)
 * - "우리는 경매를 '배워본 적 없는 사람'이 아니라, '해본 적 없는 사람'을 위해 존재합니다." 메시지 추가
 * - 'ix' 가치 사슬 (Infinite eXperience, Insight, Index) 명확히 설명
 * - Hard 모드 소개 섹션 추가 (브랜드 Accent Amber 색상 적용)
 * - Design System v2.2 Typography 규칙 준수 (brand-message 클래스, Heading/Body 폰트)
 * - Layout Rules 준수 (간격 넓게, 경계 옅게)
 *
 * 브랜드 통합:
 * - 브랜드 보이스: 경험 많은 선배 투자자 (Expert Mentor) 톤
 * - 브랜드 Color Tokens: Primary (다크 블루), Accent Amber (Hard 모드)
 * - Typography: Heading은 Inter/Poppins, Body는 Pretendard/Noto Sans KR
 * - 브랜드 문구 스타일: 넓은 letter-spacing + 얇은 weight (brand-message 클래스)
 *
 * @dependencies
 * - next/link: 내비게이션
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - @/components/ui/card: shadcn 카드 컴포넌트
 * - app/globals.css: 브랜드 Color Tokens 및 Typography 유틸리티 클래스
 *
 * @see {@link /docs/product/prdv2.md} - 브랜드 메시지 및 프로로고
 * @see {@link /docs/product/brand-story.md} - 브랜드 스토리 및 보이스 가이드
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "BIDIX - Fail Safe, Bid Better",
  description:
    "초보 투자자가 실패의 두려움 없이 무한히 실전 경험을 쌓아, 스스로 좋은 의사결정을 내릴 수 있는 판단력을 기르도록 돕는 AI 기반 실전 훈련 시뮬레이터",
  keywords: ["경매", "부동산 경매", "경매 시뮬레이션", "투자 교육", "BIDIX", "부동산 투자", "경매 연습"],
  openGraph: {
    title: "BIDIX - Fail Safe, Bid Better",
    description: "당신의 경험을, 데이터로 증명하다.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIDIX - Fail Safe, Bid Better",
    description: "당신의 경험을, 데이터로 증명하다.",
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  console.group("Landing Page Render");
  console.log("브랜드 메시지 중심 Landing Page 렌더링 시작");

  return (
    <main className="min-h-screen flex flex-col">
      {/* 히어로 섹션 */}
      <section className="w-full max-w-4xl mx-auto text-center px-4 md:px-8 py-12 md:py-16 lg:py-24 space-y-6 md:space-y-8">
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight font-[var(--font-inter)]">
            BIDIX
          </h1>
          <div className="space-y-2 md:space-y-3">
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium font-[var(--font-inter)]">
              Fail Safe, Bid Better.
            </p>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-[var(--font-noto-sans-kr)]">
              안전하게 실패하고, 더 나은 입찰자가 되는 것. 이것이 BIDIX의 약속입니다.
            </p>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-foreground brand-message font-[var(--font-noto-sans-kr)]">
            당신의 경험을, 데이터로 증명하다.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6 pt-6 md:pt-8 max-w-3xl mx-auto">
          <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
            우리는 경매를 &apos;배워본 적 없는 사람&apos;이 아니라, &apos;해본 적 없는 사람&apos;을 위해 존재합니다.
          </p>
          <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
            당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다.
          </p>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
            초보 투자자가 실패의 두려움 없이 무한히 실전 경험을 쌓아,
            스스로 좋은 의사결정을 내릴 수 있는 판단력을 기르도록 돕는
            AI 기반 실전 훈련 시뮬레이터입니다.
          </p>
          <p className="text-sm md:text-base lg:text-lg text-foreground font-semibold leading-relaxed font-[var(--font-noto-sans-kr)]">
            실패해도 되는 완벽한 실전을 제공합니다.
          </p>
        </div>

        <div className="pt-6 md:pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-primary hover:bg-primary/90 w-full md:w-auto">
              첫 입찰을 시작하시겠습니까?
            </Button>
          </Link>
        </div>
      </section>

      {/* 'ix' 가치 사슬 섹션 */}
      <section className="w-full max-w-6xl mx-auto mt-12 md:mt-24 px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-[var(--font-inter)]">
            BIDIX의 &apos;ix&apos; 가치 사슬
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-[var(--font-noto-sans-kr)]">
            당신의 실력이 완성되는 3단계 여정
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="p-8 space-y-4 border-border/50">
            <h3 className="text-2xl font-semibold font-[var(--font-inter)]">
              Infinite eXperience
            </h3>
            <p className="text-muted-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
              난이도별 시나리오로 안전하게 실패하며 경험을 쌓습니다.
              리스크 없는 실전에서 무한히 경험하고, 자신만의 데이터와 감각을 쌓아 올립니다.
            </p>
          </Card>
          <Card className="p-8 space-y-4 border-border/50">
            <h3 className="text-2xl font-semibold font-[var(--font-inter)]">
              Insight
            </h3>
            <p className="text-muted-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
              데이터 기반 상세 복기 리포트로 왜 그런 결과가 나왔는지 분석합니다.
              날카로운 통찰을 얻고, 판단력을 한 단계 더 발전시킵니다.
            </p>
          </Card>
          <Card className="p-8 space-y-4 border-border/50">
            <h3 className="text-2xl font-semibold font-[var(--font-inter)]">
              Index
            </h3>
            <p className="text-sm text-muted-foreground mb-2 font-[var(--font-noto-sans-kr)]">
              성장의 지표: 정확성/수익성/안정성
            </p>
            <p className="text-muted-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
              3가지 기준으로 객관적인 점수와 레벨을 제공합니다.
              당신의 실력을 증명하는 객관적인 지표를 완성합니다.
            </p>
          </Card>
        </div>
      </section>

      {/* Hard 모드 소개 섹션 */}
      <section className="w-full max-w-4xl mx-auto mt-12 md:mt-24 px-4 md:px-8">
        <Card className="p-6 md:p-8 lg:p-12 border-2" style={{ borderColor: 'hsl(var(--accent-amber))' }}>
          <div className="space-y-4 md:space-y-6 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-[var(--font-inter)]" style={{ color: 'hsl(var(--accent-amber))' }}>
              Hard 모드
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed font-[var(--font-noto-sans-kr)]">
              실패는 비용이 아닙니다. 여기서는 데이터가 됩니다.
            </p>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-[var(--font-noto-sans-kr)]">
              고난이도 시나리오에서 리스크 없는 환경에서 도전하세요.
              실제 경매와 동일한 변수와 리스크 구조 속에서, 당신은 비로소 진짜 배움을 시작합니다.
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full mt-16 md:mt-32 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-[var(--font-inter)]">BIDIX</h3>
              <p className="text-muted-foreground font-[var(--font-noto-sans-kr)]">
                Fail Safe, Bid Better.
              </p>
              <p className="text-sm text-muted-foreground brand-message font-[var(--font-noto-sans-kr)]">
                당신의 경험을, 데이터로 증명하다.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold font-[var(--font-inter)]">주요 링크</h4>
              <nav className="flex flex-col space-y-2">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-[var(--font-noto-sans-kr)]">
                  대시보드
                </Link>
                <Link href="/simulations" className="text-muted-foreground hover:text-foreground transition-colors font-[var(--font-noto-sans-kr)]">
                  시뮬레이션
                </Link>
                <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors font-[var(--font-noto-sans-kr)]">
                  히스토리
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold font-[var(--font-inter)]">정보</h4>
              <p className="text-sm text-muted-foreground font-[var(--font-noto-sans-kr)]">
                © 2025 BIDIX. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
