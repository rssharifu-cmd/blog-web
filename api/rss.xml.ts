const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''
).trim();
const CANONICAL_SITE_URL = 'https://www.netventures.online';
const rawAppUrl = (process.env.APP_URL || '').trim();
const SITE_BASE_URL = (rawAppUrl && !rawAppUrl.includes('run.app') && !rawAppUrl.includes('aistudio')) ? rawAppUrl : CANONICAL_SITE_URL;

const DEFAULT_SETTINGS = {
  siteName: 'NetVentures',
  siteDescription:
    'The premium online business magazine and resource center for making money online, AI tools, SaaS reviews, and digital automation.',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function resolveSupabaseUrl(raw: string): string {
  let url = raw;
  if (url && !url.includes('://')) {
    url = `https://${url}.supabase.co`;
  }
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: any, res: any) {
  try {
    let reqHost = (req?.headers?.['x-forwarded-host'] || req?.headers?.host || '').toString().split(',')[0].trim();
    let baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;
    if (reqHost && !reqHost.includes('localhost') && !reqHost.includes('127.0.0.1') && !reqHost.includes('run.app') && !reqHost.includes('aistudio')) {
      const proto = (req?.headers?.['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
      baseDomain = `${proto}://${reqHost}`;
    }
    let settings = { ...DEFAULT_SETTINGS };

    let articles: Array<{
      slug?: string;
      title?: string;
      excerpt?: string;
      short_description?: string;
      author?: string;
      published_at?: string;
      created_at?: string;
      status?: string;
      categoryName?: string;
      category?: string;
      category_id?: string;
    }> = [];

    if (SUPABASE_URL && SUPABASE_KEY) {
      const cleanUrl = resolveSupabaseUrl(SUPABASE_URL);
      const headers = {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      };

      try {
        const settingsRes = await fetch(`${cleanUrl}/rest/v1/site_settings?id=eq.global&select=*`, { headers });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData && settingsData.length > 0) {
            const dbSet = settingsData[0];
            settings.siteName = dbSet.site_name || settings.siteName;
            settings.siteDescription = dbSet.site_description || settings.siteDescription;
          }
        }
      } catch (e) {
        console.warn('Could not load site_settings:', e);
      }

      let categoriesMap: Record<string, string> = {};
      try {
        const catRes = await fetch(`${cleanUrl}/rest/v1/categories?select=*`, { headers });
        if (catRes.ok) {
          const cats = await catRes.json();
          (cats || []).forEach((c: any) => {
            categoriesMap[c.id] = c.name;
            categoriesMap[c.slug] = c.name;
          });
        }
      } catch (e) {
        console.warn('Could not load categories:', e);
      }

      const articlesRes = await fetch(
        `${cleanUrl}/rest/v1/articles?select=slug,title,short_description,author,published_at,created_at,status,category_id&order=created_at.desc&limit=1000`,
        { headers }
      );
      if (articlesRes.ok) {
        const rows = await articlesRes.json();
        articles = (rows || [])
          .filter((a: any) => (a.status || 'published').toString().toLowerCase() !== 'draft')
          .map((a: any) => ({
            ...a,
            categoryName: categoriesMap[a.category_id] || 'Editorial',
          }));
      } else {
        console.error('Supabase articles fetch failed:', articlesRes.status, await articlesRes.text());
      }
    } else {
      console.warn('Supabase env vars not set — falling back to local articles repository.');
    }

    if (articles.length === 0) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const localPath = path.resolve(process.cwd(), 'src', 'data', 'local_articles.json');
        if (fs.existsSync(localPath)) {
          const localArts = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
          articles = localArts.map((a: any) => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt || a.shortDescription,
            short_description: a.shortDescription || a.excerpt,
            author: a.author,
            categoryName: a.categoryName,
            published_at: a.publishedAt,
            created_at: a.publishedAt
          }));
        }
      } catch (e) {
        console.error('Local articles fallback error:', e);
      }
    }

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

    articles.forEach((art) => {
      const slug = (art.slug && art.slug.trim()) ? art.slug.trim() : slugify(art.title || '');
      if (!slug) return;
      const pubDate = new Date(art.published_at || art.created_at || Date.now()).toUTCString();
      rssXml += `  <item>
    <title>${escapeXml(art.title || '')}</title>
    <link>${baseDomain}/blog/${slug}</link>
    <description>${escapeXml(art.excerpt || art.short_description || '')}</description>
    <author>${escapeXml(art.author || '')}</author>
    <category>${escapeXml(art.categoryName || '')}</category>
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="true">${baseDomain}/blog/${slug}</guid>
  </item>\n`;
    });

    rssXml += `</channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(rssXml);
  } catch (err: any) {
    console.error('Error generating RSS feed:', err);
    res.status(500).send('Error generating RSS feed');
  }
}
