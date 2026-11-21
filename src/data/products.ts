import { DigitalProduct } from '../types.js';

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: 'hospitality-website-starter-kit',
    title: 'Hospitality Website Starter Kit',
    category: 'Template',
    billingType: 'one-time',
    availability: 'coming_soon',
    price: null,
    currency: 'USD',
    checkoutUrl: '',
    shortDescription:
      'A structured website template designed for independent hotels and restaurants covering rooms, menus, directions, and direct enquiry pages.',
    description:
      'Built for small hospitality teams that want a fast, clean web structure without starting from a blank page. Includes page layouts for rooms and services, categorized food and drink menus, location details, and direct enquiry routing.',
    intendedUsers: 'Independent hoteliers, boutique inns, restaurants, and cafes',
    deliveryFormat: 'Downloadable source package and setup documentation (pending final packaging)',
    includedItems: [
      'Home, Rooms / Services, Menu, Location, and Enquiry page templates',
      'Mobile-friendly navigation and readable menu table layouts',
      'Structured local business metadata and basic page-title templates',
      'Written setup guide covering hosting, images, and contact links'
    ],
    technicalRequirements: [
      'Modern Node.js environment for customization, or static web host',
      'Existing domain name and property photography / menu copy'
    ],
    supportScope:
      'Documentation-only self-serve package once released; custom setup or booking-engine integration is scoped separately as an agency service.',
    licenseNotes: 'Single-property / single-business license terms to be finalized by the owner prior to launch.',
    ownerSetupNotes: [
      'Finalize downloadable starter repository archive',
      'Set one-time price and connect Lemon Squeezy checkout URL',
      'Confirm licensing, delivery, and refund terms'
    ]
  },
  {
    slug: 'local-seo-ai-visibility-audit-workbook',
    title: 'Local SEO & AI Visibility Audit Workbook',
    category: 'Tool',
    billingType: 'one-time',
    availability: 'coming_soon',
    price: null,
    currency: 'USD',
    checkoutUrl: '',
    shortDescription:
      'A practical audit spreadsheet and prompt-logging workbook to check Google Business Profile completeness, NAP consistency, and AI search observations.',
    description:
      'Designed for hospitality owners and marketers who want an honest, repeatable way to track local search fundamentals and log what AI assistants actually return for property-related prompts over time.',
    intendedUsers: 'Hotel and restaurant owners, in-house managers, and local marketing operators',
    deliveryFormat: 'Structured spreadsheet / Notion template bundle (pending final packaging)',
    includedItems: [
      'Google Business Profile and local citation verification checklist',
      'Name, Address, Phone (NAP) and opening-hours consistency log',
      'On-site crawlability, menu/service page, and FAQ readiness checklist',
      'AI search observation log tracking exact prompts, platform, date, test location, and repeated findings'
    ],
    technicalRequirements: [
      'Google Sheets, Microsoft Excel, or Notion account',
      'Access to your property Google Business Profile and website'
    ],
    supportScope:
      'Self-guided workbook; full manual audits and implementation improvements are available through our agency services.',
    licenseNotes: 'Single-organization usage terms to be confirmed by the owner before sales open.',
    ownerSetupNotes: [
      'Finalize export files (.xlsx / Notion template link)',
      'Set one-time price and connect Lemon Squeezy checkout URL',
      'Confirm refund and update terms'
    ]
  },
  {
    slug: 'hospitality-enquiry-estimator-widget',
    title: 'Hospitality Group & Event Enquiry Widget',
    category: 'Micro App',
    billingType: 'one-time',
    availability: 'coming_soon',
    price: null,
    currency: 'USD',
    checkoutUrl: '',
    shortDescription:
      'A lightweight embeddable micro app for capturing structured private dining, group stay, and event enquiries ready to send to your inbox.',
    description:
      'Helps hotels and restaurants gather clear details upfront—dates, guest counts, room or dining preferences, and dietary or setup notes—so staff spend less time chasing missing information via back-and-forth emails.',
    intendedUsers: 'Restaurants with private dining, boutique hotels hosting retreats or group stays, and event venues',
    deliveryFormat: 'Self-contained embeddable web component and configuration guide (pending final packaging)',
    includedItems: [
      'Lightweight responsive enquiry capture form with structured guest-count and date fields',
      'Summary formatting for clean handoff to your team email workflow',
      'Clear separation between enquiry requests and confirmed bookings',
      'Configuration guide for embedding into an existing site'
    ],
    technicalRequirements: [
      'Ability to add an embed snippet or HTML component to your website',
      'Existing email address or form handler endpoint for receiving enquiries'
    ],
    supportScope:
      'Includes written installation notes at release; custom CRM or PMS integration is quoted separately.',
    licenseNotes: 'Single-site license and delivery/refund terms pending owner approval.',
    ownerSetupNotes: [
      'Package final embeddable widget bundle and setup docs',
      'Set one-time price and connect Lemon Squeezy checkout URL',
      'Confirm licensing, refund, and email-routing requirements'
    ]
  }
];

export function getProductBySlug(slug: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((product) => product.slug === slug);
}
