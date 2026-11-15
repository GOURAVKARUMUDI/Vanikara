import { COMPANY_IDENTITY } from "./company";

/**
 * Single source of truth for facts that appear in the legal documents.
 * Every policy page reads from here, so a change (a new grievance
 * officer, a revised refund window) is made once and stays consistent.
 *
 * Review with a qualified legal professional before publishing changes.
 */

export const LEGAL_EFFECTIVE_DATE = "30 September 2026";
export const LEGAL_VERSION = "2.0";

/**
 * Grievance Officer — required by the IT (Reasonable Security Practices)
 * Rules 2011 (Rule 5(9)), the Consumer Protection (E-Commerce) Rules 2020
 * (Rule 4(4)) and the Digital Personal Data Protection Act 2023 (s. 8(10)).
 */
export const GRIEVANCE_OFFICER = {
  name: "Gourav Karumudi",
  designation: "CEO & Founder",
  email: COMPANY_IDENTITY.supportEmail,
  hours: "Monday to Saturday, 10:00–18:00 IST (excluding public holidays)",
  /** Consumer Protection (E-Commerce) Rules 2020, Rule 4(5) */
  acknowledgeWithin: "48 hours",
  resolveWithin: "30 days",
};

/** Payment and refund terms used by Terms, Refund and Pricing pages. */
export const PAYMENT_TERMS = {
  gateway: "Razorpay",
  gatewayLegalName: "Razorpay Software Private Limited",
  currency: "Indian Rupees (INR)",
  methods: "UPI, debit and credit cards, net banking and wallets supported by Razorpay",
  /** Time for VANIKARA to review a refund request */
  refundDecisionWithin: "7 business days",
  /** Time for the money to reach the customer once a refund is issued */
  refundCreditWithin: "5–7 business days",
  failedPaymentRefundWithin: "5–7 business days",
};

export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

/** Every legal document, in the order they appear on the Legal page and in the footer. */
export const LEGAL_DOCUMENTS = [
  { href: "/legal/terms", title: "Terms & Conditions", desc: "The agreement for using the website and buying our services." },
  { href: "/legal/privacy", title: "Privacy Policy", desc: "What personal data we collect, why, and your rights under Indian law." },
  { href: "/legal/refund", title: "Refund & Cancellation Policy", desc: "How cancellations work and when and how refunds are paid." },
  { href: "/legal/shipping", title: "Shipping & Delivery Policy", desc: "How our digital services are delivered — nothing is physically shipped." },
  { href: "/legal/cookies", title: "Cookie Policy", desc: "The cookies and browser storage the site uses, and your choices." },
  { href: "/legal/security", title: "Security & Responsible Disclosure", desc: "How we protect data and how to report a vulnerability." },
  { href: "/legal/legal-information", title: "Company Information", desc: "Registered name, CIN, registered office and grievance officer." },
];
