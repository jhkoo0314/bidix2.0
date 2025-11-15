/**
 * @file Navbar.tsx
 * @description 네비게이션 바 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 데스크톱/모바일 반응형 네비게이션
 * 2. 다크모드 토글 (next-themes)
 * 3. Clerk 인증 상태에 따른 로그인/사용자 버튼 표시
 * 4. 모바일 햄버거 메뉴 (Sheet 컴포넌트)
 *
 * 핵심 구현 로직:
 * - Client Component로 구현 ("use client")
 * - Hydration mismatch 방지를 위한 mounted 상태 관리
 * - 데스크톱: 가로 네비게이션 링크
 * - 모바일: 햄버거 메뉴 (Sheet 컴포넌트)
 * - 다크모드 토글 버튼 (aria-label 포함)
 * - 접근성: 내비게이션에 aria-label, 포커스 링 스타일 적용
 *
 * 브랜드 통합:
 * - 브랜드 폰트: Inter (로고), Noto Sans KR (링크)
 * - Design System v2.2: 반응형 레이아웃, 접근성 준수
 *
 * @dependencies
 * - @clerk/nextjs: SignedOut, SignInButton, SignedIn, UserButton
 * - next-themes: useTheme (다크모드)
 * - lucide-react: Moon, Sun, Menu 아이콘
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - @/components/ui/sheet: shadcn 시트 컴포넌트
 *
 * @see {@link /docs/ui/component-architecture.md} - 컴포넌트 구조
 * @see {@link /docs/ui/design-system.md} - 브랜드 Typography 규칙
 */

"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Hydration mismatch 방지
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/simulations", label: "Simulations" },
    { href: "/history", label: "History" },
  ];

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold font-[var(--font-inter)]">
        BIDIX
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center" aria-label="주요 내비게이션">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:text-primary transition-colors font-[var(--font-noto-sans-kr)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {link.label}
          </Link>
        ))}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="다크모드 토글"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>

      {/* Mobile Navigation - 햄버거 메뉴 */}
      <div className="md:hidden flex items-center gap-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="다크모드 토글"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="메뉴 열기">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="font-[var(--font-inter)]">메뉴</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8" aria-label="모바일 메뉴">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium hover:text-primary transition-colors font-[var(--font-noto-sans-kr)] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
