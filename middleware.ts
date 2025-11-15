import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 로그인 없이 접근 가능한 라우트 목록
const isPublicRoute = createRouteMatcher([
  "/", // 랜딩페이지
  "/guide", // 가이드 (원하면)
  "/properties", // 매물리스트 (원하면)
  "/simulation", // 테스트 페이지 (원하면)
  // Clerk 인증 경로 (필수! - 무한 리디렉션 방지)
  "/sign-in(.*)", // 로그인 페이지
  "/sign-up(.*)", // 회원가입 페이지
  "/sso-callback(.*)", // SSO 콜백
]);

export default clerkMiddleware(async (auth, req) => {
  // 공개 경로가 아니면 인증 확인
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always protect API routes
    "/(api|trpc)(.*)",
  ],
};
