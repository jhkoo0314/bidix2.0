/**
 * @file devtools-check.ts
 * @description Chrome DevTools MCP 검증 헬퍼 스크립트
 *
 * 이 스크립트는 Chrome DevTools MCP 도구를 사용하여
 * 브라우저 개발자 도구의 로그, 네트워크 요청, 에러를 검증하는
 * 헬퍼 함수들을 제공합니다.
 *
 * 실제 실행은 Cursor AI의 Chrome DevTools MCP 도구를 통해 수행됩니다.
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.2 테스트 계획
 */

/**
 * 콘솔 메시지 검증 결과
 */
export interface ConsoleLogVerificationResult {
  success: boolean;
  foundGroups: string[];
  missingGroups: string[];
  errors: string[];
}

/**
 * 네트워크 요청 검증 결과
 */
export interface NetworkRequestVerificationResult {
  success: boolean;
  foundEndpoints: string[];
  missingEndpoints: string[];
  failedRequests: Array<{ url: string; status: number }>;
}

/**
 * 전체 검증 결과
 */
export interface DevToolsVerificationResult {
  consoleLogs: ConsoleLogVerificationResult;
  networkRequests: NetworkRequestVerificationResult;
  hasUnexpectedErrors: boolean;
  errors: string[];
}

/**
 * 예상되는 콘솔 그룹 목록
 */
export const EXPECTED_CONSOLE_GROUPS = {
  dashboard: [
    "Dashboard Page Render",
    "인증 성공",
    "Dashboard Scores Fetch",
    "Dashboard Usage Fetch",
  ],
  simulation: [
    "Create Simulation",
    "시뮬레이션 생성 성공",
  ],
  bid: [
    "Bid Submission",
    "입찰 제출 성공",
  ],
  result: [
    "Result Page Render",
    "Result Page Data Fetch",
    "Score Calculation",
    "ScoreBreakdown 계산 성공",
  ],
} as const;

/**
 * 예상되는 API 엔드포인트 목록
 */
export const EXPECTED_API_ENDPOINTS = {
  dashboard: ["/api/scores", "/api/usage"],
  history: ["/api/history"],
  sync: ["/api/sync-user"],
} as const;

/**
 * 콘솔 로그 검증
 *
 * @param messages 콘솔 메시지 배열
 * @param expectedGroups 예상되는 console.group 목록
 * @returns 검증 결과
 */
export function verifyConsoleLogs(
  messages: Array<{ text: string; type: string }>,
  expectedGroups: readonly string[],
): ConsoleLogVerificationResult {
  const logTexts = messages
    .filter((msg) => msg.type === "log" || msg.type === "group")
    .map((msg) => msg.text);

  const foundGroups: string[] = [];
  const missingGroups: string[] = [];

  expectedGroups.forEach((group) => {
    if (logTexts.some((text) => text.includes(group))) {
      foundGroups.push(group);
    } else {
      missingGroups.push(group);
    }
  });

  const errors = messages
    .filter((msg) => msg.type === "error")
    .map((msg) => msg.text)
    .filter((text) => {
      // 예상된 에러는 제외
      const expectedErrors = [
        "favicon",
        "sourcemap",
        "extension",
        "chrome-extension",
      ];
      return !expectedErrors.some((expected) =>
        text.toLowerCase().includes(expected),
      );
    });

  return {
    success: missingGroups.length === 0 && errors.length === 0,
    foundGroups,
    missingGroups,
    errors,
  };
}

/**
 * 네트워크 요청 검증
 *
 * @param requests 네트워크 요청 배열
 * @param expectedEndpoints 예상되는 API 엔드포인트 목록
 * @returns 검증 결과
 */
export function verifyNetworkRequests(
  requests: Array<{ url: string; status?: number }>,
  expectedEndpoints: readonly string[],
): NetworkRequestVerificationResult {
  const foundEndpoints: string[] = [];
  const missingEndpoints: string[] = [];
  const failedRequests: Array<{ url: string; status: number }> = [];

  expectedEndpoints.forEach((endpoint) => {
    const matchingRequest = requests.find(
      (req) => req.url.includes(endpoint) && req.status === 200,
    );

    if (matchingRequest) {
      foundEndpoints.push(endpoint);
    } else {
      missingEndpoints.push(endpoint);

      // 실패한 요청 찾기
      const failedRequest = requests.find((req) =>
        req.url.includes(endpoint),
      );
      if (failedRequest && failedRequest.status && failedRequest.status !== 200) {
        failedRequests.push({
          url: endpoint,
          status: failedRequest.status,
        });
      }
    }
  });

  return {
    success: missingEndpoints.length === 0 && failedRequests.length === 0,
    foundEndpoints,
    missingEndpoints,
    failedRequests,
  };
}

/**
 * 전체 DevTools 검증
 *
 * @param consoleMessages 콘솔 메시지 배열
 * @param networkRequests 네트워크 요청 배열
 * @param pageType 페이지 타입 (dashboard, simulation, bid, result)
 * @returns 전체 검증 결과
 */
export function verifyDevTools(
  consoleMessages: Array<{ text: string; type: string }>,
  networkRequests: Array<{ url: string; status?: number }>,
  pageType: keyof typeof EXPECTED_CONSOLE_GROUPS,
): DevToolsVerificationResult {
  const expectedGroups = EXPECTED_CONSOLE_GROUPS[pageType];
  const consoleLogs = verifyConsoleLogs(consoleMessages, expectedGroups);

  // 페이지 타입에 따라 예상되는 API 엔드포인트 결정
  let expectedEndpoints: readonly string[] = [];
  if (pageType === "dashboard") {
    expectedEndpoints = EXPECTED_API_ENDPOINTS.dashboard;
  } else if (pageType === "result") {
    // 결과 페이지는 추가 API 호출이 없을 수 있음
    expectedEndpoints = [];
  }

  const network = verifyNetworkRequests(networkRequests, expectedEndpoints);

  return {
    consoleLogs,
    networkRequests: network,
    hasUnexpectedErrors: consoleLogs.errors.length > 0,
    errors: consoleLogs.errors,
  };
}

/**
 * 검증 결과 출력 (포맷팅)
 *
 * @param result 검증 결과
 * @returns 포맷팅된 문자열
 */
export function formatVerificationResult(
  result: DevToolsVerificationResult,
): string {
  const lines: string[] = [];

  lines.push("=== Chrome DevTools MCP 검증 결과 ===\n");

  // 콘솔 로그 검증 결과
  lines.push("📋 콘솔 로그 검증:");
  lines.push(
    `  ✅ 발견된 그룹: ${result.consoleLogs.foundGroups.length}개`,
  );
  if (result.consoleLogs.foundGroups.length > 0) {
    result.consoleLogs.foundGroups.forEach((group) => {
      lines.push(`    - ${group}`);
    });
  }
  if (result.consoleLogs.missingGroups.length > 0) {
    lines.push(
      `  ❌ 누락된 그룹: ${result.consoleLogs.missingGroups.length}개`,
    );
    result.consoleLogs.missingGroups.forEach((group) => {
      lines.push(`    - ${group}`);
    });
  }

  // 네트워크 요청 검증 결과
  lines.push("\n🌐 네트워크 요청 검증:");
  lines.push(
    `  ✅ 발견된 엔드포인트: ${result.networkRequests.foundEndpoints.length}개`,
  );
  if (result.networkRequests.foundEndpoints.length > 0) {
    result.networkRequests.foundEndpoints.forEach((endpoint) => {
      lines.push(`    - ${endpoint}`);
    });
  }
  if (result.networkRequests.missingEndpoints.length > 0) {
    lines.push(
      `  ❌ 누락된 엔드포인트: ${result.networkRequests.missingEndpoints.length}개`,
    );
    result.networkRequests.missingEndpoints.forEach((endpoint) => {
      lines.push(`    - ${endpoint}`);
    });
  }
  if (result.networkRequests.failedRequests.length > 0) {
    lines.push(
      `  ❌ 실패한 요청: ${result.networkRequests.failedRequests.length}개`,
    );
    result.networkRequests.failedRequests.forEach((req) => {
      lines.push(`    - ${req.url}: ${req.status}`);
    });
  }

  // 에러 검증 결과
  lines.push("\n⚠️ 에러 검증:");
  if (result.hasUnexpectedErrors) {
    lines.push(`  ❌ 예상치 못한 에러: ${result.errors.length}개`);
    result.errors.forEach((error) => {
      lines.push(`    - ${error}`);
    });
  } else {
    lines.push("  ✅ 예상치 못한 에러 없음");
  }

  // 전체 결과
  lines.push("\n=== 전체 결과 ===");
  const allSuccess =
    result.consoleLogs.success &&
    result.networkRequests.success &&
    !result.hasUnexpectedErrors;
  lines.push(allSuccess ? "✅ 모든 검증 통과" : "❌ 일부 검증 실패");

  return lines.join("\n");
}

