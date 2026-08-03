import { next } from '@vercel/functions';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Prevent redirect loop if already redirected or header indicates loop
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const redirectedFrom = request.headers.get('x-redirected-by');

  if (url.hostname === 'www.netventures.online' && !redirectedFrom) {
    url.hostname = 'netventures.online';
    url.protocol = `${proto}:`;
    const response = Response.redirect(url.toString(), 301);
    response.headers.set('x-redirected-by', 'middleware');
    return response;
  }

  return next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
