import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// 1. ENVIRONMENT & SUPABASE INITIALIZATION
// ---------------------------------------------------------------------------
const loadEnvFile = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          let val = trimmed.substring(index + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      });
    }
  } catch (err) {
    console.warn('⚠️ Unable to load .env file:', err.message);
  }
};

loadEnvFile();

let rawSupabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
if (rawSupabaseUrl) {
  if (!rawSupabaseUrl.includes('://')) {
    rawSupabaseUrl = `https://${rawSupabaseUrl}.supabase.co`;
  }
  rawSupabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}
const SUPABASE_URL = rawSupabaseUrl;
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''
).trim();

const SITE_BASE_URL = 'https://www.netventures.online';
const DEFAULT_IMAGE = `${SITE_BASE_URL}/uploads/stefan-sharf.jpg`;
const SITE_NAME = 'NetVentures';

// Default static articles for fallback
const DEFAULT_ARTICLES = [
  {
    title: 'The AI-Powered Content Empire: Scaling to $10,000/Month in 2026',
    slug: 'ai-powered-content-empire',
    short_description: 'Discover how to leverage state-of-the-art AI systems, automated editors, and predictive search frameworks to build an organic traffic powerhouse.',
    featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
    seo_title: 'How to Build an AI Content Empire in 2026 - NetVentures',
    seo_description: 'Step-by-step blueprint to build, scale, and monetize a high-authority blog using generative AI and advanced workflow automation.'
  },
  {
    title: 'SaaS Case Study: Automating Cold Outreach with Clay & Make.com',
    slug: 'saas-case-study-clay-make-automation',
    short_description: 'How we built a zero-touch pipeline that extracts leads, enriches their records via AI, and schedules highly personalized sequences.',
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80',
    seo_title: 'B2B Lead Generation Automation Case Study - NetVentures',
    seo_description: 'Read our comprehensive SaaS case study demonstrating how Clay, Make.com, and Gemini API automate hyper-targeted business development.'
  }
];

// Helper to escape HTML and attribute values
const escapeHtml = (str) => (str || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const escapeAttr = (str) => (str || '')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const slugify = (text) => (text || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

// Clean text description
const cleanDescription = (text) => (text || '')
  .replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 160);

// Generate Head Meta Block
function generateMetaBlock({ title, description, canonicalUrl, ogType = 'website', ogImage = DEFAULT_IMAGE }) {
  let finalImage = ogImage || DEFAULT_IMAGE;
  if (finalImage.startsWith('/')) {
    finalImage = `${SITE_BASE_URL}${finalImage}`;
  }

  return `<!--SSR_META-->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph (Facebook, LinkedIn, Slack, Discord) -->
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${escapeAttr(finalImage)}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${escapeAttr(finalImage)}" />
    <!--/SSR_META-->`;
}

// Replace <head> meta tags in the template HTML
function applyMetaToTemplate(templateHtml, pageData) {
  const metaBlock = generateMetaBlock(pageData);

  if (templateHtml.includes('<!--SSR_META-->') && templateHtml.includes('<!--/SSR_META-->')) {
    const startIdx = templateHtml.indexOf('<!--SSR_META-->');
    const endIdx = templateHtml.indexOf('<!--/SSR_META-->') + '<!--/SSR_META-->'.length;
    return templateHtml.slice(0, startIdx) + metaBlock.trim() + templateHtml.slice(endIdx);
  }

  // Fallback: replace individually or inject before </head>
  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(pageData.title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${escapeAttr(pageData.description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${pageData.canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${escapeAttr(pageData.title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${escapeAttr(pageData.description)}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/gi, `<meta property="og:type" content="${pageData.ogType || 'website'}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${pageData.canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${escapeAttr(pageData.ogImage || DEFAULT_IMAGE)}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${escapeAttr(pageData.title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${escapeAttr(pageData.description)}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${escapeAttr(pageData.ogImage || DEFAULT_IMAGE)}" />`);

  return html;
}

// ---------------------------------------------------------------------------
// 2. MAIN STATIC PAGE GENERATION LOGIC
// ---------------------------------------------------------------------------
async function generatePages() {
  console.log('🚀 Starting build-time static HTML page generation for SEO routes...');

  const distDir = path.resolve(process.cwd(), 'dist');
  const distIndexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(distIndexPath)) {
    console.error('❌ Error: dist/index.html not found! Please run "vite build" before this script.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(distIndexPath, 'utf-8');

  // -------------------------------------------------------------------------
  // Fetch Articles (Supabase + Local Files + Defaults)
  // -------------------------------------------------------------------------
  const articleMap = new Map();

  // 1. Load Defaults
  DEFAULT_ARTICLES.forEach(art => {
    articleMap.set(art.slug, art);
  });

  // 2. Load Local Articles JSON
  const localArticlesPath = path.resolve(process.cwd(), 'src', 'data', 'local_articles.json');
  if (fs.existsSync(localArticlesPath)) {
    try {
      const localArts = JSON.parse(fs.readFileSync(localArticlesPath, 'utf-8'));
      localArts.forEach(art => {
        if ((art.status || 'published').toString().toLowerCase() !== 'draft') {
          const slug = (art.slug && art.slug.trim()) ? art.slug.trim() : slugify(art.title);
          if (slug) {
            articleMap.set(slug, {
              title: art.title,
              slug: slug,
              short_description: art.shortDescription || art.short_description || art.title,
              featured_image: art.featuredImage || art.featured_image || DEFAULT_IMAGE,
              seo_title: art.seoTitle || art.seo_title,
              seo_description: art.seoDescription || art.seo_description || art.meta_description
            });
          }
        }
      });
      console.log(`📂 Loaded articles from src/data/local_articles.json`);
    } catch (e) {
      console.warn('⚠️ Could not load local_articles.json:', e.message);
    }
  }

  // 3. Fetch live Supabase Articles if credentials exist
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      console.log('🔗 Fetching articles from Supabase REST API...');
      const cleanUrl = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
      const res = await fetch(`${cleanUrl}/rest/v1/articles?select=*&order=created_at.desc&limit=1000`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });

      if (res.ok) {
        const rows = await res.json();
        const published = (rows || []).filter(a => (a.status || 'published').toString().toLowerCase() !== 'draft');
        published.forEach(art => {
          const slug = (art.slug && art.slug.trim()) ? art.slug.trim() : slugify(art.title);
          if (slug) {
            articleMap.set(slug, {
              title: art.title,
              slug: slug,
              short_description: art.short_description || art.shortDescription || art.meta_description || art.excerpt || art.title,
              featured_image: art.featured_image || art.featuredImage || DEFAULT_IMAGE,
              seo_title: art.seo_title || art.seoTitle,
              seo_description: art.seo_description || art.seoDescription || art.meta_description
            });
          }
        });
        console.log(`✅ Loaded ${published.length} published articles from Supabase`);
      } else {
        console.warn(`⚠️ Supabase returned status ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      console.warn('⚠️ Failed to connect to Supabase (using local & fallback articles):', err.message);
    }
  }

  // -------------------------------------------------------------------------
  // Static Routes Configuration
  // -------------------------------------------------------------------------
  const staticRoutes = [
    {
      routePath: 'about',
      title: 'About Us & Leadership - NetVentures',
      description: 'Stefan Sharf is the Founder & CEO of NetVentures, an independent digital publication covering SaaS, AI tools, web hosting, automation, and online business technology.',
      canonicalUrl: `${SITE_BASE_URL}/about`,
      ogType: 'profile',
      ogImage: DEFAULT_IMAGE
    },
    {
      routePath: 'blog',
      title: 'The NetVentures Library - NetVentures',
      description: 'Browse our premium library of digital strategies, SaaS case studies, and passive income blueprints.',
      canonicalUrl: `${SITE_BASE_URL}/blog`,
      ogType: 'website',
      ogImage: DEFAULT_IMAGE
    },
    {
      routePath: 'contact',
      title: 'Contact Inquiries - NetVentures',
      description: 'Get in touch with our administrative or editorial desk for general inquiries, SaaS reviews, or sponsorships.',
      canonicalUrl: `${SITE_BASE_URL}/contact`,
      ogType: 'website',
      ogImage: DEFAULT_IMAGE
    },
    {
      routePath: 'privacy',
      title: 'Privacy Protocol - NetVentures',
      description: 'Our clear data storage, cookie transparency, and editorial security parameters.',
      canonicalUrl: `${SITE_BASE_URL}/privacy`,
      ogType: 'website',
      ogImage: DEFAULT_IMAGE
    },
    {
      routePath: 'terms',
      title: 'Terms & Conditions - NetVentures',
      description: 'Intellectual property, compliance mandates, and consulting liability limitations.',
      canonicalUrl: `${SITE_BASE_URL}/terms`,
      ogType: 'website',
      ogImage: DEFAULT_IMAGE
    },
    {
      routePath: 'disclosure',
      title: 'Affiliate Marketing Disclosure - NetVentures',
      description: 'FTC disclosure and partnership details explaining digital server asset funding.',
      canonicalUrl: `${SITE_BASE_URL}/disclosure`,
      ogType: 'website',
      ogImage: DEFAULT_IMAGE
    }
  ];

  let generatedCount = 0;

  // 1. Generate Static Pages (/about, /blog, /contact, /privacy, /terms, /disclosure)
  for (const page of staticRoutes) {
    const pageHtml = applyMetaToTemplate(templateHtml, page);
    const targetDir = path.join(distDir, page.routePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
    generatedCount++;
    console.log(`📄 Generated: dist/${page.routePath}/index.html`);
  }

  // 2. Generate Blog Post Pages (/blog/:slug)
  for (const [slug, art] of articleMap.entries()) {
    const rawTitle = (art.seo_title || art.title || '').trim();
    const title = rawTitle.toLowerCase().includes('netventures') ? rawTitle : `${rawTitle} - NetVentures`;
    const description = cleanDescription(art.seo_description || art.short_description || art.title);
    const canonicalUrl = `${SITE_BASE_URL}/blog/${slug}`;
    const ogImage = art.featured_image || DEFAULT_IMAGE;

    const pageData = {
      title,
      description,
      canonicalUrl,
      ogType: 'article',
      ogImage
    };

    const pageHtml = applyMetaToTemplate(templateHtml, pageData);
    const targetDir = path.join(distDir, 'blog', slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
    generatedCount++;
    console.log(`📝 Generated: dist/blog/${slug}/index.html`);
  }

  // 3. Generate valid-routes.json for Vercel Edge Middleware
  const staticPaths = [
    '/',
    '/search',
    '/admin',
    ...staticRoutes.map(page => `/${page.routePath}`)
  ];
  const blogPaths = Array.from(articleMap.keys()).map(slug => `/blog/${slug}`);
  const allValidRoutes = Array.from(new Set([...staticPaths, ...blogPaths])).sort();

  // Write to public/valid-routes.json (for repo and middleware build-time import)
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicRoutesFile = path.join(publicDir, 'valid-routes.json');
  fs.writeFileSync(publicRoutesFile, JSON.stringify(allValidRoutes, null, 2), 'utf-8');
  console.log(`📋 Generated: public/valid-routes.json (${allValidRoutes.length} valid routes)`);

  // Write to dist/valid-routes.json (for build output)
  const distRoutesFile = path.join(distDir, 'valid-routes.json');
  fs.writeFileSync(distRoutesFile, JSON.stringify(allValidRoutes, null, 2), 'utf-8');
  console.log(`📋 Generated: dist/valid-routes.json (${allValidRoutes.length} valid routes)`);

  // 4. Ensure 404.html exists in dist/
  const public404File = path.join(publicDir, '404.html');
  const dist404File = path.join(distDir, '404.html');
  if (fs.existsSync(public404File) && !fs.existsSync(dist404File)) {
    fs.copyFileSync(public404File, dist404File);
    console.log('📄 Copied: public/404.html -> dist/404.html');
  }

  console.log(`\n🎉 Successfully generated ${generatedCount} static HTML pages in dist/!`);
}

generatePages().catch(err => {
  console.error('❌ Static HTML page generation failed:', err);
  process.exit(1);
});
