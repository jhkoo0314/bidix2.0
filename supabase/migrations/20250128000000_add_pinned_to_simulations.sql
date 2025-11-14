-- ============================================================
-- BIDIX AI – Add pinned field to simulations table
-- Last Updated: 2025-01-28
--
-- 히스토리 저장 기능을 위한 pinned 필드 추가
-- ============================================================

-- simulations 테이블에 pinned 필드 추가
ALTER TABLE public.simulations
ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false NOT NULL;

-- 인덱스 추가 (히스토리 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_simulations_user_id_pinned
ON public.simulations(user_id, pinned)
WHERE pinned = true;

-- 코멘트 추가
COMMENT ON COLUMN public.simulations.pinned IS '사용자가 히스토리에 저장한 시뮬레이션 여부';

