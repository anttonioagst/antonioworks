import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  const user = process.env.DESIGN_SYSTEM_USER;
  const password = process.env.DESIGN_SYSTEM_PASSWORD;
  const authorization = request.headers.get('authorization');
  let allowed = false;

  if (user && password && authorization?.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authorization.slice(6), 'base64').toString('utf8');
      const separator = decoded.indexOf(':');
      allowed = separator > -1 &&
        equal(decoded.slice(0, separator), user) &&
        equal(decoded.slice(separator + 1), password);
    } catch {
      allowed = false;
    }
  }

  if (!allowed) {
    return new NextResponse('Acesso restrito ao design system.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Antonio Design System", charset="UTF-8"',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export const config = { matcher: '/design-system/:path*' };
