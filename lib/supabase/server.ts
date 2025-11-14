import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk 토큰을 Supabase가 자동 검증
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL or Anon Key is missing. Please check your environment variables.",
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      try {
        // lib/supabase.ts와 동일한 패턴 사용
        const token = await (await auth()).getToken();
        return token ?? null;
      } catch (error) {
        console.error("Failed to get Clerk token:", error);
        console.error(
          "Token error details:",
          error instanceof Error ? error.message : String(error),
        );
        // 토큰을 가져오지 못해도 클라이언트는 생성하되, 인증이 필요한 쿼리는 실패할 것입니다
        return null;
      }
    },
  });
}
