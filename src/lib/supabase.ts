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

const initSupabase = () => {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
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
  contactEmail: 'editor@netventures.com',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80',
  footerText: '© 2026 NetVentures. Premium digital business strategies and insights.',
  affiliateDisclosure: 'Affiliate Disclosure: Some of the links on this website are affiliate links, meaning we may earn a small commission if you make a purchase through them, at no extra cost to you. We only recommend products we have personally tested and trust.'
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
    canonicalUrl: 'https://netventures.com/blog/ai-powered-content-empire',
    author: 'Elena Rostova',
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
    canonicalUrl: 'https://netventures.com/blog/saas-case-study-clay-make-automation',
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
  affiliateDisclosure: dbSet.affiliate_disclosure || ''
});

const mapSettingsToDb = (set: SiteSettings) => ({
  id: 'global',
  site_name: set.siteName,
  site_description: set.siteDescription,
  contact_email: set.contactEmail,
  logo_url: set.logoUrl,
  footer_text: set.footerText,
  affiliate_disclosure: set.affiliateDisclosure
});

// ==========================================
// PUBLIC DATABASE ACTIONS
// ==========================================

export const getArticles = async (options?: { status?: 'draft' | 'published' }): Promise<Article[]> => {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return (data || []).map(mapArticleFromDb);
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    if (options?.status) {
      return list.filter(a => a.status === options.status);
    }
    return list;
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
    if (error) {
      console.error(error);
      return null;
    }
    return data ? mapArticleFromDb(data) : null;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => a.slug === slug) || null;
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
    if (error) {
      console.error(error);
      return null;
    }
    return data ? mapArticleFromDb(data) : null;
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    return list.find(a => a.id === id) || null;
  }
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

export const saveArticle = async (input: ArticleInput & { id?: string }): Promise<Article | null> => {
  // Estimate reading time: roughly 200 words per minute
  const wordCount = (input.content || '').trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isSupabaseConfigured && supabase) {
    const schema = await detectSchema();
    if (input.id) {
      // Update
      const dbPayload: any = mapArticleToDbForUpdate(input, schema);
      dbPayload.reading_time = readingTime;
      
      const { data, error } = await supabase.from('articles').update(dbPayload).eq('id', input.id).select().single();
      if (error) throw new Error(error.message);
      return mapArticleFromDb(data);
    } else {
      // Insert
      const dbPayload: any = mapArticleToDbForInsert(input, schema);
      
      const { data, error } = await supabase.from('articles').insert([dbPayload]).select().single();
      if (error) throw new Error(error.message);
      return mapArticleFromDb(data);
    }
  } else {
    const list = loadLocalData<Article[]>('net_articles', DEFAULT_ARTICLES);
    if (input.id) {
      const idx = list.findIndex(a => a.id === input.id);
      if (idx !== -1) {
        const existing = list[idx];
        const updated: Article = {
          ...existing,
          ...input,
          id: existing.id,
          readingTime,
          publishedAt: existing.publishedAt,
          views: existing.views
        };
        list[idx] = updated;
        saveLocalData('net_articles', list);
        return updated;
      }
      return null;
    } else {
      const newArt: Article = {
        ...input,
        id: `art-${Date.now()}`,
        readingTime,
        publishedAt: new Date().toISOString(),
        views: 0
      };
      list.unshift(newArt);
      saveLocalData('net_articles', list);
      return newArt;
    }
  }
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
    const storedEmail = localStorage.getItem('net_admin_email_fallback') || 'admin@netventures.com';
    const storedPass = localStorage.getItem('net_admin_pass_fallback') || 'admin123';
    
    if (email.trim().toLowerCase() === storedEmail.trim().toLowerCase() && password === storedPass) {
      return {
        token: 'fallback-token-' + Date.now(),
        username: email
      };
    } else {
      throw new Error('Incorrect email or password. (Default: admin@netventures.com / admin123)');
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
    const storedEmail = localStorage.getItem('net_admin_email_fallback') || 'admin@netventures.com';
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
