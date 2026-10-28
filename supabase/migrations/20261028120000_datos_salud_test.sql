-- Las respuestas del test son datos de salud (art. 9 RGPD): la columna queda vacía para siempre.
alter table public.leads add constraint leads_sin_respuestas check (answers is null);
-- El resultado solo se guarda con consentimiento explícito y separado.
alter table public.leads add column if not exists health_consent boolean not null default false;
alter table public.leads add column if not exists health_consent_at timestamptz;
alter table public.leads add constraint leads_resultado_requiere_consentimiento
  check (quiz_type is null or health_consent);
