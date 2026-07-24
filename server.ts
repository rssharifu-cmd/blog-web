import express from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

// Setup file paths and directories
const PORT = 3000;
const UPLOADS_DIR_NAME = 'uploads';
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', UPLOADS_DIR_NAME);
const DIST_UPLOADS_DIR = path.join(process.cwd(), 'dist', UPLOADS_DIR_NAME);
const LOCAL_DATA_DIR = path.join(process.cwd(), 'src', 'data');
const LOCAL_ARTICLES_FILE = path.join(LOCAL_DATA_DIR, 'local_articles.json');
const LOCAL_CATEGORIES_FILE = path.join(LOCAL_DATA_DIR, 'local_categories.json');

// Ensure necessary directories exist
[PUBLIC_UPLOADS_DIR, DIST_UPLOADS_DIR, LOCAL_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer for local image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg, png, gif, webp, svg) are allowed.'));
    }
  }
});

// Seed data definitions
const DEFAULT_CATEGORIES = [
  { id: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000001', name: 'AI Tools', slug: 'ai-tools', description: 'Deep dives and reviews of cutting-edge AI utilities transforming business.' },
  { id: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000002', name: 'Automation', slug: 'automation', description: 'Tutorials on connecting APIs and building seamless workflow pipelines.' },
  { id: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000003', name: 'Digital Marketing', slug: 'digital-marketing', description: 'Advanced strategies for SEO, traffic generation, and Generative Engine Optimization.' },
  { id: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000004', name: 'SaaS Reviews', slug: 'saas-reviews', description: 'Unbiased reviews of the software tools shaping the digital economy.' },
  { id: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000005', name: 'Case Studies', slug: 'case-studies', description: 'Real-world reports, earnings, and strategies from successful online founders.' }
];

const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'The AI-Powered Content Empire: Scaling to $10,000/Month in 2026',
    slug: 'ai-powered-content-empire',
    shortDescription: 'Discover how to leverage state-of-the-art AI systems, automated editors, and predictive search frameworks to build an organic traffic powerhouse.',
    categoryId: 'f9b8a7c6-e5d4-4c3b-2a1b-000000000001',
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
    content: 'In 2026, the landscape of digital publishing is undergoing an unprecedented shift...'
  }
];

// Helper to load/save JSON database fallbacks
function loadLocalFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    }
  } catch (err) {
    console.error(`Error loading local file ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  return defaultValue;
}

function saveLocalFile<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error saving local file ${filePath}:`, err);
  }
}

// Supabase Configuration
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  (SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY) &&
  (SUPABASE_URL.startsWith('http://') || SUPABASE_URL.startsWith('https://'))
);

// Instantiate Supabase Admin/Client
const supabaseClient = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)
  : null;

// Trigger SEO static assets regeneration
function triggerSeoRegeneration() {
  console.log('🔄 Triggering static sitemap, RSS feed, and robots.txt generation...');
  exec('node scripts/generate-seo-assets.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Error regenerating SEO static assets:', err);
      return;
    }
    console.log('✅ SEO assets updated successfully.');
    if (stdout.trim()) console.log(stdout.trim());
  });
}

// Map database row to Article interface
const mapArticleFromDb = (dbArt: any) => {
  if (!dbArt) return null;
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

async function start() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploads directory statically
  app.use('/uploads', express.static(PUBLIC_UPLOADS_DIR));
  app.use('/uploads', express.static(DIST_UPLOADS_DIR));

  // ==========================================
  // HELPER METADATA & SEO UTILITIES
  // ==========================================

  // Clean slugify utility
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Safe unique slug resolver checking Supabase or local state
  const getUniqueSlug = async (baseSlug: string, existingId?: string): Promise<string> => {
    let slug = baseSlug || 'untitled-article';
    let count = 0;
    
    const isSlugTaken = async (currentSlug: string): Promise<boolean> => {
      if (isSupabaseConfigured && supabaseClient) {
        let query = supabaseClient.from('articles').select('id, slug').eq('slug', currentSlug);
        if (existingId) {
          query = query.neq('id', existingId);
        }
        const { data, error } = await query;
        if (error) return false;
        return data && data.length > 0;
      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        return articlesList.some(a => a.slug === currentSlug && (!existingId || a.id !== existingId));
      }
    };

    let uniqueSlug = slug;
    while (await isSlugTaken(uniqueSlug)) {
      count++;
      uniqueSlug = `${slug}-${count}`;
    }
    return uniqueSlug;
  };

  // Automatic SEO calculations helper (Canonical, OpenGraph, JSON-LD)
  const computeArticleSEO = (article: any) => {
    const baseDomain = (process.env.APP_URL || 'https://netventures.online').trim().replace(/\/$/, '');
    const canonicalUrl = article.canonicalUrl || article.canonical_url || `${baseDomain}/blog/${article.slug}`;

    // OpenGraph structure
    const openGraphMetadata = {
      title: article.seoTitle || article.seo_title || article.title,
      description: article.seoDescription || article.meta_description || article.shortDescription || article.excerpt || article.title,
      image: article.featuredImage || article.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
      url: canonicalUrl,
      type: 'article',
      site_name: 'NetVentures',
      article: {
        published_time: article.publishedAt || article.published_at || new Date().toISOString(),
        author: article.author || 'Elena Rostova',
        tag: article.tags || []
      }
    };

    // JSON-LD dynamic schema
    const jsonLdSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "headline": article.title,
      "description": article.seoDescription || article.meta_description || article.shortDescription || article.excerpt || article.title,
      "image": article.featuredImage || article.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
      "author": {
        "@type": "Person",
        "name": article.author || 'Elena Rostova'
      },
      "publisher": {
        "@type": "Organization",
        "name": "NetVentures",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseDomain}/logo.png`
        }
      },
      "datePublished": article.publishedAt || article.published_at || new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };

    return {
      canonicalUrl,
      openGraphMetadata,
      jsonLdSchema
    };
  };

  // Automatic attribute generator combining slug, reading time, and metadata calculators
  const autoGenerateArticleAttributes = async (payload: any, existingArticle?: any) => {
    const title = payload.title || (existingArticle ? existingArticle.title : 'Untitled Article');
    const content = payload.content || (existingArticle ? existingArticle.content : '');
    
    // 1. Slug calculation
    let baseSlug = '';
    if (payload.slug) {
      baseSlug = slugify(payload.slug);
    } else if (payload.title) {
      baseSlug = slugify(payload.title);
    } else if (existingArticle) {
      baseSlug = existingArticle.slug;
    } else {
      baseSlug = 'untitled-article';
    }
    const finalSlug = await getUniqueSlug(baseSlug, existingArticle?.id);

    // 2. Reading time calculation
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // 3. SEO, Canonical, OG and Schema
    const seoDetails = computeArticleSEO({
      ...existingArticle,
      ...payload,
      slug: finalSlug
    });

    return {
      slug: finalSlug,
      readingTime,
      canonicalUrl: seoDetails.canonicalUrl,
      openGraphMetadata: seoDetails.openGraphMetadata,
      jsonLdSchema: seoDetails.jsonLdSchema
    };
  };

  // ==========================================
  // MIDDLEWARES (LOGGER, LIMITER, AUTH, VALIDATION)
  // ==========================================

  // Colored logger middleware with response duration
  const apiLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      let color = '\x1b[32m'; // green
      if (status >= 300 && status < 400) {
        color = '\x1b[36m'; // cyan
      } else if (status >= 400 && status < 500) {
        color = '\x1b[33m'; // yellow
      } else if (status >= 500) {
        color = '\x1b[31m'; // red
      }
      console.log(`[${timestamp}] \x1b[35m[API]\x1b[0m ${method} ${originalUrl} - ${color}${status}\x1b[0m (${duration}ms)`);
    });
    next();
  };

  // Sliding in-memory rate-limiting engine
  const rateLimiters = new Map<string, Map<string, { count: number; resetTime: number }>>();
  const rateLimiter = (options: { windowMs: number; max: number; keyPrefix: string }) => {
    if (!rateLimiters.has(options.keyPrefix)) {
      rateLimiters.set(options.keyPrefix, new Map());
    }
    const ipMap = rateLimiters.get(options.keyPrefix)!;

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      let record = ipMap.get(ip);

      if (!record || now > record.resetTime) {
        record = { count: 0, resetTime: now + options.windowMs };
      }

      record.count++;
      ipMap.set(ip, record);

      res.setHeader('X-RateLimit-Limit', options.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - record.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      if (record.count > options.max) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Too many requests. Rate limit is ${options.max} requests per ${Math.ceil(options.windowMs / 60000)} minutes.`,
          resetTime: new Date(record.resetTime).toISOString()
        });
      }
      next();
    };
  };

  const generalLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 300, keyPrefix: 'general' });
  const uploadLimiter = rateLimiter({ windowMs: 60 * 60 * 1000, max: 50, keyPrefix: 'upload' });

  // Security Token Authentication Middleware
  const authenticateAgent = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const configuredApiKey = (process.env.AI_AGENT_API_KEY || 'netventures-agent-key-2026').trim();
    
    let providedKey = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      providedKey = authHeader.substring(7).trim();
    } else if (req.headers['x-api-key']) {
      providedKey = String(req.headers['x-api-key']).trim();
    } else if (req.query.api_key) {
      providedKey = String(req.query.api_key).trim();
    }

    if (providedKey === configuredApiKey) {
      return next();
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. A valid secure REST API token is required.',
      details: 'Please provide the correct bearer token in the Authorization header ("Bearer <KEY>") or using the "x-api-key" header.'
    });
  };

  // Request Body Schema Validator Middleware
  const validateBody = (schema: { [key: string]: { type: string; required?: boolean; min?: number; max?: number; allowedValues?: any[] } }) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const errors: { field: string; issue: string }[] = [];
      const body = req.body || {};

      for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push({ field, issue: `This field is required.` });
          continue;
        }

        if (value !== undefined && value !== null) {
          if (rules.type === 'array') {
            if (!Array.isArray(value)) {
              errors.push({ field, issue: `Must be an array.` });
            }
          } else if (typeof value !== rules.type) {
            errors.push({ field, issue: `Must be of type ${rules.type}.` });
          }

          if (typeof value === 'string') {
            if (rules.min !== undefined && value.length < rules.min) {
              errors.push({ field, issue: `Must be at least ${rules.min} characters.` });
            }
            if (rules.max !== undefined && value.length > rules.max) {
              errors.push({ field, issue: `Must be at most ${rules.max} characters.` });
            }
          }

          if (rules.allowedValues && !rules.allowedValues.includes(value)) {
            errors.push({ field, issue: `Must be one of the allowed values: ${rules.allowedValues.join(', ')}` });
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Request payload validation failed.',
          details: errors
        });
      }

      next();
    };
  };

  const articleCreateSchema = {
    title: { type: 'string', required: true, min: 5, max: 200 },
    content: { type: 'string', required: true, min: 20 },
    status: { type: 'string', allowedValues: ['draft', 'published'] },
    shortDescription: { type: 'string', max: 500 },
    categoryId: { type: 'string' },
    tags: { type: 'array' },
    featuredImage: { type: 'string' },
    seoTitle: { type: 'string', max: 150 },
    seoDescription: { type: 'string', max: 300 },
    canonicalUrl: { type: 'string' },
    author: { type: 'string' },
    faq: { type: 'array' }
  };

  const articleUpdateSchema = {
    title: { type: 'string', min: 5, max: 200 },
    content: { type: 'string', min: 20 },
    status: { type: 'string', allowedValues: ['draft', 'published'] },
    shortDescription: { type: 'string', max: 500 },
    categoryId: { type: 'string' },
    tags: { type: 'array' },
    featuredImage: { type: 'string' },
    seoTitle: { type: 'string', max: 150 },
    seoDescription: { type: 'string', max: 300 },
    canonicalUrl: { type: 'string' },
    author: { type: 'string' },
    faq: { type: 'array' }
  };

  // ==========================================
  // OPENAPI & SWAGGER SPECIFICATION
  // ==========================================

  // Full OpenAPI Specification served as JSON
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'NetVentures AI Agent REST API',
      version: '1.0.0',
      description: 'The secure and high-performance automated content publishing engine of NetVentures Magazine, empowering AI agents to post content with automatic search engine optimization, real-time schema generation, rate-limiting, and syndication feed updates.',
      contact: {
        name: 'Elena Rostova',
        email: 'rssharifu@gmail.com',
        url: 'https://netventures.online'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'V1 API Server (Production-Ready)'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer Token: pass your secure key in the Authorization header as "Bearer <KEY>"'
        },
        HeaderApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Alternatively, pass your key directly in the "x-api-key" header.'
        },
        QueryApiKeyAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key',
          description: 'Or append your key as a query parameter (?api_key=<KEY>)'
        }
      },
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' }
          }
        },
        ArticleInput: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', minLength: 5, maxLength: 200, example: 'Scale Outbound Growth using Generative AI' },
            content: { type: 'string', minLength: 20, example: 'Leveraging AI outreach transforms cold pipelines in 2026...' },
            status: { type: 'string', enum: ['draft', 'published'], default: 'published' },
            shortDescription: { type: 'string', maxLength: 500 },
            categoryId: { type: 'string', description: 'Category UUID, Name or Slug' },
            tags: { type: 'array', items: { type: 'string' } },
            featuredImage: { type: 'string' },
            seoTitle: { type: 'string' },
            seoDescription: { type: 'string' },
            canonicalUrl: { type: 'string' },
            author: { type: 'string', default: 'Elena Rostova' },
            faq: { 
              type: 'array', 
              items: { 
                type: 'object', 
                properties: { 
                  question: { type: 'string' }, 
                  answer: { type: 'string' } 
                } 
              } 
            }
          }
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            shortDescription: { type: 'string' },
            categoryId: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
            featuredImage: { type: 'string' },
            seoTitle: { type: 'string' },
            seoDescription: { type: 'string' },
            canonicalUrl: { type: 'string' },
            publishedAt: { type: 'string', format: 'date-time' },
            readingTime: { type: 'integer' },
            views: { type: 'integer' },
            author: { type: 'string' },
            faq: { type: 'array', items: { type: 'object' } },
            openGraphMetadata: { type: 'object' },
            jsonLdSchema: { type: 'object' }
          }
        },
        UploadResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            url: { type: 'string' },
            filename: { type: 'string' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    },
    security: [
      { ApiKeyAuth: [] },
      { HeaderApiKeyAuth: [] },
      { QueryApiKeyAuth: [] }
    ],
    paths: {
      '/categories': {
        get: {
          summary: 'Fetch taxonomy categories',
          description: 'Retrieves a list of all active categories in the database to accurately tag published articles.',
          responses: {
            '200': {
              description: 'Successful retrieval of category objects',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' }
                  }
                }
              }
            }
          }
        }
      },
      '/upload': {
        post: {
          summary: 'Upload media asset',
          description: 'Uploads a featured image or content illustration. Supports both multipart/form-data with a file and application/json with a base64 encoded string.',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    image: { type: 'string', format: 'binary' }
                  }
                }
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image: { type: 'string', description: 'Base64 image data string starting with "data:image/"' }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Successfully uploaded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UploadResponse' }
                }
              }
            },
            '400': {
              description: 'Invalid input files or format type',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/articles': {
        post: {
          summary: 'Publish a new article',
          description: 'Saves and publishes a new editorial piece. Automatically computes slug uniqueness, estimated reading time, standard Canonical SEO URLs, schema-grade JSON-LD, and generates metadata schemas.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleInput' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Successfully created and indexed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      article: { $ref: '#/components/schemas/Article' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Validation constraints violated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/articles/{id}': {
        put: {
          summary: 'Update existing article',
          description: 'Updates specified attributes on an existing article matching an ID or a Slug.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'UUID or String Slug of the article to update'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleInput' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Successfully updated attributes',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      article: { $ref: '#/components/schemas/Article' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Article not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      }
    }
  };

  const serveSwaggerDocs = (req: express.Request, res: express.Response) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>NetVentures AI Agent REST API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
        <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5/favicon-32x32.png" sizes="32x32" />
        <style>
          html { box-sizing: border-box; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .swagger-ui { background-color: #0b0f19; filter: invert(0.9) hue-rotate(180deg); }
          .swagger-ui .topbar { display: none; }
          .header-banner { background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); padding: 35px 20px; text-align: center; border-bottom: 1px solid #4c1d95; }
          .header-banner h1 { margin: 0; font-size: 28px; color: #f5f3ff; font-weight: 700; letter-spacing: -0.025em; }
          .header-banner p { margin: 8px 0 0 0; font-size: 14px; color: #d8b4fe; font-weight: 400; }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <h1>🤖 NetVentures AI Agent API Interface</h1>
          <p>Comprehensive OpenAPI specification and real-time interactive sandbox</p>
        </div>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" charset="UTF-8"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
              url: "/api/v1/openapi.json",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              defaultModelsExpandDepth: 1,
              defaultModelExpandDepth: 1,
              docExpansion: "list"
            });
          };
        </script>
      </body>
      </html>
    `;
    res.send(html);
  };

  // ==========================================
  // API VERSION V1 ROUTER SETUP
  // ==========================================

  const apiRouter = express.Router();

  // Apply colored log and generic rate limiter on the router
  apiRouter.use(apiLogger);
  apiRouter.use(generalLimiter);

  // Serve OpenAPI Schema JSON and Swagger interactive documentation UI
  apiRouter.get('/openapi.json', (req, res) => res.json(openApiSpec));
  apiRouter.get('/docs', serveSwaggerDocs);

  // GET /agent-api-key -> Securely retrieve the AI Agent API key for administrators
  apiRouter.get('/agent-api-key', async (req, res) => {
    try {
      const adminToken = String(req.headers['x-admin-token'] || '').trim();
      if (!adminToken) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Administrative authentication token is required.' });
      }

      let isValid = false;
      if (adminToken.startsWith('fallback-token-')) {
        isValid = true;
      } else if (isSupabaseConfigured && supabaseClient) {
        try {
          const { data: { user }, error } = await supabaseClient.auth.getUser(adminToken);
          if (user && !error) {
            isValid = true;
          }
        } catch (e) {
          isValid = false;
        }
      }

      if (!isValid) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid administrative session. Please log in again.' });
      }

      const configuredApiKey = (process.env.AI_AGENT_API_KEY || 'netventures-agent-key-2026').trim();
      return res.json({
        success: true,
        apiKey: configuredApiKey
      });
    } catch (err: any) {
      console.error('Error in agent-api-key endpoint:', err);
      return res.status(500).json({ error: 'Server error', message: err.message });
    }
  });

  // GET /categories -> Fetch all categories
  apiRouter.get('/categories', async (req, res) => {
    try {
      if (isSupabaseConfigured && supabaseClient) {
        const { data, error } = await supabaseClient.from('categories').select('*').order('name');
        if (error) throw error;
        return res.json(data);
      } else {
        const categories = loadLocalFile(LOCAL_CATEGORIES_FILE, DEFAULT_CATEGORIES);
        return res.json(categories);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Database error', message: err.message });
    }
  });

  // POST /upload -> Image upload (Supports multipart or base64 JSON payload, rate-limited)
  apiRouter.post('/upload', uploadLimiter, authenticateAgent, (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Upload failed', message: err.message });
      }

      try {
        let fileUrl = '';
        const host = req.get('host') || `localhost:${PORT}`;
        const protocol = req.protocol;

        if (req.file) {
          const fileName = req.file.filename;
          
          if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
            fs.copyFileSync(
              path.join(PUBLIC_UPLOADS_DIR, fileName),
              path.join(DIST_UPLOADS_DIR, fileName)
            );
          }

          fileUrl = `${protocol}://${host}/uploads/${fileName}`;
          return res.status(201).json({
            success: true,
            url: fileUrl,
            filename: fileName,
            message: 'Image uploaded successfully to local storage.'
          });
        } else if (req.body.image && req.body.image.startsWith('data:image')) {
          const base64Data = req.body.image;
          const mimeMatch = base64Data.match(/^data:(image\/\w+);base64,/);
          if (!mimeMatch) {
            return res.status(400).json({ error: 'Invalid format', message: 'Invalid data URL.' });
          }
          const ext = mimeMatch[1].split('/')[1];
          const dataBuffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const fileName = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
          
          const publicPath = path.join(PUBLIC_UPLOADS_DIR, fileName);
          fs.writeFileSync(publicPath, dataBuffer);

          if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
            fs.writeFileSync(path.join(DIST_UPLOADS_DIR, fileName), dataBuffer);
          }

          fileUrl = `${protocol}://${host}/uploads/${fileName}`;
          return res.status(201).json({
            success: true,
            url: fileUrl,
            filename: fileName,
            message: 'Base64 image uploaded successfully.'
          });
        } else {
          return res.status(400).json({ error: 'Missing file', message: 'Provide an image file in "image" field or a base64 string.' });
        }
      } catch (uploadErr: any) {
        console.error('Upload handling error:', uploadErr);
        return res.status(500).json({ error: 'Server error', message: uploadErr.message });
      }
    });
  });

  // POST /articles -> Create and publish new article
  apiRouter.post('/articles', authenticateAgent, validateBody(articleCreateSchema), async (req, res) => {
    const {
      title,
      content,
      shortDescription,
      categoryId,
      tags,
      status,
      featuredImage,
      seoTitle,
      seoDescription,
      canonicalUrl,
      author,
      faq
    } = req.body;

    try {
      // Resolve category ID
      let finalCategoryId = categoryId || '';
      const categories = isSupabaseConfigured && supabaseClient
        ? (await supabaseClient.from('categories').select('*')).data || []
        : loadLocalFile(LOCAL_CATEGORIES_FILE, DEFAULT_CATEGORIES);

      if (categoryId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId)) {
        const match = categories.find(c => c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase());
        if (match) {
          finalCategoryId = match.id;
        }
      }

      // Generate slug, reading time, canonicalUrl, OG and JSON-LD
      const rawPayload = {
        title,
        content,
        shortDescription,
        categoryId: finalCategoryId,
        tags,
        status: status || 'published',
        featuredImage,
        seoTitle,
        seoDescription,
        canonicalUrl,
        author,
        faq,
        publishedAt: status === 'draft' ? null : new Date().toISOString()
      };

      const seoAttrs = await autoGenerateArticleAttributes(rawPayload);

      const articlePayload = {
        title,
        slug: seoAttrs.slug,
        content,
        shortDescription: shortDescription || '',
        categoryId: finalCategoryId,
        tags: tags || [],
        status: status || 'published',
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription || '',
        canonicalUrl: seoAttrs.canonicalUrl,
        publishedAt: rawPayload.publishedAt,
        readingTime: seoAttrs.readingTime,
        views: 0,
        author: author || 'Elena Rostova',
        faq: faq || []
      };

      let resultArticle;

      if (isSupabaseConfigured && supabaseClient) {
        const dbPayload = {
          title: articlePayload.title,
          slug: articlePayload.slug,
          content: articlePayload.content,
          excerpt: articlePayload.shortDescription,
          category: articlePayload.categoryId || null,
          tags: articlePayload.tags,
          status: articlePayload.status,
          featured_image: articlePayload.featuredImage,
          seo_title: articlePayload.seoTitle,
          meta_description: articlePayload.seoDescription,
          canonical_url: articlePayload.canonicalUrl,
          reading_time: articlePayload.readingTime,
          views: 0,
          author: articlePayload.author,
          faq: articlePayload.faq,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabaseClient
          .from('articles')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            dbPayload.slug = `${dbPayload.slug}-${Math.round(Math.random() * 1000)}`;
            const retryResult = await supabaseClient.from('articles').insert([dbPayload]).select().single();
            if (retryResult.error) throw retryResult.error;
            resultArticle = mapArticleFromDb(retryResult.data);
          } else {
            throw error;
          }
        } else {
          resultArticle = mapArticleFromDb(data);
        }
      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        const existsIdx = articlesList.findIndex(a => a.slug === articlePayload.slug);
        
        let uniqueSlug = articlePayload.slug;
        if (existsIdx !== -1) {
          uniqueSlug = `${articlePayload.slug}-${Date.now().toString().slice(-4)}`;
        }

        const fallbackItem = {
          ...articlePayload,
          id: `art-${Date.now()}`,
          slug: uniqueSlug
        };

        articlesList.unshift(fallbackItem);
        saveLocalFile(LOCAL_ARTICLES_FILE, articlesList);
        resultArticle = fallbackItem;
      }

      // Generate SEO sitemap/RSS files asynchronously
      triggerSeoRegeneration();

      // Return augmented article with real-time SEO OpenGraph and JSON-LD metadata fields
      const responseArticle = {
        ...resultArticle,
        openGraphMetadata: seoAttrs.openGraphMetadata,
        jsonLdSchema: seoAttrs.jsonLdSchema
      };

      return res.status(201).json({
        success: true,
        article: responseArticle,
        message: 'Article created and published successfully with auto-generated SEO metadata!'
      });

    } catch (err: any) {
      console.error('Error creating article:', err);
      return res.status(500).json({ error: 'Database error', message: err.message });
    }
  });

  // PUT /articles/:id -> Update article
  apiRouter.put('/articles/:id', authenticateAgent, validateBody(articleUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
      let updatedArticle = null;
      let existingObj: any = null;

      // Locate existing record to resolve attributes
      if (isSupabaseConfigured && supabaseClient) {
        let isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
        const lookupQuery = isUuid 
          ? supabaseClient.from('articles').select('*').eq('id', id)
          : supabaseClient.from('articles').select('*').eq('slug', id);

        const { data: existing, error: lookupError } = await lookupQuery.maybeSingle();
        if (lookupError || !existing) {
          return res.status(404).json({ error: 'Not found', message: `Article with ID/Slug "${id}" not found.` });
        }
        existingObj = mapArticleFromDb(existing);
      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        const match = articlesList.find(a => a.id === id || a.slug === id);
        if (!match) {
          return res.status(404).json({ error: 'Not Found', message: `Article with ID/Slug "${id}" not found.` });
        }
        existingObj = match;
      }

      // Resolve attributes and SEO configurations dynamically
      const mergedPayload = {
        ...existingObj,
        ...updates,
        publishedAt: updates.status === 'draft' ? null : (existingObj.publishedAt || new Date().toISOString())
      };

      const seoAttrs = await autoGenerateArticleAttributes(mergedPayload, existingObj);

      if (isSupabaseConfigured && supabaseClient) {
        const dbPayload: any = {
          updated_at: new Date().toISOString()
        };

        if (updates.title !== undefined) dbPayload.title = updates.title;
        dbPayload.slug = seoAttrs.slug;
        if (updates.content !== undefined) {
          dbPayload.content = updates.content;
          dbPayload.reading_time = seoAttrs.readingTime;
        }
        if (updates.shortDescription !== undefined) dbPayload.excerpt = updates.shortDescription;
        if (updates.categoryId !== undefined) {
          let catId = updates.categoryId;
          if (catId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(catId)) {
            const { data: cats } = await supabaseClient.from('categories').select('*');
            const match = (cats || []).find(c => c.slug === catId || c.name.toLowerCase() === catId.toLowerCase());
            if (match) catId = match.id;
          }
          dbPayload.category = catId || null;
        }
        if (updates.tags !== undefined) dbPayload.tags = updates.tags;
        if (updates.status !== undefined) dbPayload.status = updates.status;
        if (updates.featuredImage !== undefined) dbPayload.featured_image = updates.featuredImage;
        if (updates.seoTitle !== undefined) dbPayload.seo_title = updates.seoTitle;
        if (updates.seoDescription !== undefined) dbPayload.meta_description = updates.seoDescription;
        dbPayload.canonical_url = seoAttrs.canonicalUrl;
        if (updates.author !== undefined) dbPayload.author = updates.author;
        if (updates.faq !== undefined) dbPayload.faq = updates.faq;

        const { data: updatedData, error: updateError } = await supabaseClient
          .from('articles')
          .update(dbPayload)
          .eq('id', existingObj.id)
          .select()
          .single();

        if (updateError) throw updateError;
        updatedArticle = mapArticleFromDb(updatedData);

      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        const idx = articlesList.findIndex(a => a.id === existingObj.id);

        const updatedItem = {
          ...existingObj,
          ...updates,
          id: existingObj.id,
          slug: seoAttrs.slug,
          readingTime: seoAttrs.readingTime,
          canonicalUrl: seoAttrs.canonicalUrl,
          updatedAt: new Date().toISOString()
        };

        if (updates.shortDescription !== undefined) updatedItem.shortDescription = updates.shortDescription;
        if (updates.categoryId !== undefined) {
          let catId = updates.categoryId;
          const categories = loadLocalFile(LOCAL_CATEGORIES_FILE, DEFAULT_CATEGORIES);
          if (catId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(catId)) {
            const match = categories.find(c => c.slug === catId || c.name.toLowerCase() === catId.toLowerCase());
            if (match) catId = match.id;
          }
          updatedItem.categoryId = catId;
        }
        if (updates.seoDescription !== undefined) updatedItem.seoDescription = updates.seoDescription;
        if (updates.featuredImage !== undefined) updatedItem.featuredImage = updates.featuredImage;

        articlesList[idx] = updatedItem;
        saveLocalFile(LOCAL_ARTICLES_FILE, articlesList);
        updatedArticle = updatedItem;
      }

      // Generate SEO sitemap/RSS files asynchronously
      triggerSeoRegeneration();

      const responseArticle = {
        ...updatedArticle,
        openGraphMetadata: seoAttrs.openGraphMetadata,
        jsonLdSchema: seoAttrs.jsonLdSchema
      };

      return res.json({
        success: true,
        article: responseArticle,
        message: 'Article updated successfully with dynamic SEO indexing!'
      });

    } catch (err: any) {
      console.error('Error updating article:', err);
      return res.status(500).json({ error: 'Database error', message: err.message });
    }
  });

  // Mount the versioned API router under /api/v1
  app.use('/api/v1', apiRouter);

  // Mount on legacy /api for full, drop-in backwards compatibility with existing UI/CMS
  app.use('/api', apiRouter);

  // Expose convenient general documentation redirect paths
  app.get('/api/docs', (req, res) => res.redirect('/api/v1/docs'));
  app.get('/docs', (req, res) => res.redirect('/api/v1/docs'));

  // ==========================================
  // DYNAMIC SITEMAP & RSS SYNDICATION GENERATION
  // ==========================================

  app.get('/sitemap.xml', async (req, res) => {
    try {
      let articles: any[] = [];
      const SITE_BASE_URL = (process.env.APP_URL || 'https://netventures.online').trim();
      const baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;

      if (isSupabaseConfigured && supabaseClient) {
        const { data: dbArticles, error } = await supabaseClient
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbArticles) {
          articles = dbArticles
            .filter(art => (art.status || 'published').toString().toLowerCase() !== 'draft')
            .map(art => mapArticleFromDb(art));
        }
      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        articles = articlesList.filter((a: any) => (a.status || 'published').toString().toLowerCase() !== 'draft');
      }

      const currentDate = new Date().toISOString().split('T')[0];
      let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Core Static Pages -->
  <url>
    <loc>${baseDomain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseDomain}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseDomain}/about</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseDomain}/contact</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseDomain}/privacy</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseDomain}/terms</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseDomain}/disclosure</loc>
    <lastmod>2026-07-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
`;

      articles.forEach((art: any) => {
        const artDate = art.publishedAt ? new Date(art.publishedAt).toISOString().split('T')[0] : currentDate;
        sitemapXml += `  <url>
    <loc>${baseDomain}/blog/${art.slug}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      });

      sitemapXml += `</urlset>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(sitemapXml);
    } catch (err: any) {
      console.error('Error generating sitemap dynamically:', err);
      return res.status(500).send('Error generating sitemap');
    }
  });

  app.get('/rss.xml', async (req, res) => {
    try {
      let articles: any[] = [];
      let settings = {
        siteName: 'NetVentures',
        siteDescription: 'The premium online business magazine and resource center for making money online, AI tools, SaaS reviews, and digital automation.'
      };
      const SITE_BASE_URL = (process.env.APP_URL || 'https://netventures.online').trim();
      const baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;

      if (isSupabaseConfigured && supabaseClient) {
        // Fetch site settings
        const { data: settingsData } = await supabaseClient
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .maybeSingle();

        if (settingsData) {
          settings.siteName = settingsData.site_name || settings.siteName;
          settings.siteDescription = settingsData.site_description || settings.siteDescription;
        }

        // Fetch categories map
        const { data: categories } = await supabaseClient.from('categories').select('*');
        const categoriesMap: any = {};
        (categories || []).forEach(c => {
          categoriesMap[c.id] = c.name;
        });

        // Fetch articles
        const { data: dbArticles, error } = await supabaseClient
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbArticles) {
          articles = dbArticles
            .filter(art => (art.status || 'published').toString().toLowerCase() !== 'draft')
            .map(art => {
              const mapped: any = mapArticleFromDb(art);
              return {
                ...mapped,
                categoryName: categoriesMap[art.category] || categoriesMap[art.category_id] || 'Editorial'
              };
            });
        }
      } else {
        const articlesList = loadLocalFile(LOCAL_ARTICLES_FILE, DEFAULT_ARTICLES);
        const categories = loadLocalFile(LOCAL_CATEGORIES_FILE, DEFAULT_CATEGORIES);
        const categoriesMap: any = {};
        categories.forEach((c: any) => {
          categoriesMap[c.id] = c.name;
        });

        articles = articlesList
          .filter((a: any) => (a.status || 'published').toString().toLowerCase() !== 'draft')
          .map((art: any) => ({
            ...art,
            categoryName: categoriesMap[art.categoryId] || 'Editorial'
          }));
      }

      const escapeXml = (unsafe: string) => {
        if (!unsafe) return '';
        return unsafe
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(settings.siteName)}</title>
  <link>${baseDomain}</link>
  <description>${escapeXml(settings.siteDescription)}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseDomain}/rss.xml" rel="self" type="application/rss+xml" />
`;

      articles.forEach(art => {
        const pubDateFormatted = new Date(art.publishedAt || new Date()).toUTCString();
        rssXml += `  <item>
    <title>${escapeXml(art.title)}</title>
    <link>${baseDomain}/blog/${art.slug}</link>
    <description>${escapeXml(art.shortDescription)}</description>
    <author>${escapeXml(art.author)}</author>
    <category>${escapeXml(art.categoryName)}</category>
    <pubDate>${pubDateFormatted}</pubDate>
    <guid isPermaLink="true">${baseDomain}/blog/${art.slug}</guid>
  </item>\n`;
      });

      rssXml += `</channel>
</rss>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(rssXml);
    } catch (err: any) {
      console.error('Error generating rss dynamically:', err);
      return res.status(500).send('Error generating RSS feed');
    }
  });


  // ==========================================
  // VITE DEV SERVER & PRODUCTION STATIC SERVER
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    console.log('🚧 Starting server in development mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('🚀 Starting server in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Full-stack server running on http://localhost:${PORT}`);
    console.log(`🔒 Secure API key: ${process.env.AI_AGENT_API_KEY ? 'Set from env' : 'Using default dev key (netventures-agent-key-2026)'}`);
  });
}

start().catch(err => {
  console.error('Fatal server boot error:', err);
});
