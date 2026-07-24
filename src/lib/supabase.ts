import { createClient } from '@supabase/supabase-js';
import { Article, Category, Tag, SiteSettings, ArticleInput } from '../types.js';
import localArticlesData from '../data/local_articles.json';

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

const initSupabase = () => {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, init) => fetch(url, init),
      },
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

const DEFAULT_ARTICLES: Article[] = Array.isArray(localArticlesData) && localArticlesData.length > 0 
  ? (localArticlesData as Article[]) 
  : [
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
    author: 'Elena Rostova',
    publishedAt: '2026-07-15T09:00:00Z',
    readingTime: 6,
    views: 1245,
    faq: [
      { question: 'Will AI content get penalized by Google Search?', answer: 'No. Google\'s official guidance states they reward high-quality content regardless of how it is produced. Focus on providing unique data, expert perspectives, and clear value (EEAT).' },
      { question: 'Which AI models are best for blogging?', answer: 'For structured drafting and deep research, Gemini-3.5-Flash and Claude-3.5-Sonnet offer the best balance of context, technical precision, and human-like expression.' }
    ],
    content: `## The Era of Generative Business Publishing...`
  }
];

// Helper to get local articles merged with DEFAULT_ARTICLES (preventing stale localStorage without new json articles)
const loadLocalArticles = (): Article[] => {
  const stored = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
  const storedSlugs = new Set((stored || []).map(a => a.slug));
  const merged = [...(stored || [])];
  
  (DEFAULT_ARTICLES || []).forEach(da => {
    if (da && da.slug && !storedSlugs.has(da.slug)) {
      merged.push(da);
      storedSlugs.add(da.slug);
    }
  });

  return merged;
};

// LocalStorage helpers
const loadLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveLocalData = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
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
    content: dbArt.content,
    shortDescription: dbArt.excerpt || dbArt.short_description || '',
    categoryId: dbArt.category || dbArt.category_id || '',
    tags: dbArt.tags || [],
    status: dbArt.status || 'draft',
    featuredImage: dbArt.featured_image || '',
    seoTitle: dbArt.seo_title || '',
    seoDescription: dbArt.meta_description || dbArt.seo_description || '',
    canonicalUrl: dbArt.canonical_url || '',
    publishedAt: dbArt.created_at || dbArt.published_at || new Date().toISOString(),
    readingTime: dbArt.reading_time || 5,
    views: dbArt.views || 0,
    author: dbArt.author || 'Anonymous',
    faq: dbArt.faq || []
  };
};

let detectedSchema: 'new' | 'old' | null = null;

async function detectSchema(): Promise<'new' | 'old'> {
  if (detectedSchema) return detectedSchema;
  if (!isSupabaseConfigured || !supabase) return 'old';
  
  try {
    const { error } = await supabase.from('articles').select('category').limit(1);
    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('category') || msg.includes('column') || msg.includes('cache') || msg.includes('not found')) {
        detectedSchema = 'old';
      } else {
        detectedSchema = 'new';
      }
    } else {
      detectedSchema = 'new';
    }
  } catch (e) {
    detectedSchema = 'old';
  }
  return detectedSchema;
}

const mapArticleToDbForInsert = (art: Partial<ArticleInput>, schema: 'new' | 'old') => {
  const common = {
    title: art.title,
    slug: art.slug,
    author: art.author || 'Elena Rostova',
    content: art.content,
    featured_image: art.featuredImage,
    seo_title: art.seoTitle,
    canonical_url: art.canonicalUrl,
    status: art.status,
    tags: art.tags || [],
    faq: art.faq || []
  };

  if (schema === 'new') {
    return {
      ...common,
      category: art.categoryId,
      excerpt: art.shortDescription,
      meta_description: art.seoDescription,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    return {
      ...common,
      category_id: art.categoryId,
      short_description: art.shortDescription,
      seo_description: art.seoDescription,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
  }
};

const mapArticleToDbForUpdate = (art: Partial<ArticleInput> & { id?: string }, schema: 'new' | 'old') => {
  const common = {
    title: art.title,
    slug: art.slug,
    author: art.author,
    content: art.content,
    featured_image: art.featuredImage,
    seo_title: art.seoTitle,
    canonical_url: art.canonicalUrl,
    status: art.status,
    tags: art.tags,
    faq: art.faq
  };

  if (schema === 'new') {
    return {
      ...common,
      category: art.categoryId,
      excerpt: art.shortDescription,
      meta_description: art.seoDescription,
      updated_at: new Date().toISOString()
    };
  } else {
    return {
      ...common,
      category_id: art.categoryId,
      short_description: art.shortDescription,
      seo_description: art.seoDescription,
      published_at: new Date().toISOString()
    };
  }
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
  let list: Article[] = [];
  try {
    const statusQuery = options?.status ? `?status=${options.status}` : '';
    const res = await fetch(`/api/articles${statusQuery}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API fetch notice:', err);
  }

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    const { data, error } = await query;
    if (!error && data) {
      list = data.map(mapArticleFromDb);
    }
  }

  return list;
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API fetch notice:', err);
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
    if (!error && data) {
      return mapArticleFromDb(data);
    }
  }

  return null;
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const res = await fetch(`/api/articles/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.id || data.slug)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API fetch notice:', err);
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
    if (!error && data) {
      return mapArticleFromDb(data);
    }
  }

  return null;
};

export const getCategories = async (): Promise<Category[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      console.error(error);
      return DEFAULT_CATEGORIES;
    }
    return data || [];
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
    const { data: current } = await supabase.from('articles').select('views, id').eq('slug', slug).single();
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

export const verifyArticlePublication = async (slug: string): Promise<boolean> => {
  const expectedPath = `/blog/${slug}`;
  let errors: string[] = [];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // 1. Verify public website with retry
  let articleVerified = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const article = await getArticleBySlug(slug);
      if (article && article.status !== 'draft') {
        articleVerified = true;
        break;
      }
    } catch (err) {
      // Retry silently
    }
    await sleep(300);
  }
  if (!articleVerified) {
    errors.push(`Article with slug "${slug}" not found or still in draft status on public website.`);
  }

  // 2. Verify /sitemap.xml with cache-busting and retry
  let sitemapVerified = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const sitemapRes = await fetch(`/sitemap.xml?t=${Date.now()}`, { cache: 'no-store' });
      const sitemapXml = await sitemapRes.text();
      if (sitemapXml.includes(expectedPath) || sitemapXml.includes(slug)) {
        sitemapVerified = true;
        break;
      }
    } catch (err: any) {
      // Retry silently
    }
    await sleep(300);
  }
  if (!sitemapVerified) {
    errors.push(`URL "${expectedPath}" is missing from /sitemap.xml.`);
  }

  // 3. Verify /rss.xml with cache-busting and retry
  let rssVerified = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const rssRes = await fetch(`/rss.xml?t=${Date.now()}`, { cache: 'no-store' });
      const rssXml = await rssRes.text();
      if (rssXml.includes(expectedPath) || rssXml.includes(slug)) {
        rssVerified = true;
        break;
      }
    } catch (err: any) {
      // Retry silently
    }
    await sleep(300);
  }
  if (!rssVerified) {
    errors.push(`Link "${expectedPath}" is missing from /rss.xml.`);
  }

  if (errors.length > 0) {
    console.warn(` publication verification notices for article "${slug}":\n` + errors.map(e => `  - ${e}`).join('\n'));
    return false;
  }

  console.log(`✅ Publication verification passed for article "${slug}": Verified in Public Website, /sitemap.xml, and /rss.xml.`);
  return true;
};

export const saveArticle = async (input: ArticleInput & { id?: string }): Promise<Article | null> => {
  // Estimate reading time: roughly 200 words per minute
  const wordCount = (input.content || '').trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  let savedArticle: Article | null = null;

  // 1. Try Express backend API first to trigger unified server-side updates, sitemaps, and RSS syndication
  const isUpdate = Boolean(input.id);
  const url = isUpdate ? `/api/articles/${input.id}` : '/api/articles';
  const method = isUpdate ? 'PUT' : 'POST';

  try {
    const apiRes = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'netventures-agent-key-2026'
      },
      body: JSON.stringify(input)
    });

    const resData = await apiRes.json().catch(() => ({}));

    if (apiRes.ok && resData.article) {
      savedArticle = resData.article;
    } else {
      console.warn('Backend server API save notice:', resData.message || resData.error || `HTTP ${apiRes.status}`);
    }
  } catch (apiErr: any) {
    console.warn('Backend server API sync notice during article save:', apiErr?.message || apiErr);
  }

  // 2. Direct Supabase client fallback if backend API didn't return saved article
  if (!savedArticle && isSupabaseConfigured && supabase) {
    try {
      let categoryId = input.categoryId;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(categoryId || ''));
      if (categoryId && !isUuid) {
        const categories = await getCategories();
        const match = categories.find(c => c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase());
        categoryId = match ? match.id : undefined;
      }

      const cleanedInput = { ...input, categoryId };

      if (isUpdate && input.id) {
        const dbPayload = mapArticleToDbForUpdate(cleanedInput, 'old');
        const { data, error } = await supabase.from('articles').update(dbPayload).eq('id', input.id).select().maybeSingle();
        if (!error && data) {
          savedArticle = mapArticleFromDb(data);
        }
      } else {
        const dbPayload = mapArticleToDbForInsert(cleanedInput, 'old');
        const { data, error } = await supabase.from('articles').insert([dbPayload]).select().maybeSingle();
        if (!error && data) {
          savedArticle = mapArticleFromDb(data);
        }
      }
    } catch (spErr: any) {
      console.warn('Supabase direct save notice:', spErr?.message || spErr);
    }
  }

  // 3. Local Storage fallback if neither backend nor Supabase returned savedArticle
  if (!savedArticle) {
    const now = new Date().toISOString();
    const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const fallbackArticle: Article = {
      id: input.id || `art-${Date.now()}`,
      title: input.title,
      slug,
      content: input.content,
      shortDescription: input.shortDescription || '',
      categoryId: input.categoryId || '',
      tags: input.tags || [],
      status: input.status || 'draft',
      featuredImage: input.featuredImage || '',
      seoTitle: input.seoTitle || `${input.title} - NetVentures`,
      seoDescription: input.seoDescription || input.shortDescription || '',
      canonicalUrl: input.canonicalUrl || `https://netventures.online/blog/${slug}`,
      publishedAt: input.status === 'draft' ? '' : now,
      readingTime,
      views: 0,
      author: input.author || 'Elena Rostova',
      faq: input.faq || []
    };

    savedArticle = fallbackArticle;
  }

  if (savedArticle) {
    // Keep client-side local storage synchronized for offline compatibility
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    const existingIdx = list.findIndex(a => a.id === savedArticle!.id || a.slug === savedArticle!.slug);
    if (existingIdx !== -1) {
      list[existingIdx] = savedArticle;
    } else {
      list.unshift(savedArticle);
    }
    saveLocalData('net_articles', list);
  }

  return savedArticle;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    return !error;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    const filtered = list.filter(a => a.id !== id);
    saveLocalData('net_articles', filtered);
    return true;
  }
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
  // 1. Try uploading to backend /api/upload endpoint
  try {
    const formData = new FormData();
    formData.append('image', file);
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'x-api-key': 'netventures-agent-key-2026'
      },
      body: formData
    });
    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        return uploadData.url;
      }
    }
  } catch (err: any) {
    console.warn('Backend image upload endpoint notice:', err?.message || err);
  }

  // 2. Try Supabase storage if configured
  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        if (data && data.publicUrl) return data.publicUrl;
      }
    } catch (err: any) {
      console.warn('Supabase storage upload notice:', err?.message || err);
    }
  }

  // 3. Fallback to base64 DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};;

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
