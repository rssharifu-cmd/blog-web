import { createClient } from '@supabase/supabase-js';
import { Article, Category, Tag, SiteSettings, ArticleInput } from '../types.js';

let rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_UR || '').trim();
let rawSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANO || '').trim();

// Format and clean up the Supabase URL
if (rawSupabaseUrl) {
  // If user only pasted the project ID (e.g., lpeeukmddwtciacvrwta), build full URL
  if (!rawSupabaseUrl.includes('://')) {
    rawSupabaseUrl = `https://${rawSupabaseUrl}.supabase.co`;
  }
  // Strip trailing /rest/v1/ or /rest/v1 or slashes to avoid double paths in Supabase client
  rawSupabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '');
  rawSupabaseUrl = rawSupabaseUrl.replace(/\/$/, '');
}

const supabaseUrl = rawSupabaseUrl;
const supabaseAnonKey = rawSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

const customFetch = (...args: Parameters<typeof fetch>) => {
  const fetchFn = typeof window !== 'undefined' ? window.fetch : fetch;
  return fetchFn(...args);
};

const initSupabase = () => {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: customFetch
      }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const supabase = initSupabase();

// ==========================================
// SEED DATA FOR LOCAL FALLBACK
// ==========================================

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'AI Tools', slug: 'ai-tools', description: 'Deep dives and reviews of cutting-edge AI utilities transforming business.' },
  { id: 'cat-2', name: 'Automation', slug: 'automation', description: 'Tutorials on connecting APIs and building seamless workflow pipelines.' },
  { id: 'cat-3', name: 'Digital Marketing', slug: 'digital-marketing', description: 'Advanced strategies for SEO, traffic generation, and Generative Engine Optimization.' },
  { id: 'cat-4', name: 'SaaS Reviews', slug: 'saas-reviews', description: 'Unbiased reviews of the software tools shaping the digital economy.' },
  { id: 'cat-5', name: 'Case Studies', slug: 'case-studies', description: 'Real-world reports, earnings, and strategies from successful online founders.' }
];

const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Make Money Online', slug: 'make-money-online' },
  { id: 'tag-2', name: 'Passive Income', slug: 'passive-income' },
  { id: 'tag-3', name: 'Affiliate Marketing', slug: 'affiliate-marketing' },
  { id: 'tag-4', name: 'Productivity', slug: 'productivity' },
  { id: 'tag-5', name: 'Blogging', slug: 'blogging' },
  { id: 'tag-6', name: 'Freelancing', slug: 'freelancing' }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'NetVentures',
  siteDescription: 'The premium online business magazine and resource center for making money online, AI tools, SaaS reviews, and digital automation.',
  contactEmail: 'editor@netventures.online',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80',
  footerText: '© 2026 NetVentures. Premium digital business strategies and insights.',
  affiliateDisclosure: 'Affiliate Disclosure: Some of the links on this website are affiliate links, meaning we may earn a small commission if you make a purchase through them, at no extra cost to you. We only recommend products we have personally tested and trust.',
  googleAnalyticsId: '',
  googleSearchConsoleVerification: ''
};

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The AI-Powered Content Empire: Scaling to $10,000/Month in 2026',
    slug: 'ai-powered-content-empire',
    shortDescription: 'Discover how to leverage state-of-the-art AI systems, automated editors, and predictive search frameworks to build an organic traffic powerhouse.',
    categoryId: 'cat-1',
    tags: ['make-money-online', 'blogging', 'passive-income'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
    seoTitle: 'How to Build an AI Content Empire in 2026 - NetVentures',
    seoDescription: 'Step-by-step blueprint to build, scale, and monetize a high-authority blog using generative AI and advanced workflow automation.',
    canonicalUrl: 'https://netventures.online/blog/ai-powered-content-empire',
    author: 'Stefan Sharf',
    publishedAt: '2026-07-15T09:00:00Z',
    readingTime: 6,
    views: 1245,
    faq: [
      { question: 'Will AI content get penalized by Google Search?', answer: 'No. Google\'s official guidance states they reward high-quality content regardless of how it is produced. Focus on providing unique data, expert perspectives, and clear value (EEAT).' },
      { question: 'Which AI models are best for blogging?', answer: 'For structured drafting and deep research, Gemini-3.5-Flash and Claude-3.5-Sonnet offer the best balance of context, technical precision, and human-like expression.' }
    ],
    content: `## The Era of Generative Business Publishing\n\nIn 2026, the landscape of digital publishing is undergoing an unprecedented shift. Simple, repetitive search keywords are being replaced by conversational AI responses, and readers are demanding deep, actionable insights instead of thin "SEO fluff." To survive and thrive, you must shift your perspective from simple content writing to building a sophisticated **AI-powered media engine**.\n\nBuilding a content empire does not mean spamming search engines with low-grade articles. Instead, it involves combining generative AI speeds with real human expertise, editorial oversight, and advanced digital optimization techniques.\n\n---\n\n## The 3-Step AI Publishing Flywheel\n\nSuccessfully scaling an online business magazine requires a sustainable process. The flywheel consists of three core phases:\n\n### 1. Programmatic Research & Synthesis\nInstead of spending hours searching topics manually, we use generative models to synthesize search intent. We analyze the specific questions readers are asking in forums, online discussions, and help centers. By feeding these insights into AI agents, we construct comprehensive outlines designed to answer complex search queries comprehensively.\n\n### 2. Expert-Guided AI Drafting\nWhen generating drafts, avoid using single-sentence prompts. Use structured prompts that provide:\n* **Brand Persona:** Establish a clear, professional, and authoritative editorial voice.\n* **Contextual Data:** Provide unique case study statistics, product pricing tables, or hands-on user feedback.\n* **Structural Guidelines:** Instruct the model to avoid cliché transition words, use active verbs, and structure insights with bullet lists and comparison charts.\n\n### 3. Generative Engine Optimization (GEO)\nOptimizing for Claude, ChatGPT, and Gemini requires highly structured, clean semantic HTML. Ensure your content includes:\n* **Definition Snippets:** Direct, clear answers to common questions right at the beginning of headings.\n* **JSON-LD Schema:** Structured markup to help search crawlers easily parse authors, reviews, and facts.\n* **Authoritative Citations:** Linking directly to verified primary sources and official documentations.\n\n---\n\n## Actionable Strategy: High-Ticket Monetization\n\nTo achieve a stable $10k/month passive income stream, do not rely on low-paying display ads. Instead, focus on these three high-margin channels:\n\n1. **High-Ticket Affiliate Partnerships:** Partner with enterprise SaaS products offering 30% recurring monthly commissions.\n2. **Sponsorship Deals:** Sell premium editorial features and custom header placements directly to growing startups.\n3. **Digital Infoproducts & Premium Toolkits:** Bundle your specialized templates, automation scripts, and workflow files into highly valuable digital products.\n\nBy executing this hybrid blueprint, you leverage AI to handle the manual labor of research and drafting, while focusing your energy on high-level business strategy, partner outreach, and brand positioning.`
  },
  {
    id: 'art-2',
    title: 'SaaS Case Study: Automating Cold Outreach with Clay & Make.com',
    slug: 'saas-case-study-clay-make-automation',
    shortDescription: 'How we built a zero-touch pipeline that extracts leads, enriches their records via AI, and schedules highly personalized sequences.',
    categoryId: 'cat-2',
    tags: ['freelancing', 'productivity', 'make-money-online'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80',
    seoTitle: 'B2B Lead Generation Automation Case Study - NetVentures',
    seoDescription: 'Read our comprehensive SaaS case study demonstrating how Clay, Make.com, and Gemini API automate hyper-targeted business development.',
    canonicalUrl: 'https://netventures.online/blog/saas-case-study-clay-make-automation',
    author: 'Marcus Vance',
    publishedAt: '2026-07-16T14:30:00Z',
    readingTime: 8,
    views: 948,
    faq: [
      { question: 'What is the budget required to run this lead-gen stack?', answer: 'A basic setup with Clay, Make, and API keys costs roughly $150 to $250 per month, which easily pays for itself by booking 3 to 5 high-ticket sales meetings.' },
      { question: 'How do you prevent emails from landing in spam folders?', answer: 'Always buy secondary domains, configure SPF, DKIM, and DMARC correctly, and warm up your mailboxes for at least 14 days before launching campaigns.' }
    ],
    content: `## The Modern B2B Acquisition Bottleneck\n\nFor agencies, freelancers, and B2B SaaS founders, outbound sales is a major bottleneck. Doing manual research and sending personalized emails is slow, whereas sending generic blast emails ruins domain reputations and yields terrible reply rates.\n\nThis case study reviews how we built a fully automated pipeline that enriches prospects, synthesizes their recent company news using AI, and writes personalized emails that look like they took 30 minutes of careful research to compose.\n\n---\n\n## The Ultimate Automation Stack\n\nOur programmatic outreach workflow utilizes three powerful components:\n\n* **Clay:** For lead scraping, multi-source enrichment (LinkedIn, Crunchbase, Github), and database filtering.\n* **Make.com:** The workflow connector that triggers actions on specific events (e.g., when a new lead is added to our system).\n* **Gemini API:** For analyzing prospect data, extracting key pain points, and writing custom personalized intro lines.\n\n\`\`\`\n[ Lead Source ] ➔ [ Clay Enrichment ] ➔ [ Gemini Personalization ] ➔ [ Smartlead Outbound ]\n\`\`\`\n\n---\n\n## Step-by-Step Pipeline Architecture\n\n### 1. Unified Scraping & Database Construction\nInstead of copy-pasting contacts, we start with filtered searches in LinkedIn Sales Navigator or directly within Clay's database. We construct list segments targeting Series-A software founders, marketing directors, or customer support managers.\n\n### 2. Multi-Source enrichment\nWe feed the domain names or emails into multi-enrichment pathways. Clay pulls real-time data from 50+ integrated providers to find:\n* Estimated monthly cloud spends\n* Active job postings for technical writers or engineers\n* The recipient's recent LinkedIn post topic\n\n### 3. AI Persona Generation\nWe send these structured signals to the Gemini API with a robust prompt. We ask Gemini to identify the primary business problem. For instance: *"Company X is hiring customer success leads, and uses Zendesk. They likely suffer from high ticket response times."*\n\n### 4. Custom Draft Generation & Sending\nFinally, we push the enriched records through Make.com to our outbound emailing hub (Smartlead). Make.com triggers personalized emails matching our prospect's tech stacks, news mentions, and challenges. If the prospect fails to reply, an automated follow-up sequence triggers 4 days later with a personalized worksheet template.`
  }
];

// LocalStorage helpers
const loadLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      if (!isSupabaseConfigured) {
        saveLocalData(key, defaultValue);
      }
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    console.warn(`Failed to load local storage data for key "${key}":`, err);
    return defaultValue;
  }
};

const saveLocalData = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save local storage data for key "${key}":`, err);
    if (key !== 'net_articles') {
      try {
        localStorage.removeItem('net_articles');
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // Ignore
      }
    }
  }
};

// Initialize LocalStorage states
const initFallbackState = () => {
  loadLocalData('net_articles', DEFAULT_ARTICLES);
  loadLocalData('net_categories', DEFAULT_CATEGORIES);
  loadLocalData('net_tags', DEFAULT_TAGS);
  loadLocalData('net_settings', DEFAULT_SETTINGS);
  loadLocalData('net_subscribers', [] as string[]);
};

if (!isSupabaseConfigured) {
  initFallbackState();
} else {
  try {
    localStorage.removeItem('net_articles');
  } catch (e) {
    // Ignore
  }
}

// ==========================================
// DB FIELD MAPPING HELPERS
// ==========================================

const mapArticleFromDb = (dbArt: any): Article => {
  if (!dbArt) return {} as any;
  return {
    id: dbArt.id,
    title: dbArt.title,
    slug: dbArt.slug,
    content: dbArt.content || '',
    shortDescription: dbArt.short_description || dbArt.excerpt || '',
    categoryId: dbArt.category_id || dbArt.category || '',
    tags: dbArt.tags || [],
    status: (dbArt.status && dbArt.status.toString().toLowerCase() === 'draft') ? 'draft' : 'published',
    featuredImage: dbArt.featured_image || '',
    featuredImageAlt: dbArt.featured_image_alt || dbArt.featuredImageAlt || '',
    seoTitle: dbArt.seo_title || '',
    seoDescription: dbArt.seo_description || dbArt.meta_description || '',
    canonicalUrl: dbArt.canonical_url || '',
    publishedAt: dbArt.published_at || dbArt.created_at || new Date().toISOString(),
    readingTime: dbArt.reading_time || 5,
    views: dbArt.views || 0,
    author: dbArt.author || 'Anonymous',
    faq: dbArt.faq || []
  };
};

const mapArticleToDbForInsert = (art: Partial<ArticleInput>) => {
  return {
    title: art.title,
    slug: art.slug,
    author: art.author || 'Stefan Sharf',
    content: art.content,
    featured_image: art.featuredImage,
    featured_image_alt: art.featuredImageAlt || '',
    seo_title: art.seoTitle,
    canonical_url: art.canonicalUrl,
    status: art.status || 'published',
    tags: art.tags || [],
    faq: art.faq || [],
    category_id: art.categoryId,
    short_description: art.shortDescription,
    seo_description: art.seoDescription,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
};

const mapArticleToDbForUpdate = (art: Partial<ArticleInput> & { id?: string }) => {
  return {
    title: art.title,
    slug: art.slug,
    author: art.author,
    content: art.content,
    featured_image: art.featuredImage,
    featured_image_alt: art.featuredImageAlt || '',
    seo_title: art.seoTitle,
    canonical_url: art.canonicalUrl,
    status: art.status,
    tags: art.tags,
    faq: art.faq,
    category_id: art.categoryId,
    short_description: art.shortDescription,
    seo_description: art.seoDescription
  };
};

const mapSettingsFromDb = (dbSet: any): SiteSettings => ({
  siteName: dbSet.site_name || 'NetVentures',
  siteDescription: dbSet.site_description || '',
  contactEmail: dbSet.contact_email || '',
  logoUrl: dbSet.logo_url || '',
  footerText: dbSet.footer_text || '',
  affiliateDisclosure: dbSet.affiliate_disclosure || '',
  googleAnalyticsId: dbSet.google_analytics_id || '',
  googleSearchConsoleVerification: dbSet.google_search_console_verification || ''
});

const mapSettingsToDb = (set: SiteSettings) => ({
  id: 'global',
  site_name: set.siteName,
  site_description: set.siteDescription,
  contact_email: set.contactEmail,
  logo_url: set.logoUrl,
  footer_text: set.footerText,
  affiliate_disclosure: set.affiliateDisclosure,
  google_analytics_id: set.googleAnalyticsId || '',
  google_search_console_verification: set.googleSearchConsoleVerification || ''
});

// ==========================================
// PUBLIC DATABASE ACTIONS
// ==========================================

export const getArticles = async (options?: { status?: 'draft' | 'published' }): Promise<Article[]> => {
  // Trigger background sync of local articles to server sitemap if in browser and Supabase is not configured
  if (typeof window !== 'undefined' && !isSupabaseConfigured) {
    setTimeout(() => {
      try {
        const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
        list.forEach(art => {
          if (art && art.title) {
            const slug = (art.slug && art.slug.trim())
              ? art.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
              : art.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;
            const status = art.status || 'published';
            fetch('/api/v1/sync-article', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...art, slug, status })
            }).catch(() => {});
          }
        });
      } catch (e) {}
    }, 100);
  }

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(200);
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message || error);
      const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
      if (options?.status) {
        return list.filter(a => a.status === options.status);
      }
      return list;
    }
    const articles = (data || []).map(mapArticleFromDb);
    return articles;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    if (options?.status) {
      return list.filter(a => a.status === options.status);
    }
    return list;
  }
};

export const getArticleSummaries = async (options?: { status?: 'draft' | 'published' }): Promise<Article[]> => {
  if (isSupabaseConfigured && supabase) {
    const selectFields = 'id, title, slug, short_description, category_id, tags, status, featured_image, featured_image_alt, seo_title, seo_description, canonical_url, created_at, published_at, reading_time, views, author, faq';

    let query = supabase.from('articles').select(selectFields).order('created_at', { ascending: false }).limit(200);
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message || error);
      const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
      let res = options?.status ? list.filter(a => a.status === options.status) : list;
      return res.map(a => ({ ...a, content: '' }));
    }
    const articles = (data || []).map(row => ({ ...mapArticleFromDb(row), content: '' }));
    return articles;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    let res = options?.status ? list.filter(a => a.status === options.status) : list;
    return res.map(a => ({ ...a, content: '' }));
  }
};

const slugifyStr = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const getSlugTokens = (str: string): string[] => {
  const stopWords = new Set(['for', 'in', 'and', 'the', 'a', 'an', 'of', 'to', 'with', 'on', 'at', 'by', 'real']);
  return slugifyStr(str)
    .split('-')
    .filter(t => t.length > 1 && !stopWords.has(t));
};

export const isSlugMatch = (targetSlug: string, candidateSlugOrTitle: string): boolean => {
  if (!targetSlug || !candidateSlugOrTitle) return false;
  const targetNorm = slugifyStr(targetSlug);
  const candidateNorm = slugifyStr(candidateSlugOrTitle);

  if (targetNorm === candidateNorm) return true;
  if (candidateNorm.includes(targetNorm) || targetNorm.includes(candidateNorm)) return true;

  const targetTokens = getSlugTokens(targetSlug);
  const candidateTokens = getSlugTokens(candidateSlugOrTitle);
  if (targetTokens.length === 0 || candidateTokens.length === 0) return false;

  const candidateSet = new Set(candidateTokens);
  const common = targetTokens.filter(t => candidateSet.has(t));
  const ratio = common.length / Math.min(targetTokens.length, candidateTokens.length);
  return ratio >= 0.7;
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  if (isSupabaseConfigured && supabase) {
    // 1. Try exact slug match
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
    if (!error && data) return mapArticleFromDb(data);

    if (error) {
      console.warn('Supabase fetch error for slug, using local fallback:', error.message || error);
    }

    // 2. Try matching by ID ONLY if slug is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      const { data: idData } = await supabase.from('articles').select('*').eq('id', slug).maybeSingle();
      if (idData) return mapArticleFromDb(idData);
    }

    // 3. Lightweight check: fetch id, slug, title to find flexible slug match
    const { data: lightArts } = await supabase.from('articles').select('id, slug, title').limit(100);
    if (lightArts && lightArts.length > 0) {
      const matched = lightArts.find(a => 
        (a.slug && isSlugMatch(slug, a.slug)) || 
        (a.title && isSlugMatch(slug, a.title))
      );
      if (matched) {
        const { data: matchedFull } = await supabase.from('articles').select('*').eq('id', matched.id).maybeSingle();
        if (matchedFull) return mapArticleFromDb(matchedFull);
      }
    }

    // 4. Fallback to local data if not found in Supabase
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => isSlugMatch(slug, a.slug) || isSlugMatch(slug, a.title)) || null;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => isSlugMatch(slug, a.slug) || isSlugMatch(slug, a.title)) || null;
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message || error);
      const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
      return list.find(a => a.id === id) || null;
    }
    if (data) return mapArticleFromDb(data);
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => a.id === id) || null;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => a.id === id) || null;
  }
};

export const getArticleForEdit = async (id: string): Promise<Article | null> => {
  return getArticleById(id);
};

export const getCategories = async (): Promise<Category[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message || error);
      return loadLocalData<Category[]>('net_categories', DEFAULT_CATEGORIES);
    }
    return (data && data.length > 0) ? data : loadLocalData<Category[]>('net_categories', DEFAULT_CATEGORIES);
  } else {
    return loadLocalData<Category[]>('net_categories', DEFAULT_CATEGORIES);
  }
};

export const getTags = async (): Promise<Tag[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('tags').select('*').order('name');
    if (error) {
      console.error(error);
      return DEFAULT_TAGS;
    }
    return data || [];
  } else {
    return loadLocalData<Tag[]>('net_tags', DEFAULT_TAGS);
  }
};

export const getSettings = async (): Promise<SiteSettings> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle();
    if (error) {
      console.error(error);
      return DEFAULT_SETTINGS;
    }
    return data ? mapSettingsFromDb(data) : DEFAULT_SETTINGS;
  } else {
    return loadLocalData<SiteSettings>('net_settings', DEFAULT_SETTINGS);
  }
};

export const incrementArticleView = async (slug: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    // Attempt standard transaction increment
    const { data: current } = await supabase.from('articles').select('views, id').eq('slug', slug).maybeSingle();
    if (current) {
      const { error } = await supabase.from('articles').update({ views: (current.views || 0) + 1 }).eq('id', current.id);
      return !error;
    }
    return false;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    const updated = list.map(a => a.slug === slug ? { ...a, views: a.views + 1 } : a);
    saveLocalData('net_articles', updated);
    return true;
  }
};

export const subscribeNewsletter = async (email: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error(error);
      return false;
    }
    return true;
  } else {
    const subs = loadLocalData<string[]>('net_subscribers', []);
    if (!subs.includes(email)) {
      subs.push(email);
      saveLocalData('net_subscribers', subs);
    }
    return true;
  }
};

// ==========================================
// ADMINISTRATIVE CMS ACTIONS
// ==========================================

export const getSubscribers = async (): Promise<string[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('newsletter_subscribers').select('email').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      return [];
    }
    return (data || []).map(row => row.email);
  } else {
    return loadLocalData<string[]>('net_subscribers', []);
  }
};

export const saveSettings = async (settings: SiteSettings): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('site_settings').upsert([mapSettingsToDb(settings)]);
    return !error;
  } else {
    saveLocalData('net_settings', settings);
    return true;
  }
};

export const saveArticle = async (input: ArticleInput & { id?: string }): Promise<Article | null> => {
  // Guarantee clean slug and default status
  const normalizedSlug = (input.slug && input.slug.trim())
    ? input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : (input.title || 'article').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;

  const normalizedInput = {
    ...input,
    slug: normalizedSlug,
    status: input.status || 'published'
  };

  // Estimate reading time: roughly 200 words per minute
  const wordCount = (normalizedInput.content || '').trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  let savedArticle: Article | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      if (normalizedInput.id) {
        // Update
        const dbPayload: any = mapArticleToDbForUpdate(normalizedInput);
        dbPayload.reading_time = readingTime;
        
        const { data, error } = await supabase.from('articles').update(dbPayload).eq('id', normalizedInput.id).select().single();
        if (!error && data) {
          savedArticle = mapArticleFromDb(data);
        }
      } else {
        // Insert
        const dbPayload: any = mapArticleToDbForInsert(normalizedInput);
        
        const { data, error } = await supabase.from('articles').insert([dbPayload]).select().single();
        if (!error && data) {
          savedArticle = mapArticleFromDb(data);
        }
      }
    } catch (e) {
      console.warn('Supabase save failed, falling back to local storage:', e);
    }
  }

  // Only perform local storage caching when Supabase save did not return an article and Supabase is not configured
  if (!savedArticle && !isSupabaseConfigured) {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    const targetArt: Article = {
      ...normalizedInput,
      id: normalizedInput.id || `art-${Date.now()}`,
      readingTime,
      publishedAt: new Date().toISOString(),
      views: 0
    };
    targetArt.status = 'published';

    const idx = list.findIndex(a => (targetArt.id && a.id === targetArt.id) || (targetArt.slug && a.slug === targetArt.slug));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...targetArt };
    } else {
      list.unshift(targetArt);
    }
    saveLocalData('net_articles', list);
    savedArticle = targetArt;
  } else if (isSupabaseConfigured) {
    try {
      localStorage.removeItem('net_articles');
    } catch (e) {}
  }

  // Always sync saved article to server so sitemap.xml and RSS update immediately
  try {
    await fetch('/api/v1/sync-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedArticle)
    });
  } catch (e) {
    console.warn('Could not sync article to server:', e);
  }

  return savedArticle;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  let deletedFromSupabase = false;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        deletedFromSupabase = true;
      }
    } catch (e) {
      console.warn('Supabase article deletion failed, falling back to local storage:', e);
    }
  }

  if (!deletedFromSupabase && !isSupabaseConfigured) {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    const filtered = list.filter(a => a.id !== id);
    saveLocalData('net_articles', filtered);
  } else if (isSupabaseConfigured) {
    try {
      localStorage.removeItem('net_articles');
    } catch (e) {}
  }

  try {
    await fetch(`/api/v1/sync-article/${id}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Could not sync article deletion with server:', e);
  }

  return true;
};

export const createCategory = async (name: string, description: string): Promise<Category | null> => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('categories').insert([{ name, slug, description }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const list = loadLocalData<Category[]>('net_categories', DEFAULT_CATEGORIES);
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description
    };
    list.push(newCat);
    saveLocalData('net_categories', list);
    return newCat;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
  } else {
    const list = loadLocalData<Category[]>('net_categories', DEFAULT_CATEGORIES);
    const filtered = list.filter(c => c.id !== id);
    saveLocalData('net_categories', filtered);
    return true;
  }
};

export const createTag = async (name: string): Promise<Tag | null> => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('tags').insert([{ name, slug }]).select().single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const list = loadLocalData<Tag[]>('net_tags', DEFAULT_TAGS);
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      slug
    };
    list.push(newTag);
    saveLocalData('net_tags', list);
    return newTag;
  }
};

// ==========================================
// MEDIA STORAGE ACTIONS
// ==========================================

export const uploadFeaturedImage = async (file: File): Promise<string> => {
  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('Supabase storage upload failed, falling back to base64 DataURL:', uploadError.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.warn('Supabase storage upload threw error, falling back to base64 DataURL:', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  } else {
    // In fallback mode, simulate image upload by converting to DataURL or using Unsplash
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
};

// ==========================================
// AUTHENTICATION AND PASSWORD ACTIONS
// ==========================================

export const loginAdmin = async (email: string, password: string): Promise<{ token: string; username: string }> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      token: data.session?.access_token || 'mock_token',
      username: data.user?.email || 'admin'
    };
  } else {
    // Fallback mode password validation
    const storedEmail = localStorage.getItem('net_admin_email_fallback') || 'admin@netventures.online';
    const storedPass = localStorage.getItem('net_admin_pass_fallback') || 'admin123';
    
    if (email.trim().toLowerCase() === storedEmail.trim().toLowerCase() && password === storedPass) {
      return {
        token: 'fallback-token-' + Date.now(),
        username: email
      };
    } else {
      throw new Error('Incorrect email or password. (Default: admin@netventures.online / admin123)');
    }
  }
};

export const registerAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/secret-cms-login'
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    const checkConfirmed = data.user?.identities?.length === 0 || data.session;
    return {
      success: true,
      message: checkConfirmed 
        ? 'Account registered successfully!' 
        : 'Registration confirmation sent! Please check your email inbox to verify.'
    };
  } else {
    localStorage.setItem('net_admin_email_fallback', email);
    localStorage.setItem('net_admin_pass_fallback', password);
    return {
      success: true,
      message: 'Offline admin account configured successfully in local storage!'
    };
  }
};

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/secret-cms-login'
    });
    if (error) throw new Error(error.message);
    return true;
  } else {
    const storedEmail = localStorage.getItem('net_admin_email_fallback') || 'admin@netventures.online';
    if (email.trim().toLowerCase() !== storedEmail.trim().toLowerCase()) {
      throw new Error('No admin account found with that email address.');
    }
    return true;
  }
};

export const verifySession = async (token: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      return Boolean(user);
    } catch {
      return false;
    }
  } else {
    return token.startsWith('fallback-token-');
  }
};

export const changeAdminPassword = async (newPasswordStr: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.updateUser({
      password: newPasswordStr
    });
    if (error) throw new Error(error.message);
    return true;
  } else {
    localStorage.setItem('net_admin_pass_fallback', newPasswordStr);
    return true;
  }
};
