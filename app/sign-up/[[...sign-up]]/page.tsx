import { SignUp } from "@clerk/nextjs";

/**
 * @file sign-up/[[...sign-up]]/page.tsx
 * @description Clerk 회원가입 페이지
 *
 * Clerk의 catch-all route를 사용하여 모든 회원가입 관련 경로를 처리합니다.
 * 예: /sign-up, /sign-up/continue, /sign-up/verify-email 등
 *
 * @dependencies
 * - @clerk/nextjs: SignUp 컴포넌트
 */
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <SignUp />
    </div>
  );
}

