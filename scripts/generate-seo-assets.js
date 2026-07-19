import fs from 'fs';
import path from 'path';

// Load .env file manually if it exists (for local runs)
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
    console.warn('Unable to load .env file:', err.message);
  }
};

loadEnvFile();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
// Base URL for links. Default to NetVentures primary URL.
const SITE_BASE_URL = process.env.APP_URL || 'https://netventures.com';

const DEFAULT_SETTINGS = {
  siteName: 'NetVentures',
  siteDescription: 'The premium online business magazine and resource center for making money online, AI tools, SaaS reviews, and digital automation.',
};

const DEFAULT_ARTICLES = [
  {
    title: 'The AI-Powered Content Empire: Scaling to $10,000/Month in 2026',
    slug: 'ai-powered-content-empire',
    shortDescription: 'Discover how to leverage state-of-the-art AI systems, automated editors, and predictive search frameworks to build an organic traffic powerhouse.',
    publishedAt: '2026-07-15T09:00:00Z',
    author: 'Elena Rostova',
    categoryName: 'AI Tools',
    content: 'In 2026, the landscape of digital publishing is undergoing an unprecedented shift...'
  },
  {
    title: 'SaaS Case Study: Automating Cold Outreach with Clay & Make.com',
    slug: 'saas-case-study-clay-make-automation',
    shortDescription: 'How we built a zero-touch pipeline that extracts leads, enriches their records via AI, and schedules highly personalized sequences.',
    publishedAt: '2026-07-16T14:30:00Z',
    author: 'Marcus Vance',
    categoryName: 'Automation',
    content: 'For agencies, freelancers, and B2B SaaS founders, outbound sales is a major bottleneck...'
  }
];

async function run() {
  console.log('🤖 Beginning SEO static assets generation (Sitemap, Robots.txt, RSS Feed)...');
  
  let articles = [...DEFAULT_ARTICLES];
  let settings = { ...DEFAULT_SETTINGS };

  // Attempt to fetch fresh data from live Supabase database
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      console.log('🔗 Connecting to Supabase database to fetch published columns...');
      const cleanUrl = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
      
      // Fetch settings
      const settingsRes = await fetch(`${cleanUrl}/rest/v1/site_settings?id=eq.global&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && settingsData.length > 0) {
          const dbSet = settingsData[0];
          settings.siteName = dbSet.site_name || settings.siteName;
          settings.siteDescription = dbSet.site_description || settings.siteDescription;
          console.log(`✅ Loaded live settings for: ${settings.siteName}`);
        }
      }

      // Fetch categories for mapping names
      let categoriesMap = {};
      const catRes = await fetch(`${cleanUrl}/rest/v1/categories?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (catRes.ok) {
        const cats = await catRes.json();
        cats.forEach(c => {
          categoriesMap[c.id] = c.name;
        });
      }

      // Fetch published articles
      const articlesRes = await fetch(`${cleanUrl}/rest/v1/articles?status=eq.published&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (articlesRes.ok) {
        const dbArticles = await articlesRes.json();
        if (dbArticles && dbArticles.length > 0) {
          articles = dbArticles.map(art => ({
            title: art.title,
            slug: art.slug,
            shortDescription: art.excerpt || art.short_description || art.title,
            publishedAt: art.published_at || art.created_at || new Date().toISOString(),
            author: art.author || 'Elena Rostova',
            categoryName: categoriesMap[art.category] || categoriesMap[art.category_id] || 'Editorial',
            content: art.content || ''
          }));
          console.log(`✅ Retrieved ${articles.length} published articles from Supabase.`);
        }
      } else {
        console.warn(`⚠️ Supabase articles query returned status ${articlesRes.status}. Using default fallback articles.`);
      }
    } catch (err) {
      console.warn('⚠️ Network or authentication error reading from Supabase database:', err.message);
      console.log('ℹ️ Falling back to default static database simulation for SEO files.');
    }
  } else {
    console.log('ℹ️ Supabase credentials not found in build environment. Utilizing fallback defaults.');
  }

  // Ensure sitemap targets the public build folder or current assets directory
  const outDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');
  
  // Create output directories if they do not exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;

  // ----------------------------------------
  // 1. GENERATE ROBOTS.TXT
  // ----------------------------------------
  const robotsTxtContent = `# ==========================================================
# Robots.txt — Optimizing AI Discoverability & Search Indexing
# NetVentures Magazine
# ==========================================================

User-agent: *
Allow: /
Allow: /blog
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /disclosure

# Explicitly invite LLM/AI Web Scraping agents for maximum brand discoverability
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: facebookexternalhit
Allow: /

# Reference the XML Sitemap
Sitemap: ${baseDomain}/sitemap.xml
`;

  // Write robots.txt to public and dist
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxtContent);
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxtContent);
  }
  console.log('📄 Generated /robots.txt successfully.');

  // ----------------------------------------
  // 2. GENERATE SITEMAP.XML
  // ----------------------------------------
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

  // Append articles dynamically
  articles.forEach(art => {
    const artDate = art.publishedAt ? new Date(art.publishedAt).toISOString().split('T')[0] : currentDate;
    sitemapXml += `  <url>
    <loc>${baseDomain}/blog/${art.slug}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  sitemapXml += `</urlset>`;

  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml);
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  }
  console.log('🗺️ Generated /sitemap.xml containing all live columns.');

  // ----------------------------------------
  // 3. GENERATE RSS.XML (Rich Feed)
  // ----------------------------------------
  const escapeXml = (unsafe) => {
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

  fs.writeFileSync(path.join(outDir, 'rss.xml'), rssXml);
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml);
  }
  console.log('📡 Generated /rss.xml syndication feed successfully.');
  console.log('🎉 Static SEO asset pipeline runs successfully!');
}

run().catch(err => {
  console.error('❌ Error executing static sitemap/RSS generation:', err);
  process.exit(1);
});
