import type { ContentKey } from "./defaults";
import type { FieldRules } from "./validate";

/**
 * How each content group appears in the admin editor, and the extra rules
 * applied when it is saved.
 */
export interface ContentGroup extends FieldRules {
  key: ContentKey;
  title: string;
  description: string;
  /** Pages where this content appears (links in the editor). */
  pages: string[];
  /** Fields kept but not shown (internal ids). */
  hidden?: string[];
}

const TONES = { tone: ["warm", "cool"] };

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    key: "identity",
    title: "Company details",
    description: "Legal name, statements, dates, CIN, address and contact emails — used across the whole site and the legal pages.",
    pages: ["/", "/contact", "/legal/legal-information"],
  },
  {
    key: "home",
    title: "Home page sections",
    description: "Headings, labels and button text for each section of the home page. Use a new line to break a heading.",
    pages: ["/"],
  },
  {
    key: "story",
    title: "Company story",
    description: "The story shown on the home page and the About page.",
    pages: ["/", "/about"],
  },
  {
    key: "principles",
    title: "Principles",
    description: "The “How we work” principles.",
    pages: ["/", "/about"],
  },
  {
    key: "people",
    title: "People",
    description: "Leadership cards on the home, About and Leadership pages. Initials stand in for photos.",
    pages: ["/", "/leadership"],
    hidden: ["id"],
  },
  {
    key: "timeline",
    title: "Timeline",
    description: "Milestones on the home and About pages. Turn on “Is target” for a planned date.",
    pages: ["/", "/about"],
  },
  {
    key: "initiatives",
    title: "Products & initiatives",
    description: "Food Services and CYGMA_AI copy used across overview and product pages.",
    pages: ["/", "/what-we-build", "/food-delivery", "/cygma-ai"],
    hidden: ["id"],
  },
  {
    key: "portfolio",
    title: "Business & product portfolio",
    description: "Hierarchical portfolio registry, development statuses, and visibility controls (public, internal, draft, archived). Changes apply immediately without code edits.",
    pages: ["/", "/businesses", "/food-delivery", "/businesses/travel", "/businesses/hotels", "/businesses/quick-commerce", "/cygma-ai", "/cygma-ai/resume-intelligence"],
    hidden: ["id", "parentId"],
    enums: {
      visibility: ["public", "internal", "draft", "archived"],
      ecosystem: ["consumer", "cygma_ai", "technology"],
    },
  },
  {
    key: "legal",
    title: "Legal facts",
    description: "Effective date, Grievance Officer and payment terms used by every policy page. Have changes reviewed before publishing.",
    pages: ["/legal", "/legal/terms", "/legal/refund", "/legal/privacy"],
  },
  {
    key: "navigation",
    title: "Navigation menus",
    description: "Labels and descriptions in the menus and footer. Link targets are fixed.",
    pages: ["/"],
    readonly: ["href"],
    enums: TONES,
  },
];

export const GROUP_BY_KEY = Object.fromEntries(CONTENT_GROUPS.map((g) => [g.key, g])) as Record<ContentKey, ContentGroup>;
