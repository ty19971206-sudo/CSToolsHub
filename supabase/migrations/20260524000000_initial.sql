-- CSToolsHub initial schema

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  lang text not null default 'zh' check (lang in ('zh', 'en')),
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_zh text not null,
  name_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.quiz_categories (id) on delete cascade,
  zh_json jsonb not null,
  en_json jsonb not null,
  correct_index int not null check (correct_index >= 0 and correct_index <= 3),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.quiz_categories (id) on delete cascade,
  score int not null,
  total int not null,
  answers_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mail_templates (
  id uuid primary key default gen_random_uuid(),
  scene_id text not null,
  subject_zh text,
  body_zh text,
  subject_en text,
  body_en text,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  unique (scene_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.quiz_categories enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.mail_templates enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "quiz_categories_read_auth"
  on public.quiz_categories for select
  to authenticated
  using (true);

create policy "quiz_questions_read_auth"
  on public.quiz_questions for select
  to authenticated
  using (true);

create policy "quiz_categories_write_editor"
  on public.quiz_categories for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('editor', 'admin')
    )
  );

create policy "quiz_questions_write_editor"
  on public.quiz_questions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('editor', 'admin')
    )
  );

create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "mail_templates_read_auth"
  on public.mail_templates for select
  to authenticated
  using (true);

create policy "mail_templates_write_editor"
  on public.mail_templates for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('editor', 'admin')
    )
  );

create policy "audit_logs_insert_auth"
  on public.audit_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
