create table if not exists public.financial_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.financial_states enable row level security;

create policy "Users can read their own financial state"
on public.financial_states
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own financial state"
on public.financial_states
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own financial state"
on public.financial_states
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists financial_states_set_updated_at on public.financial_states;

create trigger financial_states_set_updated_at
before update on public.financial_states
for each row
execute function public.set_updated_at();

create table if not exists public.user_consents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  accepted_at timestamptz not null,
  terms_version text not null,
  privacy_version text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);

alter table public.user_consents enable row level security;

create policy "Users can read their own consent record"
on public.user_consents
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own consent record"
on public.user_consents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own consent record"
on public.user_consents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
