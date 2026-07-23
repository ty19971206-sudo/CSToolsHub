-- CSToolsHub phase 2: product_specs, quiz extensions, certifications, admin RPCs

alter table public.quiz_questions
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order int not null default 0;

create table if not exists public.quiz_certifications (
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.quiz_categories (id) on delete cascade,
  best_score int not null,
  best_total int not null,
  certified_at timestamptz not null default now(),
  primary key (user_id, category_id)
);

create table if not exists public.product_specs (
  code text primary key,
  name text not null,
  contract_unit numeric not null,
  contract_unit_raw text not null default '',
  contract_unit_hint text not null default '',
  quote_currency text,
  max_leverage numeric,
  updated_at timestamptz not null default now()
);

alter table public.quiz_certifications enable row level security;
alter table public.product_specs enable row level security;

-- quiz_attempts: editors/admins can read all attempts for dashboard
create policy "quiz_attempts_select_editor"
  on public.quiz_attempts for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('editor', 'admin')
    )
  );

-- quiz_certifications
create policy "quiz_certifications_select_own"
  on public.quiz_certifications for select
  using (auth.uid() = user_id);

create policy "quiz_certifications_insert_own"
  on public.quiz_certifications for insert
  with check (auth.uid() = user_id);

create policy "quiz_certifications_update_own"
  on public.quiz_certifications for update
  using (auth.uid() = user_id);

-- product_specs
create policy "product_specs_read_auth"
  on public.product_specs for select
  to authenticated
  using (true);

create policy "product_specs_write_editor"
  on public.product_specs for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('editor', 'admin')
    )
  );

-- Helper: editor/admin check
create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('editor', 'admin')
  );
$$;

revoke all on function public.is_editor_or_admin() from public;
grant execute on function public.is_editor_or_admin() to authenticated;

-- Category stats for admin dashboard
create or replace function public.get_quiz_category_stats_admin()
returns table (
  category_id uuid,
  slug text,
  name_zh text,
  name_en text,
  attempt_count bigint,
  avg_score numeric,
  pass_rate numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id as category_id,
    c.slug,
    c.name_zh,
    c.name_en,
    count(a.id) as attempt_count,
    coalesce(avg(a.score::numeric / nullif(a.total, 0)), 0) as avg_score,
    coalesce(
      avg(case when a.total > 0 and (a.score::numeric / a.total) >= 0.8 then 1 else 0 end),
      0
    ) as pass_rate
  from public.quiz_categories c
  left join public.quiz_attempts a on a.category_id = c.id
  where public.is_editor_or_admin()
  group by c.id, c.slug, c.name_zh, c.name_en
  order by c.sort_order;
$$;

revoke all on function public.get_quiz_category_stats_admin() from public;
grant execute on function public.get_quiz_category_stats_admin() to authenticated;

-- Weak questions by category
create or replace function public.get_quiz_weak_questions(p_category_id uuid, p_limit int default 10)
returns table (question_id uuid, wrong_count bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_editor_or_admin() then
    return;
  end if;

  return query
  with answers as (
    select
      (elem->>'questionId')::uuid as qid,
      (elem->>'selected')::int as selected,
      (elem->>'correct')::int as correct
    from public.quiz_attempts a,
      jsonb_array_elements(a.answers_json) as elem
    where a.category_id = p_category_id
      and elem ? 'questionId'
      and (elem->>'questionId') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  )
  select qid as question_id, count(*)::bigint as wrong_count
  from answers
  where selected is distinct from correct
  group by qid
  order by wrong_count desc
  limit greatest(p_limit, 1);
end;
$$;

revoke all on function public.get_quiz_weak_questions(uuid, int) from public;
grant execute on function public.get_quiz_weak_questions(uuid, int) to authenticated;

-- Recent audit logs for admin
create or replace function public.get_recent_audit_logs(p_limit int default 50)
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  action text,
  meta jsonb,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    l.id,
    l.user_id,
    p.email as user_email,
    l.action,
    l.meta,
    l.created_at
  from public.audit_logs l
  left join public.profiles p on p.id = l.user_id
  where public.is_editor_or_admin()
  order by l.created_at desc
  limit greatest(p_limit, 1);
$$;

revoke all on function public.get_recent_audit_logs(int) from public;
grant execute on function public.get_recent_audit_logs(int) to authenticated;
