# 테스트 Fixtures 가이드

## Clerk storageState 생성 방법

E2E 테스트를 실행하기 전에 Clerk 인증 상태를 저장해야 합니다.

### 1. 수동 생성 방법

1. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. Playwright를 사용하여 로그인 후 storageState 저장:
   ```bash
   npx playwright codegen http://localhost:3000
   ```

3. 또는 다음 스크립트를 사용:

```typescript
// tests/fixtures/setup-auth.ts (임시 파일)
import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  // 로그인 페이지로 이동
  await page.goto("http://localhost:3000/sign-in");

  // Clerk 로그인 (실제 이메일/비밀번호 입력)
  // 또는 테스트 계정 사용
  await page.fill('input[name="identifier"]', "test@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // 로그인 완료 대기
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });

  // storageState 저장
  await page.context().storageState({ path: "./tests/fixtures/auth.json" });
});
```

4. 스크립트 실행:
   ```bash
   npx playwright test tests/fixtures/setup-auth.ts --project=chromium
   ```

### 2. 환경 변수 설정

테스트 실행을 위해 다음 환경 변수를 설정하세요:

```bash
# .env.test 또는 .env.local
TEST_USER_ID=user_xxxxxxxxxxxxx  # Clerk 사용자 ID
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. 주의사항

- `auth.json` 파일은 `.gitignore`에 추가되어 있어 Git에 커밋되지 않습니다.
- 실제 프로덕션 계정을 사용하지 마세요. 테스트 전용 계정을 사용하세요.
- `auth.json` 파일은 보안상 중요한 정보를 포함하므로 공유하지 마세요.

## 테스트 실행

```bash
# E2E 테스트 실행
pnpm test:e2e

# 특정 테스트 파일만 실행
npx playwright test tests/e2e/simulation-flow.spec.ts

# UI 모드로 실행 (디버깅)
pnpm test:e2e:ui
```

