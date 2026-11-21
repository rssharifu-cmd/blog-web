export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage: string;
  featuredImageAlt?: string;
  seoTitle: string;
  focusKeyword: string;
  contentBlocks?: any;
  seoDescription: string;
  canonicalUrl: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  author: string;
  faq: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  logoUrl: string;
  founderImageUrl?: string;
  footerText: string;
  affiliateDisclosure: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
}

export interface UserSession {
  token: string;
  username: string;
  expiresAt: string;
}

export interface AdminAccessRequest {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
}

export interface ArticleInput {
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage: string;
  featuredImageAlt?: string;
  seoTitle: string;
  focusKeyword: string;
  contentBlocks?: any;
  seoDescription: string;
  canonicalUrl: string;
  author: string;
  faq: { question: string; answer: string }[];
}

export interface DigitalProduct {
  slug: string;
  title: string;
  category: 'Template' | 'Tool' | 'Micro App';
  billingType: 'one-time';
  availability: 'coming_soon' | 'available';
  price: number | null;
  currency: string;
  checkoutUrl: string;
  shortDescription: string;
  description: string;
  intendedUsers: string;
  deliveryFormat: string;
  includedItems: string[];
  technicalRequirements: string[];
  supportScope: string;
  licenseNotes: string;
  ownerSetupNotes: string[];
}

export interface ServiceOffering {
  id: string;
  number: string;
  anchor: string;
  title: string;
  summary: string;
  deliverables: string[];
  scopeNotes: string[];
}

export interface WorkItem {
  id: string;
  title: string;
  statusLabel: string;
  category: string;
  summary: string;
  highlights: string[];
  linkLabel?: string;
  linkHref?: string;
  isExternal?: boolean;
}
