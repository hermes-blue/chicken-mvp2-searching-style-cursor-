-- Supabase SQL Editor에서 실행
-- public.feedback: 설문 응답 저장

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  rating text not null
    check (rating in (
      '나름 도움됐어요',
      '그냥 그랬어요',
      '좀 아쉬웠어요'
    )),
  reasons text[] not null default '{}',
  freetext text,
  created_at timestamptz not null default now()
);

comment on table public.feedback is '앱 피드백 설문';
comment on column public.feedback.rating is '쓸만하셨나요? 단일 선택 (한국어 문구)';
comment on column public.feedback.reasons is '아쉬운 점 멀티선택 (내부 value 문자열: reason_...)';
comment on column public.feedback.freetext is '자유 입력 (빈 문자열이면 null로 저장 가능)';

-- 인덱스(선택): 최신순 조회
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

-- anon(브라우저 VITE_ anon key)이 insert만 허용. 읽기/수정/삭제는 막힘(기본).
-- 대시보드에서 테이블 보기는 Supabase 대시보드(서비스 권한)로 확인.
create policy "anon can insert feedback"
  on public.feedback
  for insert
  to anon
  with check (true);
