-- Compras: una fila por usuaria que ha pagado el programa completo
create table public.purchases (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_session_id text unique not null,
  email text,
  amount_total integer,
  currency text,
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Cada usuaria ve solo su compra"
  on public.purchases for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ¿La usuaria actual ha pagado? (lee su propia fila gracias a la política anterior)
create or replace function public.has_access()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.purchases where user_id = (select auth.uid())
  );
$$;

revoke all on function public.has_access() from public;
revoke execute on function public.has_access() from anon;
grant execute on function public.has_access() to authenticated;

-- Contactos del test de hambre emocional (solo los escribe la función subscribe-lead)
create table public.leads (
  id bigint generated always as identity primary key,
  email text not null unique,
  quiz_type text,
  answers jsonb,
  consent boolean not null default false,
  consent_at timestamptz,
  synced_to_mailer boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Audios de pago: almacenamiento privado
insert into storage.buckets (id, name, public)
values ('premium', 'premium', false)
on conflict (id) do nothing;

create policy "Solo quien ha pagado escucha los audios de pago"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'premium' and (select public.has_access()));
