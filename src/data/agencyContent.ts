import { ServiceOffering, WorkItem } from '../types.js';

export const BLOG_CATEGORIES_MENU = [
  { name: 'AI Tools', slug: 'ai-tools' },
  { name: 'News', slug: 'news' },
  { name: 'Making Money Online', slug: 'making-money-online' },
  { name: 'Automation', slug: 'automation' },
  { name: 'Digital Marketing', slug: 'digital-marketing' },
  { name: 'SaaS Reviews', slug: 'saas-reviews' },
  { name: 'Case Studies', slug: 'case-studies' }
];

export const SERVICES_DATA: ServiceOffering[] = [
  {
    id: 'websites',
    number: '01',
    anchor: 'hotel-restaurant-websites',
    title: 'Hotel & Restaurant Websites',
    summary:
      'Mobile-friendly, clear websites designed around how guests actually decide where to stay or eat—highlighting rooms, services, menus, location details, and direct contact.',
    deliverables: [
      'Fast, mobile-first pages for rooms, suites, dining spaces, and guest services',
      'Readable, structured food and drink menus that work cleanly on phones without awkward PDFs',
      'Clear location, directions, parking, opening hours, and direct contact pathways',
      'Enquiry and booking-request flows connected cleanly to your confirmed booking engine or reservation provider'
    ],
    scopeNotes: [
      'Before promising online reservations or payments, we verify your existing PMS, table-booking tool, or third-party reservation widget and confirm how it should integrate.',
      'Built to support direct guest enquiries without relying solely on third-party aggregator listings.'
    ]
  },
  {
    id: 'management-systems',
    number: '02',
    anchor: 'custom-management-systems',
    title: 'Custom Management Websites & Apps',
    summary:
      'Focused internal dashboards and custom management tools shaped around your team’s real day-to-day workflows rather than forcing you into bloated generic software.',
    deliverables: [
      'Scoping examples include internal enquiry trackers, group-booking request queues, and staff workflow checklists',
      'Scoping examples include daily shift handover notes, prep/order logs, and basic stock or supplier tracking tools',
      'Role-appropriate internal web views accessible across desktop, tablet, and front-desk screens',
      'Clean distinction between submitted guest enquiries/requests and confirmed bookings or processed payments'
    ],
    scopeNotes: [
      'Every management tool is scoped and built per property workflow—we do not sell or claim unbuilt all-in-one POS or accounting software.',
      'Integrations with external POS, PMS, or payment processors are scoped only after confirming API availability and access.'
    ]
  },
  {
    id: 'local-seo-ai-visibility',
    number: '03',
    anchor: 'local-seo-ai-visibility',
    title: 'Local SEO & AI Search Visibility',
    summary:
      'An evidence-based audit and practical improvement service helping hotels and restaurants present accurate facts across local search and AI answer platforms.',
    deliverables: [
      'Website crawlability, structured metadata, and clear service, room, menu, and location information',
      'Google Business Profile completeness review—categories, attributes, descriptions, photos, and hours',
      'NAP (Name, Address, Phone) and opening-hours consistency checks across key local directories',
      'Practical guidance on earning authentic guest reviews, writing genuinely helpful FAQs, and building relevant local mentions',
      'AI search visibility audit documenting exact prompts tested, AI platform, date, test location, and repeated observations over time'
    ],
    scopeNotes: [
      'Includes practical implementation of Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO)—industry terms for structuring clear, verifiable facts so search engines and AI assistants can accurately reference your business.',
      'No inflated scores, ranking guarantees, or promises to control what ChatGPT or other AI systems recommend.'
    ]
  }
];

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Understand your business',
    description:
      'We review your hotel or restaurant, your current website and local profiles, how guests enquire or book today, and where staff workflows slow down.'
  },
  {
    number: '02',
    title: 'Agree on scope',
    description:
      'You receive a plain-English scope covering deliverables, required third-party integrations, timeline, and project pricing before build work begins.'
  },
  {
    number: '03',
    title: 'Build & improve',
    description:
      'We design, build, or optimize your website, internal management app, or local and AI search presence in focused milestones with transparent review.'
  },
  {
    number: '04',
    title: 'Test & hand over',
    description:
      'We test mobile layouts, enquiry flows, and team usability, then hand over access cleanly. Optional ongoing support can be arranged per project.'
  }
];

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'netventures-platform',
    title: 'NetVentures Web Platform & CMS',
    statusLabel: 'Internal Platform · Live',
    category: 'Web Application & Publishing System',
    summary:
      'Our own live web application and publishing engine—built with React, TypeScript, Supabase, pre-rendered static route HTML, structured Schema.org data, and automated sitemaps.',
    highlights: [
      'Custom dual-mode CMS editor supporting Markdown and block-based publishing',
      'Build-time static route pre-rendering, robots/sitemap automation, and clean canonical URLs',
      'Fast responsive layout with light/dark theme support and accessible navigation'
    ],
    linkLabel: 'Explore the live blog',
    linkHref: '/blog',
    isExternal: false
  },
  {
    id: 'hospitality-architecture-reference',
    title: 'Hospitality Direct-Booking & Local Discovery Architecture',
    statusLabel: 'Service Reference · In Progress',
    category: 'Hotel & Restaurant Website Framework',
    summary:
      'Our modular reference architecture for independent hotels and restaurants combining mobile menu/room presentation, direct enquiry routing, and structured local business data.',
    highlights: [
      'Clear separation between guest enquiry intake and confirmed third-party booking engine links',
      'Structured page patterns for rooms, dining menus, hours, parking, and frequently asked guest questions',
      'Crawlable semantic markup aligned with Google Business Profile and local search basics'
    ],
    linkLabel: 'View hospitality website service',
    linkHref: '/services#hotel-restaurant-websites',
    isExternal: false
  }
];
