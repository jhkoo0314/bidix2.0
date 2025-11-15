"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - useAuth().getToken()으로 현재 세션 토큰 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase URL or Anon Key is missing. Please check your environment variables.",
      );
    }

    // accessToken 함수를 안정적으로 생성 (Realtime 인증 토큰 에러 방지)
    const accessTokenFn = async (): Promise<string | null> => {
      try {
        if (!getToken) {
          return null;
        }
        const token = await getToken();
        return token ?? null;
      } catch (error) {
        console.error("Failed to get Clerk token for Supabase:", error);
        return null;
      }
    };

    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // Client Component에서는 세션을 Clerk이 관리
      },
      realtime: {
        // Realtime 연결 설정 (빌드 시 안정성 확보)
        params: {
          eventsPerSecond: 10,
        },
      },
      async accessToken() {
        return await accessTokenFn();
      },
    });
  }, [getToken]);

  return supabase;
}
