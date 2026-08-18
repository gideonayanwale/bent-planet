-- Add custom_alias column to conferences for custom back-half short URLs (e.g. bentplanet.com/AWOMANWITHLIVINGTESTIMONY)
alter table public.conferences
add column if not exists custom_alias text unique;

create index if not exists conferences_custom_alias_idx on public.conferences (lower(custom_alias));
