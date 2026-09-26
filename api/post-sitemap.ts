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

export default async function handler(req: any, res: any) {
  try {
    let reqHost = (req?.headers?.['x-forwarded-host'] || req?.headers?.host || '').toString().split(',')[0].trim();
    let baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;
    if (reqHost && !reqHost.includes('localhost') && !reqHost.includes('127.0.0.1') && !reqHost.includes('run.app') && !reqHost.includes('aistudio')) {
      const proto = (req?.headers?.['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
      baseDomain = `${proto}://${reqHost}`;
    }
    const currentDate = new Date().toISOString().split('T')[0];

    let articles: Array<{ slug?: string; title?: string; published_at?: string; created_at?: string }> = [];

    if (SUPABASE_URL && SUPABASE_KEY) {
      const cleanUrl = resolveSupabaseUrl(SUPABASE_URL);
      const response = await fetch(
        `${cleanUrl}/rest/v1/articles?select=slug,title,published_at,created_at,status&order=created_at.desc&limit=1000`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const rows = await response.json();
        articles = (rows || []).filter(
          (a: any) => (a.status || 'published').toString().toLowerCase() !== 'draft'
        );
      } else {
        console.error('Supabase articles fetch failed:', response.status, await response.text());
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
            published_at: a.publishedAt,
            created_at: a.publishedAt
          }));
        }
      } catch (e) {
        console.error('Local articles fallback error:', e);
      }
    }

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    const seenSlugs = new Set<string>();
    articles.forEach((art) => {
      const slug = (art.slug && art.slug.trim()) ? art.slug.trim() : slugify(art.title || '');
      if (!slug || seenSlugs.has(slug)) return;
      seenSlugs.add(slug);

      const rawDate = art.published_at || art.created_at;
      const artDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : currentDate;

      sitemapXml += `  <url>
    <loc>${baseDomain}/blog/${slug}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    sitemapXml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemapXml);
  } catch (err: any) {
    console.error('Error generating post sitemap:', err);
    res.status(500).send('Error generating post sitemap');
  }
}
