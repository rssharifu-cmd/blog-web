import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function devApiRoutesPlugin() {
  return {
    name: 'dev-api-routes',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : '';
        let targetFile: string | null = null;
        if (
          url === '/sitemap_index.xml' ||
          url === '/api/sitemap-index.xml' ||
          url === '/api/sitemap-index'
        ) {
          targetFile = '/api/sitemap-index.ts';
        } else if (
          url === '/post-sitemap.xml' ||
          url === '/api/post-sitemap.xml' ||
          url === '/api/post-sitemap'
        ) {
          targetFile = '/api/post-sitemap.ts';
        } else if (
          url === '/page-sitemap.xml' ||
          url === '/api/page-sitemap.xml' ||
          url === '/api/page-sitemap'
        ) {
          targetFile = '/api/page-sitemap.ts';
        } else if (
          url === '/sitemap.xml' ||
          url === '/api/sitemap.xml' ||
          url === '/api/sitemap'
        ) {
          targetFile = '/api/sitemap.xml.ts';
        } else if (
          url === '/rss.xml' ||
          url === '/api/rss.xml' ||
          url === '/api/rss'
        ) {
          targetFile = '/api/rss.xml.ts';
        }

        if (targetFile) {
          try {
            const mod = await server.ssrLoadModule(targetFile);
            if (mod && mod.default) {
              if (!res.status) {
                res.status = (code: number) => {
                  res.statusCode = code;
                  return res;
                };
              }
              if (!res.send) {
                res.send = (body: any) => {
                  res.end(body);
                  return res;
                };
              }
              await mod.default(req, res);
              return;
            }
          } catch (err) {
            console.error('Error serving dynamic route in dev:', err);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
