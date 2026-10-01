import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { resumeQrScanKey, resumeQrVisitorKey } from '@/lib/analytics-store';
import { redisCommand } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cookieName = 'portfolio-visitor';

export async function GET(request: NextRequest) {
  const existing = request.cookies.get(cookieName)?.value;
  const hasValidVisitor = Boolean(existing && /^[0-9a-f-]{36}$/i.test(existing));
  const visitorId = hasValidVisitor ? existing! : randomUUID();
  const visitorHash = createHash('sha256').update(visitorId).digest('hex');

  try {
    await Promise.all([
      redisCommand('INCR', resumeQrScanKey),
      redisCommand('SADD', resumeQrVisitorKey, visitorHash),
    ]);
  } catch { /* A storage outage must not break the QR destination. */ }

  const response = NextResponse.redirect(new URL('/?utm_source=curriculo_qr', request.url), 307);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  if (!hasValidVisitor) response.cookies.set(cookieName, visitorId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: new URL('/?utm_source=curriculo_qr', request.url).toString(),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
