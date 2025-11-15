"use client";

import { memo } from "react";
import { useSyncUser } from "@/hooks/use-sync-user";

/**
 * Clerk 사용자를 Supabase DB에 자동으로 동기화하는 프로바이더
 *
 * RootLayout에 추가하여 로그인한 모든 사용자를 자동으로 Supabase에 동기화합니다.
 * 
 * 성능 최적화:
 * - memo로 래핑하여 children이 변경되지 않으면 리렌더링 방지
 */
export const SyncUserProvider = memo(function SyncUserProvider({ children }: { children: React.ReactNode }) {
  useSyncUser();
  return <>{children}</>;
});
