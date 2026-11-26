import { supabaseService } from "@/utils/supabase/service";

/**
 * Public service availability. Every public submission service is OFF by
 * default and is only enabled by an authorised administrator in the Vanikara
 * Console, once its SMTP and submission workflow has been verified.
 *
 * Fail closed: if the setting cannot be read, every service is treated as
 * disabled. Pages and API routes both call this, so the UI and the server
 * always agree.
 */
export const SERVICES = [
  "contact",
  "business_enquiries",
  "enterprise_enquiries",
  "restaurant_partnerships",
  "demo_requests",
  "career_applications",
  "newsletter",
  "telephone_support",
  "public_office_map",
  "recruitment",
] as const;

export type ServiceKey = (typeof SERVICES)[number];

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  contact: "General contact submissions",
  business_enquiries: "Business enquiries",
  enterprise_enquiries: "Enterprise enquiries",
  restaurant_partnerships: "Restaurant partnerships",
  demo_requests: "Demo requests (CYGMA-RI)",
  career_applications: "Career applications",
  newsletter: "Newsletter subscriptions",
  telephone_support: "Telephone support",
  public_office_map: "Public office map",
  recruitment: "Recruitment availability",
};

export type Availability = Record<ServiceKey, boolean>;

export const ALL_DISABLED: Availability = Object.fromEntries(
  SERVICES.map((service) => [service, false]),
) as Availability;

export async function getAvailability(): Promise<Availability> {
  try {
    const { data, error } = await supabaseService
      .from("service_availability")
      .select("service, enabled");
    if (error || !data) return { ...ALL_DISABLED };

    const result = { ...ALL_DISABLED };
    for (const row of data) {
      if ((SERVICES as readonly string[]).includes(row.service)) {
        result[row.service as ServiceKey] = row.enabled === true;
      }
    }
    return result;
  } catch {
    return { ...ALL_DISABLED };
  }
}

export async function isServiceEnabled(service: ServiceKey): Promise<boolean> {
  const availability = await getAvailability();
  return availability[service] === true;
}

export const UNAVAILABLE_TITLE = "Online submissions are temporarily unavailable.";
export const UNAVAILABLE_MESSAGE =
  "We are currently configuring our communication systems. Online submissions will become available once the service is operational.";
