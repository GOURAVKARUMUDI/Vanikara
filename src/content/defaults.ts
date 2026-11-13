import {
  COMPANY_IDENTITY,
  COMPANY_STORY,
  COMPANY_TIMELINE,
  FOUNDERS_AND_LEADERSHIP,
  INITIATIVES,
  NAVIGATION,
  PHILOSOPHY_PRINCIPLES,
} from "@/data/company";
import { GRIEVANCE_OFFICER, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION, PAYMENT_TERMS, SERVICE_PACKAGES } from "@/data/legal";

/**
 * Default website content. The admin "Website content" editor saves
 * overrides to the database; anything not overridden falls back to these
 * values. The files in src/data stay the source of the defaults.
 */

/** Text of the home page sections (headings, labels, buttons). */
export const HOME_COPY = {
  hero: {
    headlineStart: "Building what",
    headlineMiddle: "comes",
    headlineHighlight: "next",
    primaryButton: "Explore VANIKARA",
    secondaryButton: "Our Products",
  },
  story: {
    eyebrow: "The company",
    statement: "We build what\nwe believe\nshould exist.",
    linkLabel: "More about VANIKARA",
  },
  products: {
    eyebrow: "Products",
    title: "Two initiatives.\nOne direction.",
    lead: "A product with a launch date, and a long-term initiative that will grow alongside it.",
    designingForLabel: "What we are designing for",
    buttonLabel: "Explore the platform",
  },
  cygma: {
    directionsLabel: "Intended to develop intelligence around",
    linkLabel: "The CYGMA initiative",
  },
  principles: {
    eyebrow: "How we work",
    title: "Principles, not slogans.",
  },
  timeline: {
    eyebrow: "Timeline",
    title: "Early, and on the record.",
  },
  people: {
    eyebrow: "People",
    title: "The people building VANIKARA.",
    linkLabel: "Leadership",
  },
  closing: {
    title: "This is the beginning.",
    body: "VANIKARA is still early. The products are being built and the ambition is long-term. We would rather build carefully than appear finished too soon.",
    buttonLabel: "Contact VANIKARA",
  },
};

export const CONTENT_DEFAULTS = {
  identity: COMPANY_IDENTITY,
  home: HOME_COPY,
  story: COMPANY_STORY,
  principles: PHILOSOPHY_PRINCIPLES,
  people: FOUNDERS_AND_LEADERSHIP,
  timeline: COMPANY_TIMELINE,
  initiatives: INITIATIVES,
  packages: SERVICE_PACKAGES,
  legal: {
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    version: LEGAL_VERSION,
    grievanceOfficer: GRIEVANCE_OFFICER,
    paymentTerms: PAYMENT_TERMS,
  },
  navigation: NAVIGATION,
};

export type SiteContent = typeof CONTENT_DEFAULTS;
export type ContentKey = keyof SiteContent;
export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
