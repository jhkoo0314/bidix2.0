import { SignIn } from "@clerk/nextjs";

/**
 * @file sign-in/[[...sign-in]]/page.tsx
 * @description Clerk 로그인 페이지
 *
 * Clerk의 catch-all route를 사용하여 모든 로그인 관련 경로를 처리합니다.
 * 예: /sign-in, /sign-in/factor-one, /sign-in/sso-callback 등
 *
 * @dependencies
 * - @clerk/nextjs: SignIn 컴포넌트
 */
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <SignIn />
    </div>
  );
}

