"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * @file theme-provider.tsx
 * @description 다크모드 테마 Provider 컴포넌트
 *
 * next-themes의 ThemeProvider를 래핑하여 BIDIX 앱 전체에 다크모드 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 시스템 설정 감지 (enableSystem)
 * 2. 클래스 기반 다크모드 (attribute="class")
 * 3. 테마 상태 관리 (light/dark/system)
 *
 * @dependencies
 * - next-themes: 다크모드 상태 관리 라이브러리
 */

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

