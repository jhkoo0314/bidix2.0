
```md
# 📑 BIDIX AI — API Contracts for v2.0
**Version:** v2.0
**Last Updated:** 2025-11-09
**Auth:** Clerk (Server-side via `@clerk/nextjs`)

> **핵심 원칙:**
> - **Server Actions First:** 핵심적인 데이터 변경(생성, 입찰)은 API Routes 대신 **Next.js Server Actions**를 통해 처리하여 보안과 편의성을 높인다.
> - **Read via API Routes:** 목록 조회 등 데이터를 읽어오는 작업은 전통적인 `GET` API Routes를 통해 제공한다.
> - **SSOT 준수:** 모든 데이터 구조는 `/lib/types/*.ts` 및 `/docs/engine/json-schema.md`의 최종 설계를 따른다.

---

## 1. ⚡️ Server Actions (핵심 동작)

> Server Actions는 UI(주로 Form)에서 직접 호출되는 `"use server"` 함수입니다. 별도의 API 엔드포인트가 존재하지 않습니다.

### **1.1 `generateSimulationAction`**

*   **파일 위치:** `/app/action/generatesimulation.ts`
*   **설명:** 사용자가 선택한 난이도로 **새로운 '입찰 전' 시뮬레이션을 생성**하고, 초기 데이터를 DB에 저장한 뒤, 생성된 `simulationId`와 초기 결과를 반환합니다.

**Request (함수 파라미터)**
```typescript
function generateSimulationAction(difficulty: "easy" | "normal" | "hard")
```

**Response (함수 반환값)**
```typescript
// 성공 시 (ok: true)
{
  ok: true,
  data: {
    simulationId: string,       // 생성된 시뮬레이션의 UUID
    initialResult: AuctionAnalysisResult // 입찰 전 초기 분석 결과
  }
}

// 실패 시 (ok: false)
{
  ok: false,
  error: string // 에러 메시지
}
```

### **1.2 `submitBidAction`**

*   **파일 위치:** `/app/action/submitbid.ts`
*   **설명:** 사용자가 제출한 입찰가(`userBid`)와 자금 구성(현금/대출)을 받아, 기존 시뮬레이션 데이터를 업데이트하고 최종 결과와 점수를 계산하여 반환합니다.
*   **입력:** `FormData` (UI의 `<form>`에서 직접 전달)
    *   `simulationId`: `string`
    *   `bidAmount`: `number`
    *   `cashAmount`: `number` (optional, 현금과 대출을 모두 입력하거나 모두 비워야 함)
    *   `loanAmount`: `number` (optional, 현금과 대출을 모두 입력하거나 모두 비워야 함)
    
**검증 규칙**:
- 현금과 대출을 모두 입력한 경우: `cashAmount + loanAmount = bidAmount`
- 현금과 대출을 모두 비운 경우: 정책 기본값 사용 (대출 70%)
- 하나만 입력한 경우: 에러 반환

**Response (함수 반환값)**
```typescript
// 성공 시 (ok: true)
{
  ok: true,
  data: {
    ...AuctionAnalysisResult, // 최종 분석 결과 전체
    score: ScoreEngineResult   // 점수 계산 결과
  }
}

// 실패 시 (ok: false)
{
  ok: false,
  error: string, // Zod 유효성 검사 실패 또는 서버 에러 메시지
  errorDetails?: object // Zod 필드별 오류 상세
}
```

---

## 2. 📡 API Routes (데이터 조회)

> `GET` 요청을 통해 데이터를 조회하는 표준 API 엔드포인트입니다.

### **2.1 `GET /api/history`**

*   **라우트 파일:** `/app/api/history/route.ts`
*   **설명:** 현재 사용자의 **입찰 히스토리 목록**을 가져옵니다.
*   **쿼리 파라미터:** `?limit=20`, `?cursor=...` (페이지네이션)

**Response 200**
```json
{
  "items": [
    {
      "historyId": "...",
      "simulationId": "...",
      "pinned": false,
      "savedAt": "2025-11-09T12:00:00.000Z",
      "propertyType": "apartment",
      "myBid": 560000000,
      "outcome": "success",
      "initialSafetyMargin": 0.098
    }
  ],
  "nextCursor": "c3..."
}
```

### **2.2 `GET /api/scores`**

*   **라우트 파일:** `/app/api/scores/route.ts`
*   **설명:** 현재 사용자의 **점수, 레벨, 등급 등**의 정보를 가져옵니다.

**Response 200**
```json
{
  "level": 3,
  "score": 1240,
  "tier": "Bronze",
  "totalSimulations": 47
}
```

### **2.3 `GET /api/usage`**

*   **라우트 파일:** `/app/api/usage/route.ts`
*   **설명:** 현재 사용자의 **오늘 사용량 및 한도** 정보를 가져옵니다.

**Response 200**
```json
{
  "date": "2025-11-10",
  "bids": {
  "used": 2,
  "limit": 5,
  "remaining": 3
      },
  "freeReport": {
  "viewed": false,
  "limit": 1,
  "remaining": 1
      }
}

---

## 3. 공통 규칙

*   **인증:** 모든 Server Actions와 API Routes는 내부적으로 Clerk의 `auth()` 헬퍼를 사용하여 사용자 인증을 확인해야 합니다. 미인증 요청은 에러를 반환합니다.
*   **에러 포맷:** Server Actions는 `{ ok: false, error: "..." }` 형태의 객체를, API Routes는 `{ "error": "..." }` 형태의 JSON을 `4xx/5xx` 상태 코드와 함께 반환합니다.

---
**END OF FILE**
```

