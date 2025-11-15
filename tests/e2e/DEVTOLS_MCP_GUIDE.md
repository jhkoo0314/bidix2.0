# Chrome DevTools MCP 테스트 가이드

이 가이드는 Chrome DevTools MCP를 사용하여 브라우저 개발자 도구의 로그, 네트워크 요청, 에러를 검증하는 방법을 설명합니다.

## 사전 준비

1. **개발 서버 실행**

   ```bash
   pnpm dev
   ```

   서버가 `http://localhost:3000`에서 실행되어야 합니다.

2. **Chrome DevTools MCP 설정 확인**
   - Cursor AI에서 Chrome DevTools MCP 서버가 설정되어 있는지 확인
   - MCP 도구 목록에 `mcp_chrome-devtools_*` 도구들이 있는지 확인

## 테스트 실행 방법

Chrome DevTools MCP 테스트는 Cursor AI를 통해 실행됩니다. 각 테스트 케이스를 순서대로 실행하세요.

## 테스트 케이스 1: Dashboard 페이지 검증

### 목표

Dashboard 페이지의 콘솔 로그, 네트워크 요청, 헤더 기능을 검증합니다.

### 실행 순서

1. **페이지 열기**

   ```
   mcp_chrome-devtools_new_page({ url: "http://localhost:3000/dashboard" })
   ```

2. **페이지 로드 대기**

   ```
   mcp_chrome-devtools_wait_for({ text: "Dashboard" })
   ```

3. **콘솔 메시지 확인**

   ```
   mcp_chrome-devtools_list_console_messages()
   ```

   **검증 기준:**

   - `console.group("Dashboard Page Render")` 존재
   - `console.log("인증 성공")` 존재
   - `console.group("Dashboard Scores Fetch")` 존재
   - `console.group("Dashboard Usage Fetch")` 존재
   - `console.error` 없음 (예상된 에러 제외)

4. **네트워크 요청 확인**

   ```
   mcp_chrome-devtools_list_network_requests()
   ```

   **검증 기준:**

   - `/api/scores` 요청 존재 (200 OK)
   - `/api/usage` 요청 존재 (200 OK)
   - 응답 데이터 구조 확인:
     - `/api/scores`: `{ level, score, tier, totalSimulations }`
     - `/api/usage`: `{ date, bids: { used, limit }, freeReport: { used, limit, remaining } }`

5. **헤더 확인**

   ```
   mcp_chrome-devtools_take_snapshot()
   ```

   **검증 기준:**

   - Navbar 렌더링 확인
   - 네비게이션 링크 확인 (Dashboard, Simulations, History)
   - 사용자 정보 표시 확인 (UserButton)

## 테스트 케이스 2: 시뮬레이션 생성 플로우 검증

### 목표

시뮬레이션 생성 시 콘솔 로그와 네트워크 요청을 검증합니다.

### 실행 순서

1. **Dashboard 페이지 접근**

   ```
   mcp_chrome-devtools_navigate_page({ url: "http://localhost:3000/dashboard" })
   ```

2. **난이도 선택 버튼 클릭**

   ```
   mcp_chrome-devtools_click({ uid: "난이도 선택 버튼의 uid" })
   ```

3. **Normal 난이도 선택**

   ```
   mcp_chrome-devtools_click({ uid: "Normal 버튼의 uid" })
   ```

4. **시뮬레이션 생성 버튼 클릭**

   ```
   mcp_chrome-devtools_click({ uid: "새로운 시뮬레이션 생성 버튼의 uid" })
   ```

5. **콘솔 메시지 확인**

   ```
   mcp_chrome-devtools_list_console_messages()
   ```

   **검증 기준:**

   - `console.group("Create Simulation")` 존재
   - `console.log("시뮬레이션 생성 성공")` 존재

6. **네트워크 요청 확인**

   ```
   mcp_chrome-devtools_list_network_requests()
   ```

   **검증 기준:**

   - Server Action 호출 확인 (generateSimulationAction)
   - 상세 페이지로 이동 확인 (`/simulations/[id]`)

## 테스트 케이스 3: 입찰 플로우 검증

### 목표

입찰 제출 시 콘솔 로그와 네트워크 요청을 검증합니다.

### 실행 순서

1. **시뮬레이션 상세 페이지 접근**

   ```
   mcp_chrome-devtools_navigate_page({ url: "http://localhost:3000/simulations/[id]" })
   ```

2. **입찰하기 버튼 클릭**

   ```
   mcp_chrome-devtools_click({ uid: "입찰하기 버튼의 uid" })
   ```

3. **입찰가 입력**

   ```
   mcp_chrome-devtools_fill({ uid: "입찰가 입력 필드의 uid", value: "150000000" })
   ```

4. **입찰 제출 버튼 클릭**

   ```
   mcp_chrome-devtools_click({ uid: "입찰 제출 버튼의 uid" })
   ```

5. **콘솔 메시지 확인**

   ```
   mcp_chrome-devtools_list_console_messages()
   ```

   **검증 기준:**

   - `console.group("Bid Submission")` 존재
   - `console.log("입찰 제출 성공")` 존재

6. **네트워크 요청 확인**

   ```
   mcp_chrome-devtools_list_network_requests()
   ```

   **검증 기준:**

   - submitBidAction 호출 확인
   - 결과 페이지로 이동 확인 (`/simulations/[id]/result`)

## 테스트 케이스 4: 결과 페이지 검증

### 목표

결과 페이지의 데이터 로드 로그와 점수 계산 로그를 검증합니다.

### 실행 순서

1. **결과 페이지 접근**

   ```
   mcp_chrome-devtools_navigate_page({ url: "http://localhost:3000/simulations/[id]/result" })
   ```

2. **페이지 로드 대기**

   ```
   mcp_chrome-devtools_wait_for({ text: "입찰 결과" })
   ```

3. **콘솔 메시지 확인**

   ```
   mcp_chrome-devtools_list_console_messages()
   ```

   **검증 기준:**

   - `console.group("Result Page Render")` 존재
   - `console.group("Result Page Data Fetch")` 존재
   - `console.group("Score Calculation")` 존재
   - `console.log("ScoreBreakdown 계산 성공")` 존재
   - `console.error` 없음 (예상된 에러 제외)

4. **네트워크 요청 확인** (필요 시)

   ```
   mcp_chrome-devtools_list_network_requests()
   ```

   **검증 기준:**

   - `/api/usage` 요청 확인 (무료 리포트 사용량 체크)

## 테스트 케이스 5: 네트워크 요청 상세 검증

### 목표

각 API 엔드포인트의 요청/응답을 상세히 검증합니다.

### 실행 순서

1. **각 페이지 접근 후 네트워크 요청 목록 확인**

   ```
   mcp_chrome-devtools_list_network_requests()
   ```

2. **특정 요청 상세 정보 확인**
   ```
   mcp_chrome-devtools_get_network_request({ reqid: [요청 ID] })
   ```

### 검증 대상 API

#### `/api/scores`

- **요청**: GET
- **응답 상태**: 200 OK
- **응답 데이터 구조**:
  ```json
  {
    "level": 1,
    "score": 0,
    "tier": "Bronze",
    "totalSimulations": 0
  }
  ```

#### `/api/usage`

- **요청**: GET
- **응답 상태**: 200 OK
- **응답 데이터 구조**:
  ```json
  {
    "date": "2025-01-28",
    "bids": {
      "used": 0,
      "limit": 5
    },
    "freeReport": {
      "used": 0,
      "limit": 1,
      "remaining": 1
    }
  }
  ```

#### `/api/history`

- **요청**: GET
- **응답 상태**: 200 OK
- **응답 데이터 구조**:
  ```json
  {
    "items": [...],
    "nextCursor": "..."
  }
  ```

#### `/api/sync-user`

- **요청**: POST
- **응답 상태**: 200 OK
- **응답 데이터 구조**:
  ```json
  {
    "success": true,
    "userId": "..."
  }
  ```

## 테스트 케이스 6: 콘솔 에러 확인

### 목표

예상치 못한 콘솔 에러가 없는지 확인합니다.

### 실행 순서

1. **각 핵심 페이지 접근**
2. **에러 메시지만 필터링하여 확인**
   ```
   mcp_chrome-devtools_list_console_messages({ types: ["error"] })
   ```

### 검증 기준

- **예상된 에러 제외**:

  - favicon 관련 에러
  - sourcemap 관련 에러
  - chrome-extension 관련 에러

- **예상치 못한 에러 확인**:
  - JavaScript 런타임 에러
  - API 호출 실패 에러
  - 데이터 파싱 실패 에러

## 테스트 케이스 7: 헤더 기능 확인

### 목표

Navbar의 렌더링 및 네비게이션 기능을 확인합니다.

### 실행 순서

1. **각 페이지 접근**
2. **페이지 스냅샷 확인**
   ```
   mcp_chrome-devtools_take_snapshot()
   ```

### 검증 기준

- **Navbar 렌더링**:

  - BIDIX 로고 표시
  - 네비게이션 링크 표시 (Dashboard, Simulations, History)
  - 다크모드 토글 버튼 표시

- **인증 상태**:

  - 로그인 상태: UserButton 표시
  - 로그아웃 상태: 로그인 버튼 표시

- **네비게이션 기능**:
  - 각 링크 클릭 시 해당 페이지로 이동 확인

## 검증 결과 기록

각 테스트 케이스 실행 후 다음 정보를 기록하세요:

1. **콘솔 로그 검증 결과**

   - 발견된 console.group 목록
   - 누락된 console.group 목록
   - 발견된 에러 목록

2. **네트워크 요청 검증 결과**

   - 발견된 API 엔드포인트 목록
   - 누락된 API 엔드포인트 목록
   - 실패한 요청 목록

3. **전체 검증 결과**
   - 모든 검증 통과 여부
   - 실패한 검증 항목 및 원인

## 문제 해결

### 페이지가 로드되지 않는 경우

- 개발 서버가 실행 중인지 확인 (`pnpm dev`)
- 브라우저 콘솔에서 에러 확인

### 인증이 필요한 페이지 접근 시

- Clerk 로그인 상태 확인
- storageState 사용 또는 수동 로그인

### 네트워크 요청이 보이지 않는 경우

- 페이지 새로고침 후 재확인
- 네트워크 탭에서 필터 확인

## 참고 자료

- `tests/e2e/devtools-mcp.spec.ts` - 테스트 가이드 및 검증 기준
- `tests/scripts/devtools-check.ts` - 검증 헬퍼 함수
- `docs/product/prdv2.md` - PRD v2.0 핵심 기능 요구사항
