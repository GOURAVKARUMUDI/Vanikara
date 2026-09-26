/**
 * Single source of truth for company facts and public copy.
 * Keep statements factual: describe intent and direction, never
 * capabilities or metrics that do not exist yet.
 */

export interface Founder {
  id: string;
  /** Legal name as registered. */
  fullName: string;
  /** Name used on the website. */
  publicName: string;
  designation: string;
  roleShort: string;
  isFounder: boolean;
  isDirector: boolean;
  responsibilities: string[];
  linkedin?: string;
  bio: string;
  initials: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
  isTarget?: boolean;
}

export const COMPANY_IDENTITY = {
  legalName: "VANIKARA INTELLIGENCE PRIVATE LIMITED",
  brandName: "VANIKARA",
  tagline: "Building what comes next.",
  supportingStatement:
    "VANIKARA is a student-founded technology company building products around real-world problems while developing a long-term vision for intelligent systems.",
  shortStatement: "A student-founded technology company building products around real-world problems.",
  mission: "We build what we believe should exist.",
  foundingDate: "01 April 2026",
  incorporationDate: "17 April 2026",
  cin: "U47912AP2026PTC125340",
  registeredOffice:
    "D-No-4-6-26/4, Near Maruthi Multi Speciality Hospital, Koritepadu, Guntur – 522007, Andhra Pradesh, India",
  registeredOfficeLines: [
    "D-No-4-6-26/4,",
    "Near Maruthi Multi Speciality Hospital,",
    "Koritepadu, Guntur – 522007,",
    "Andhra Pradesh, India",
  ],
  operationalLocation: "Guntur, Andhra Pradesh, India",
  country: "India",
  state: "Andhra Pradesh",
  officialEmail: "contact@vanikara.com",
  supportEmail: "support@vanikara.com",
  siteUrl: "https://www.vanikara.com",
};

export const COMPANY_STORY = {
  heading: "It began as a conversation.",
  paragraphs: [
    "VANIKARA began from an informal discussion between students about real-world problems — and whether it was possible to build something meaningful at an early stage of life.",
    "The company is an attempt to create rather than simply follow conventional paths.",
  ],
};

export const PHILOSOPHY_PRINCIPLES = [
  {
    title: "Start early",
    desc: "Meaningful companies can begin before conventional experience arrives.",
  },
  {
    title: "Think independently",
    desc: "Question the existing model before building an alternative to it.",
  },
  {
    title: "Build deliberately",
    desc: "Technology should solve a real problem before it becomes a feature.",
  },
];

export const FOUNDERS_AND_LEADERSHIP: Founder[] = [
  {
    id: "karumudi-gourav",
    fullName: "KARUMUDI GOURAV",
    publicName: "Gourav Karumudi",
    designation: "COO & Founder",
    roleShort: "COO",
    isFounder: true,
    isDirector: true,
    responsibilities: ["Operations", "Finance"],
    linkedin: "https://www.linkedin.com/in/gourav-karumudi-a998b1379/",
    bio: "Leads operations and finance — company execution, internal processes and financial planning.",
    initials: "GK",
  },
  {
    id: "chejarla-hari-charan-reddy",
    fullName: "CHEJARLA HARI CHARAN REDDY",
    publicName: "Hari Charan",
    designation: "CTO & Founder",
    roleShort: "CTO",
    isFounder: true,
    isDirector: true,
    responsibilities: ["Technology", "Product engineering"],
    linkedin: "https://www.linkedin.com/in/haricharan28/",
    bio: "Leads technology — product engineering and the technical direction of VANIKARA's products.",
    initials: "HC",
  },
  {
    id: "miryala-giri-charan",
    fullName: "MIRYALA GIRI CHARAN",
    publicName: "Giri Charan",
    designation: "CEO & Founder",
    roleShort: "CEO",
    isFounder: true,
    isDirector: true,
    responsibilities: ["Strategy", "Growth", "Marketing"],
    bio: "Leads the company's overall direction — strategy, growth and marketing.",
    initials: "GC",
  },
  {
    id: "yarreddu-sri-chandrasekhar-reddy",
    fullName: "YARREDDU SRI CHANDRASEKHAR REDDY",
    publicName: "Yarreddu Sri Chandrasekhar Reddy",
    designation: "CHRO",
    roleShort: "CHRO",
    isFounder: false,
    isDirector: false,
    responsibilities: ["People", "Culture"],
    linkedin: "https://www.linkedin.com/in/sri-chandra-shekar-reddy-yarreddu-9b4368437/",
    bio: "Leads people and culture — building the team VANIKARA will grow with.",
    initials: "SR",
  },
];

export const COMPANY_TIMELINE: TimelineMilestone[] = [
  {
    date: "01 April 2026",
    title: "VANIKARA is founded",
    description: "A conversation between students becomes a decision to start building.",
  },
  {
    date: "17 April 2026",
    title: "Incorporated",
    description: "Registered as VANIKARA Intelligence Private Limited under the Companies Act, 2013.",
  },
  {
    date: "July 2026",
    title: "Product development begins",
    description: "Work starts on the food delivery platform.",
  },
  {
    date: "November 2026",
    title: "Target launch in Guntur",
    description: "Planned initial launch of the food delivery platform in Guntur, Andhra Pradesh.",
    isTarget: true,
  },
];

export const INITIATIVES = {
  foodDelivery: {
    id: "food-delivery",
    index: "01",
    title: "Food Delivery Platform",
    nameNote: "Final product name to be announced.",
    status: "In development",
    targetLaunch: "November 2026",
    initialMarket: "Guntur, Andhra Pradesh",
    heroHeading: "Food delivery, reconsidered from the restaurant's side.",
    summary:
      "VANIKARA is exploring a restaurant-first approach to food delivery economics — transparent pricing, a better merchant experience, and an alternative to traditional percentage-per-order models.",
    problemHeading: "The order is not the whole story.",
    problemParagraphs: [
      "Delivery platforms have made ordering convenient. Behind each order, though, restaurants carry commissions, promotional costs and operational complexity on margins that are often thin.",
      "We want to understand whether a platform can be designed around the restaurant's economics from the start — and what that would change for customers and delivery partners too.",
    ],
    approachHeading: "What we are designing for.",
    principles: [
      {
        title: "Transparent pricing",
        desc: "Commercial terms a restaurant can understand before it commits.",
      },
      {
        title: "Beyond percentage-per-order",
        desc: "Exploring models where growth doesn't depend on ever-rising order-level costs.",
      },
      {
        title: "Merchant-focused tools",
        desc: "Operational visibility for restaurants — not just an order inbox.",
      },
      {
        title: "A better merchant experience",
        desc: "Onboarding, menus and settlements designed to be practical and predictable.",
      },
    ],
    surfaces: [
      {
        id: "customers",
        name: "Customers",
        description: "Discover restaurants, order, pay and follow a delivery.",
      },
      {
        id: "restaurants",
        name: "Restaurants",
        description: "Manage menus, orders, availability and the business behind them.",
      },
      {
        id: "partners",
        name: "Delivery partners",
        description: "Accept deliveries, manage availability and see earnings clearly.",
      },
      {
        id: "operations",
        name: "Operations",
        description: "Oversee orders, restaurants, partners, support and settlements.",
      },
    ],
  },
  cygma: {
    id: "cygma",
    index: "02",
    title: "CYGMA AI",
    status: "Long-term initiative",
    tagline: "VANIKARA's proprietary long-term intelligence initiative.",
    summary:
      "CYGMA is intended to develop company-specific intelligence around VANIKARA's products, knowledge, systems and operations — growing alongside the company over time.",
    clarifications: [
      "Not a public chatbot.",
      "Not a consumer AI product.",
      "Not positioned as a competitor to general-purpose AI models.",
    ],
    directions: [
      {
        title: "Products",
        desc: "Intelligence that could, over time, support the products VANIKARA builds.",
      },
      {
        title: "Knowledge",
        desc: "An organised understanding of what the company learns as it builds.",
      },
      {
        title: "Systems",
        desc: "Awareness of how VANIKARA's own software and platforms behave.",
      },
      {
        title: "Operations",
        desc: "Support for the internal work of running the company.",
      },
      {
        title: "Future capabilities",
        desc: "A foundation for internal capabilities the company does not have yet.",
      },
    ],
    note: "CYGMA is at an early, exploratory stage. We describe direction here, not finished capability.",
  },
};

export const NAVIGATION = {
  company: [
    { href: "/leadership", label: "Leadership", desc: "The founders and team" },
    { href: "/careers", label: "Careers", desc: "Working with VANIKARA" },
    { href: "/legal", label: "Legal", desc: "Policies and company information" },
  ],
  products: [
    {
      href: "/food-delivery",
      label: "Food Delivery Platform",
      desc: "In development · Guntur · Nov 2026",
      tone: "warm" as const,
    },
    {
      href: "/cygma",
      label: "CYGMA AI",
      desc: "Long-term intelligence initiative",
      tone: "cool" as const,
    },
  ],
};
