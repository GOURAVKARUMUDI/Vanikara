// Email configuration
export const EMAILS = {
  SUPPORT: 'support@vanikara.com',
  CONTACT: 'contact@vanikara.com',
  OFFICIAL: 'gouravkarumudi@vanikara.com',
} as const;

export type EmailType = keyof typeof EMAILS;

export function getEmailLink(type: EmailType): string {
  return `mailto:${EMAILS[type]}`;
}

export function getEmailDisplay(type: EmailType): string {
  return EMAILS[type];
}
