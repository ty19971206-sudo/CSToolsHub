-- Fix profiles RLS infinite recursion (REST select returned 500).
-- profiles_select_admin queried profiles inside a profiles policy.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin());

create or replace function public.profiles_prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role then
    if not public.is_admin() then
      new.role := old.role;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
