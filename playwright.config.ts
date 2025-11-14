// playwright.config.ts
// BIDIX AI - Playwright Configuration
// Version: 2.2
// Last Updated: 2025-01-28

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 설정
 * 
 * 참고: 실제 E2E 테스트를 실행하려면 개발 서버가 실행 중이어야 합니다.
 * `pnpm dev` 실행 후 `pnpm test:e2e` 명령어로 테스트 실행
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});

