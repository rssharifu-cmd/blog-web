const CANONICAL_SITE_URL = 'https://www.netventures.online';
const rawAppUrl = (process.env.APP_URL || '').trim();
const SITE_BASE_URL = (rawAppUrl && !rawAppUrl.includes('run.app') && !rawAppUrl.includes('aistudio')) ? rawAppUrl : CANONICAL_SITE_URL;

export default async function handler(req: any, res: any) {
  try {
    let reqHost = (req?.headers?.['x-forwarded-host'] || req?.headers?.host || '').toString().split(',')[0].trim();
    let baseDomain = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL.slice(0, -1) : SITE_BASE_URL;
    if (reqHost && !reqHost.includes('localhost') && !reqHost.includes('127.0.0.1') && !reqHost.includes('run.app') && !reqHost.includes('aistudio')) {
      const proto = (req?.headers?.['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
      baseDomain = `${proto}://${reqHost}`;
    }
    const currentDate = new Date().toISOString().split('T')[0];

    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/blog', priority: '0.9', changefreq: 'daily' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
      { path: '/terms', priority: '0.4', changefreq: 'yearly' },
      { path: '/disclosure', priority: '0.4', changefreq: 'yearly' },
    ];

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    staticPages.forEach((page) => {
      const pageLoc = page.path === '/' ? `${baseDomain}/` : `${baseDomain}${page.path}`;
      sitemapXml += `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    sitemapXml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemapXml);
  } catch (err: any) {
    console.error('Error generating page sitemap:', err);
    res.status(500).send('Error generating page sitemap');
  }
}
