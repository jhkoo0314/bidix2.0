-- ============================================================
-- BIDIX AI – Add free_report_used_at field to simulations table
-- Last Updated: 2025-01-28
--
-- 무료 리포트 사용 추적을 위한 필드 추가
-- 일 1회 무료 리포트 제공 (Freemium 전략)
-- ============================================================

-- simulations 테이블에 free_report_used_at 필드 추가
ALTER TABLE public.simulations
ADD COLUMN IF NOT EXISTS free_report_used_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 인덱스 추가 (일일 리포트 사용 여부 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_simulations_user_id_free_report_date
ON public.simulations(user_id, free_report_used_at)
WHERE free_report_used_at IS NOT NULL;

-- 코멘트 추가
COMMENT ON COLUMN public.simulations.free_report_used_at IS '무료 리포트 사용 일시 (일 1회 제한, Freemium 전략)';

