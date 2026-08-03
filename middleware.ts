import { next } from '@vercel/functions';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Redirect www domain to canonical root domain if needed
  if (url.hostname === 'www.netventures.online') {
    url.hostname = 'netventures.online';
    return Response.redirect(url.toString(), 301);
  }

  return next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
