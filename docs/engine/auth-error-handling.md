# 인증 및 에러 처리 공통 규칙

**Version:** v2.2  
**Last Updated:** 2025-01-28  
**Status:** ✅ Active

---

## 개요

모든 Server Actions와 API Routes에서 일관된 인증 및 에러 처리를 보장하기 위한 공통 규칙입니다.

> **핵심 원칙:**
> - 모든 Server Actions와 API Routes는 Clerk `auth()`를 사용하여 인증을 확인합니다.
> - 미인증 요청은 즉시 반환하며, 추가 로직을 실행하지 않습니다.
> - 에러 포맷은 Server Actions와 API Routes에 따라 다르게 정의됩니다.
> - 브랜드 보이스 가이드라인을 준수합니다.

---

## 1. 인증 규칙

### 1.1 Clerk `auth()` 사용

모든 Server Actions와 API Routes는 함수 시작 부분에서 Clerk의 `auth()` 함수를 호출하여 사용자 인증을 확인해야 합니다.

```typescript
import { auth } from "@clerk/nextjs/server";

// Server Action 예시
export async function myAction() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "로그인이 필요합니다." };
  }
  // ... 나머지 로직
}

// API Route 예시
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  // ... 나머지 로직
}
```

### 1.2 미인증 요청 처리

미인증 요청은 **즉시 반환**해야 하며, 추가 로직을 실행하지 않습니다.

**✅ 올바른 예시:**
```typescript
export async function myAction() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "로그인이 필요합니다." };
  }
  
  // 인증 확인 후에만 실행되는 로직
  const result = await someService.doSomething(userId);
  return { ok: true, data: result };
}
```

**❌ 잘못된 예시:**
```typescript
export async function myAction() {
  // 인증 확인 전에 로직 실행 (❌)
  const data = await fetchData();
  
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "로그인이 필요합니다." };
  }
  // ...
}
```

### 1.3 인증 에러 메시지

모든 파일에서 **"로그인이 필요합니다."**로 통일합니다.

**통일된 메시지:**
- ✅ "로그인이 필요합니다."
- ❌ "인증이 필요합니다."
- ❌ "사용자 인증이 필요합니다."
- ❌ "Unauthorized"

---

## 2. Server Actions 에러 포맷

### 2.1 성공 응답

```typescript
// 데이터 포함
{ ok: true, data: T }

// 데이터 없음
{ ok: true }
```

### 2.2 실패 응답

#### 일반 에러
```typescript
{ ok: false, error: string }
```

#### 검증 실패 (Zod 등)
```typescript
{ ok: false, error: string, errorDetails?: object }
```

### 2.3 예시

```typescript
export async function myAction(input: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { ok: false, error: "로그인이 필요합니다." };
    }

    // 검증
    const parsed = schema.safeParse({ input });
    if (!parsed.success) {
      return {
        ok: false,
        error: "입력값이 유효하지 않습니다.",
        errorDetails: parsed.error.flatten().fieldErrors,
      };
    }

    // 비즈니스 로직
    const result = await service.doSomething(userId, parsed.data.input);

    return { ok: true, data: result };
  } catch (err) {
    console.error("[myAction ERROR]:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "처리 중 오류가 발생했습니다.",
    };
  }
}
```

---

## 3. API Routes 에러 포맷

### 3.1 성공 응답

```typescript
NextResponse.json(data, { status: 200 })
```

### 3.2 실패 응답

```typescript
NextResponse.json({ error: string }, { status: 4xx | 5xx })
```

### 3.3 상태 코드 가이드

| 상황 | 상태 코드 | 예시 |
|:---|:---:|:---|
| 미인증 | 401 | `{ error: "로그인이 필요합니다." }` |
| 권한 없음 | 403 | `{ error: "권한이 없습니다." }` |
| 리소스 없음 | 404 | `{ error: "리소스를 찾을 수 없습니다." }` |
| 검증 실패 | 400 | `{ error: "입력값이 유효하지 않습니다." }` |
| 서버 오류 | 500 | `{ error: "서버 오류가 발생했습니다." }` |

### 3.4 예시

```typescript
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const data = await service.getData(userId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/example ERROR]:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

---

## 4. 에러 처리 패턴

### 4.1 try-catch 블록

모든 Server Actions와 API Routes는 try-catch 블록으로 에러를 처리해야 합니다.

```typescript
export async function myAction() {
  try {
    // ... 로직
  } catch (err) {
    console.error("[myAction ERROR]:", err);
    // 에러 반환
  }
}
```

### 4.2 에러 로깅

에러 발생 시 `console.error`를 사용하여 로깅합니다.

**형식:**
- Server Actions: `console.error("[ActionName ERROR]:", err);`
- API Routes: `console.error("[GET /api/route ERROR]:", err);`

### 4.3 에러 메시지 추출

에러 객체에서 메시지를 안전하게 추출합니다.

```typescript
catch (err) {
  const errorMessage =
    err instanceof Error
      ? err.message
      : "처리 중 오류가 발생했습니다.";
  
  return { ok: false, error: errorMessage };
}
```

---

## 5. 브랜드 보이스 가이드라인

### 5.1 메시지 톤

- ✅ **따뜻하고 격려하는 톤**
- ✅ **사용자 친화적 메시지**
- ❌ 기술적 용어 최소화
- ❌ 냉정하거나 무뚝뚝한 메시지

### 5.2 좋은 예시

- ✅ "로그인이 필요합니다."
- ✅ "입력값이 유효하지 않습니다."
- ✅ "처리 중 오류가 발생했습니다."
- ✅ "데이터 조회 중 오류가 발생했습니다."

### 5.3 피해야 할 예시

- ❌ "Unauthorized"
- ❌ "Invalid input"
- ❌ "Internal server error"
- ❌ "Authentication failed"

---

## 6. 체크리스트

새로운 Server Action 또는 API Route를 작성할 때 다음을 확인하세요:

- [ ] 함수 시작 부분에서 `auth()` 호출
- [ ] 미인증 시 즉시 반환 (추가 로직 실행 전)
- [ ] 인증 에러 메시지: "로그인이 필요합니다."
- [ ] try-catch 블록으로 에러 처리
- [ ] `console.error`로 에러 로깅
- [ ] Server Actions: `{ ok: boolean, error?: string, data?: T }` 형식
- [ ] API Routes: `NextResponse.json({ error: string }, { status: number })` 형식
- [ ] 브랜드 보이스 가이드라인 준수

---

## 7. 참조 문서

- `docs/engine/api-contracts.md` - API Contracts 명세
- `docs/product/prdv2.md` - 브랜드 보이스 가이드라인
- `docs/verification/auth-error-handling-verification.md` - 검증 결과

---

**END OF DOCUMENT**

