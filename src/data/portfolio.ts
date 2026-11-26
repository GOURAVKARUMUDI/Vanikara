/**
 * Hierarchical business & product portfolio for VANIKARA INTELLIGENCE PRIVATE LIMITED.
 * Editable live via Vanikara Console (CMS key: "portfolio").
 *
 * Visibility rules:
 *   - "public"   -> visible on corporate website & public portfolio API
 *   - "internal" -> restricted to authorized Vanikara Console admins only
 *   - "draft"    -> restricted to authorized Vanikara Console admins only
 *   - "archived" -> hidden from public website & APIs
 */

export type PortfolioVisibility = "public" | "internal" | "draft" | "archived";
export type PortfolioEcosystem = "consumer" | "cygma_ai" | "technology";

export interface PortfolioItem {
  id: string;
  parentId: string;
  name: string;
  attribution: string;
  slug: string;
  href: string;
  ecosystem: PortfolioEcosystem;
  category: string;
  developmentStatus: string;
  visibility: PortfolioVisibility;
  featured: boolean;
  displayOrder: number;
  shortDescription: string;
  enquiryCategory: string;
}

export const PORTFOLIO_DEFAULTS: PortfolioItem[] = [
  {
    id: "unified-consumer-ecosystem",
    parentId: "",
    name: "Unified Consumer Services Ecosystem",
    attribution: "VANIKARA INTELLIGENCE PRIVATE LIMITED",
    slug: "businesses",
    href: "/businesses",
    ecosystem: "consumer",
    category: "Consumer Ecosystem",
    developmentStatus: "Planned long-term ecosystem",
    visibility: "public",
    featured: true,
    displayOrder: 1,
    shortDescription:
      "A unified consumer application designed to progressively integrate Food Services, Travel Booking, Hotel Booking, and Quick Commerce.",
    enquiryCategory: "Business Partnership",
  },
  {
    id: "food-services",
    parentId: "unified-consumer-ecosystem",
    name: "Food Services",
    attribution: "Unified Consumer Services Ecosystem",
    slug: "food-delivery",
    href: "/food-delivery",
    ecosystem: "consumer",
    category: "Consumer Business",
    developmentStatus: "Primary consumer initiative",
    visibility: "public",
    featured: true,
    displayOrder: 2,
    shortDescription:
      "Restaurant-first food services ecosystem encompassing Food Delivery, Dine-in, Takeaway, and proposed AI-Assisted Telephone Ordering.",
    enquiryCategory: "Restaurant Registration",
  },
  {
    id: "food-delivery",
    parentId: "food-services",
    name: "Food Delivery",
    attribution: "Food Services",
    slug: "food-delivery",
    href: "/food-delivery#delivery",
    ecosystem: "consumer",
    category: "Sub-Initiative",
    developmentStatus: "In Development",
    visibility: "public",
    featured: true,
    displayOrder: 3,
    shortDescription:
      "Restaurant discovery, transparent commercial terms, order tracking, and delivery fulfilment targeting initial Tier-2 launch in Guntur.",
    enquiryCategory: "Restaurant Registration",
  },
  {
    id: "dine-in",
    parentId: "food-services",
    name: "Dine-in",
    attribution: "Food Services",
    slug: "dine-in",
    href: "/food-delivery#dine-in",
    ecosystem: "consumer",
    category: "Sub-Initiative",
    developmentStatus: "Planned",
    visibility: "public",
    featured: false,
    displayOrder: 4,
    shortDescription:
      "Restaurant discovery, digital menu access, and planned in-venue dining enhancements.",
    enquiryCategory: "Restaurant Registration",
  },
  {
    id: "takeaway",
    parentId: "food-services",
    name: "Takeaway",
    attribution: "Food Services",
    slug: "takeaway",
    href: "/food-delivery#takeaway",
    ecosystem: "consumer",
    category: "Sub-Initiative",
    developmentStatus: "Planned",
    visibility: "public",
    featured: false,
    displayOrder: 5,
    shortDescription:
      "Advance food ordering, scheduled preparation, and coordinated pickup with order readiness notifications.",
    enquiryCategory: "Restaurant Registration",
  },
  {
    id: "ai-telephone-ordering",
    parentId: "food-services",
    name: "AI-Assisted Telephone Ordering",
    attribution: "Food Services",
    slug: "ai-telephone-ordering",
    href: "/food-delivery#telephone-ordering",
    ecosystem: "consumer",
    category: "Proposed Innovation",
    developmentStatus: "Proposed",
    visibility: "public",
    featured: false,
    displayOrder: 6,
    shortDescription:
      "App-free telephone-based food ordering assisted by voice AI, with menu lookup, confirmation, payment link or eligible COD, and human fallback.",
    enquiryCategory: "Product Enquiry",
  },
  {
    id: "travel-booking",
    parentId: "unified-consumer-ecosystem",
    name: "Travel Booking",
    attribution: "Unified Consumer Services Ecosystem",
    slug: "travel",
    href: "/businesses/travel",
    ecosystem: "consumer",
    category: "Consumer Business",
    developmentStatus: "DPR / Planning Stage",
    visibility: "public",
    featured: false,
    displayOrder: 7,
    shortDescription:
      "Connected travel services under Detailed Project Report (DPR) feasibility assessment for future integration into the consumer ecosystem.",
    enquiryCategory: "Business Partnership",
  },
  {
    id: "hotel-booking",
    parentId: "unified-consumer-ecosystem",
    name: "Hotel Booking",
    attribution: "Unified Consumer Services Ecosystem",
    slug: "hotels",
    href: "/businesses/hotels",
    ecosystem: "consumer",
    category: "Consumer Business",
    developmentStatus: "DPR / Planning Stage",
    visibility: "public",
    featured: false,
    displayOrder: 8,
    shortDescription:
      "Connected accommodation discovery and reservation workflows under DPR planning to complement future travel services.",
    enquiryCategory: "Business Partnership",
  },
  {
    id: "quick-commerce",
    parentId: "unified-consumer-ecosystem",
    name: "Quick Commerce",
    attribution: "Unified Consumer Services Ecosystem",
    slug: "quick-commerce",
    href: "/businesses/quick-commerce",
    ecosystem: "consumer",
    category: "Consumer Business",
    developmentStatus: "Future Exploration",
    visibility: "public",
    featured: false,
    displayOrder: 9,
    shortDescription:
      "Long-term exploration into convenient local access to everyday essentials with sustainable merchant unit economics.",
    enquiryCategory: "Business Partnership",
  },
  {
    id: "cygma-ai",
    parentId: "",
    name: "CYGMA_AI",
    attribution: "Powered by Vanikara Intelligence",
    slug: "cygma-ai",
    href: "/cygma-ai",
    ecosystem: "cygma_ai",
    category: "Intelligence Ecosystem",
    developmentStatus: "In Development",
    visibility: "public",
    featured: true,
    displayOrder: 10,
    shortDescription:
      "Proprietary artificial intelligence ecosystem powered by Vanikara Intelligence supporting specialized B2B products and internal operational intelligence.",
    enquiryCategory: "Product Enquiry",
  },
  {
    id: "cygma-ri",
    parentId: "cygma-ai",
    name: "CYGMA-RI (Resume Intelligence)",
    attribution: "Powered by CYGMA_AI — Vanikara Intelligence",
    slug: "resume-intelligence",
    href: "/cygma-ai/resume-intelligence",
    ecosystem: "cygma_ai",
    category: "B2B Enterprise Product",
    developmentStatus: "In Development",
    visibility: "public",
    featured: true,
    displayOrder: 11,
    shortDescription:
      "AI-powered B2B resume analysis and pre-verification platform helping recruiters evaluate candidate claims and review supporting evidence while keeping hiring decisions in human hands.",
    enquiryCategory: "CYGMA-RI Enterprise",
  },
  {
    id: "internal-operational-intelligence",
    parentId: "cygma-ai",
    name: "Internal Operational Intelligence",
    attribution: "CYGMA_AI — Powered by Vanikara Intelligence",
    slug: "internal-intelligence",
    href: "/cygma-ai#internal-intelligence",
    ecosystem: "cygma_ai",
    category: "Internal Systems",
    developmentStatus: "Research and Development",
    visibility: "public",
    featured: false,
    displayOrder: 12,
    shortDescription:
      "Company-specific operational intelligence and decision-support research built for Vanikara's internal platforms and workflows.",
    enquiryCategory: "Product Enquiry",
  },
];

/**
 * Strictly filters portfolio items for public consumption.
 * Internal-only, draft, and archived items are never returned publicly.
 */
export function filterPublicPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return items
    .filter((item) => item.visibility === "public")
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPortfolioItemById(items: PortfolioItem[], id: string): PortfolioItem | undefined {
  return items.find((item) => item.id === id && item.visibility === "public");
}
