import type { ReactNode } from "react";
import { getAvailability, UNAVAILABLE_MESSAGE, UNAVAILABLE_TITLE, type ServiceKey } from "@/lib/availability";

/**
 * Renders children only when every listed service is enabled. Otherwise it
 * renders the availability notice, so the form and its fields are never
 * shown for a service that cannot process submissions.
 */
export default async function ServiceGate({
  service,
  children,
}: {
  service: ServiceKey | ServiceKey[];
  children: ReactNode;
}) {
  const availability = await getAvailability();
  const services = Array.isArray(service) ? service : [service];
  const open = services.every((key) => availability[key]);
  if (open) return <>{children}</>;
  return <UnavailableNotice />;
}

export function UnavailableNotice({
  title = UNAVAILABLE_TITLE,
  message = UNAVAILABLE_MESSAGE,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div role="status" className="surface rounded-feature p-6 sm:p-8">
      <p className="text-base font-semibold text-fg">{title}</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{message}</p>
    </div>
  );
}
