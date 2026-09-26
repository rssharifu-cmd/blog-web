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

    const tagNameMap = new Map<string, string>();
    const tagCounts = new Map<string, number>();

    if (SUPABASE_URL && SUPABASE_KEY) {
      const cleanUrl = resolveSupabaseUrl(SUPABASE_URL);

      const [tagRes, artRes] = await Promise.all([
        fetch(`${cleanUrl}/rest/v1/tags?select=slug,name&order=name.asc`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }),
        fetch(`${cleanUrl}/rest/v1/articles?select=tags,status&order=created_at.desc&limit=1000`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }),
      ]);

      if (tagRes.ok) {
        const tagRows = await tagRes.json();
        (tagRows || []).forEach((tag: any) => {
          const tagSlug = (tag.slug && tag.slug.trim()) ? tag.slug.trim() : slugify(tag.name || '');
          if (tagSlug) {
            tagNameMap.set(tagSlug, tag.name || tagSlug);
          }
        });
      } else {
        console.error('Supabase tags fetch failed:', tagRes.status, await tagRes.text());
      }

      if (artRes.ok) {
        const artRows = await artRes.json();
        const published = (artRows || []).filter(
          (a: any) => (a.status || 'published').toString().toLowerCase() !== 'draft'
        );
        published.forEach((art: any) => {
          if (Array.isArray(art.tags)) {
            art.tags.forEach((t: any) => {
              const tSlug = (t || '').toString().trim();
              if (tSlug) {
                tagCounts.set(tSlug, (tagCounts.get(tSlug) || 0) + 1);
              }
            });
          }
        });
      } else {
        console.error('Supabase articles fetch for tag counts failed:', artRes.status, await artRes.text());
      }
    }

    const qualifyingTagSlugs = Array.from(tagCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([slug]) => slug);

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    qualifyingTagSlugs.forEach((slug) => {
      sitemapXml += `  <url>
    <loc>${baseDomain}/blog/tag/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    sitemapXml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemapXml);
  } catch (err: any) {
    console.error('Error generating tag sitemap:', err);
    res.status(500).send('Error generating tag sitemap');
  }
}
