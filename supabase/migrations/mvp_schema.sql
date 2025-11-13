-- ============================================================
-- BIDIX AI – Users Table (Development Mode)
-- Last Updated: 2025-11-13
--
-- ✔ 개발 단계: RLS 비활성화 + SQL INSERT 가능
-- ✔ 운영 단계: 반드시 RLS 활성화 및 정책 추가 필요
--
-- ※ 주의: 이 users 테이블은 Clerk/Auth 시스템 테이블이 아니며
--    개발용/서비스용 사용자 데이터를 저장하기 위한 일반 PostgreSQL 테이블입니다.
-- ============================================================


------------------------------------------------------------
-- TABLE: public.users
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,      -- Clerk 또는 외부 Auth ID와 연동
    name TEXT NOT NULL,                 -- 표시 이름
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 개발 단계에서는 모든 권한을 풀고 RLS OFF
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 개발 편의를 위해 anon/authenticated 모두 접근 허용
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

------------------------------------------------------------
-- 개발용: 테스트 유저 자동 생성 (필요 시 주석 해제)
------------------------------------------------------------
-- INSERT INTO public.users (clerk_id, name)
-- VALUES ('dev_test_user_001', '개발테스트유저')
-- ON CONFLICT (clerk_id) DO NOTHING;
