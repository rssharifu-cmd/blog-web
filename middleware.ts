import validRoutesList from './public/valid-routes.json';

// Build a fast lookup Set of all valid published routes
const validRoutes = new Set<string>(validRoutesList);

// NetVentures branded 404 HTML served with HTTP 404 status
const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 - Page Not Found | NetVentures</title>
  <meta name="description" content="The page or article you are looking for does not exist, has been removed, or was relocated." />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0b0f19;
      color: #f3f4f6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 1.5;
      padding: 1.5rem;
    }
    .header {
      max-width: 72rem;
      margin: 0 auto;
      width: 100%;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #ffffff;
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
    }
    .brand-badge {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-weight: 900;
      font-size: 1rem;
    }
    .brand span {
      color: #eab308;
    }
    .main-container {
      max-width: 38rem;
      margin: auto;
      text-align: center;
      padding: 2.5rem 1.5rem;
    }
    .code-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 1.25rem;
      background-color: #182234;
      border: 1px solid #283548;
      color: #eab308;
      font-size: 1.75rem;
      font-weight: 800;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.025em;
      margin-bottom: 0.75rem;
    }
    p {
      color: #9ca3af;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #eab308;
      color: #000000;
    }
    .btn-primary:hover {
      background-color: #facc15;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background-color: #182234;
      color: #f3f4f6;
      border: 1px solid #283548;
    }
    .btn-secondary:hover {
      background-color: #222f46;
      color: #ffffff;
      transform: translateY(-1px);
    }
    .footer {
      max-width: 72rem;
      margin: 0 auto;
      width: 100%;
      padding: 1rem 0;
      text-align: center;
      color: #6b7280;
      font-size: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    @media (max-width: 640px) {
      h1 {
        font-size: 1.65rem;
      }
      .actions {
        flex-direction: column;
      }
      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <a href="/" class="brand">
      <div class="brand-badge">N</div>
      <div>Net<span>Ventures</span></div>
    </a>
  </header>

  <main class="main-container">
    <div class="code-badge">404</div>
    <h1>Page Not Found</h1>
    <p>
      The page or article you are looking for does not exist, has been removed, or was relocated. 
      Please check the URL or return to our library to explore active insights.
    </p>
    <div class="actions">
      <a href="/" class="btn btn-primary">Return to Homepage</a>
      <a href="/blog" class="btn btn-secondary">Browse All Articles</a>
    </div>
  </main>

  <footer class="footer">
    &copy; NetVentures &middot; Autonomous Intelligence &amp; Digital Strategies
  </footer>
</body>
</html>`;

/**
 * Vercel Edge Middleware
 * Intercepts requests before the edge cache and routing layer.
 * If a request begins with /blog/ but is not in valid-routes.json,
 * it returns HTTP 404 status with the branded 404 page.
 */
export function middleware(request: Request): Response {
  const url = new URL(request.url);
  let pathname = url.pathname;

  // Normalize path by removing trailing slash (unless root "/")
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // 1. Static assets, files with extensions, and upload paths pass through immediately
  if (
    pathname.includes('.') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/uploads/') ||
    pathname.startsWith('/favicon')
  ) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' }
    });
  }

  // 2. API routes pass through immediately
  if (pathname.startsWith('/api/')) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' }
    });
  }

  // 3. Blog route validation: check if requested article path exists
  if (pathname.startsWith('/blog/')) {
    const isKnownArticle = validRoutes.has(pathname) || validRoutes.has(pathname.toLowerCase());

    if (!isKnownArticle) {
      // Non-existent article slug: Return true HTTP 404 with noindex robots tag
      return new Response(NOT_FOUND_HTML, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }

  // 4. Pass-through all other requests (e.g. /, /about, /blog, /contact, valid /blog/:slug)
  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });
}

export default middleware;
