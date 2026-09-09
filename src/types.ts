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
  seoTitle: string;
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

export interface ArticleInput {
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  author: string;
  faq: { question: string; answer: string }[];
}
