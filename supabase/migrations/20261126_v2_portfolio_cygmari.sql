-- =============================================================================
-- VANIKARA V2 — PORTFOLIO EXPANSION & CYGMA-RI B2B ENQUIRY MIGRATION
-- Safe, additive, backward-compatible migration preserving all existing records.
-- =============================================================================

-- 1. Expand product_registrations to support Consumer Ecosystem partnerships & CYGMA-RI B2B enquiries
alter table public.product_registrations
  drop constraint if exists product_registrations_category_check;

alter table public.product_registrations
  add constraint product_registrations_category_check
  check (
    category in (
      'restaurant',
      'delivery_partner',
      'customer',
      'business_partner',
      'travel_partner',
      'hotel_partner',
      'quick_commerce_partner',
      'cygma_ri_enterprise'
    )
  );

alter table public.product_registrations add column if not exists designation text check (char_length(designation) <= 120);
alter table public.product_registrations add column if not exists company_size text check (char_length(company_size) <= 60);
alter table public.product_registrations add column if not exists monthly_resume_volume text check (char_length(monthly_resume_volume) <= 60);
alter table public.product_registrations add column if not exists enquiry_type text check (char_length(enquiry_type) <= 80);

create index if not exists product_registrations_enquiry_type_idx on public.product_registrations (enquiry_type);

notify pgrst, 'reload schema';
