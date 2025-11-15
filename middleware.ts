import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 로그인 없이 접근 가능한 공개 라우트 목록
const isPublicRoute = createRouteMatcher([
  "/", // 랜딩페이지 - 항상 공개
  "/guide", // 가이드 페이지
  "/properties", // 매물리스트 페이지
  "/simulation", // 테스트 페이지
  // Clerk 인증 경로 - 무한 리디렉션 방지를 위해 필수
  "/sign-in(.*)", // 로그인 페이지 및 하위 경로
  "/sign-up(.*)", // 회원가입 페이지 및 하위 경로
  "/sso-callback(.*)", // SSO 콜백 경로
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 루트 경로는 명시적으로 공개 (404 방지)
  if (pathname === "/") {
    return;
  }

  // 공개 경로가 아니면 인증 확인
  // 보호가 필요한 페이지(/dashboard, /simulations, /history 등)와 API 라우트만 인증 필요
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
