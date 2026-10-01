import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { analyticsDay, analyticsDailyKey, analyticsPagesKey, analyticsSourcesKey, analyticsTotalKey, isTrackedPath, visitorSetKey } from '@/lib/analytics-store';
import { redisCommand } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cookieName = 'portfolio-visitor';
const cookieAge = 60 * 60 * 24 * 365;
const sessionCookie = 'portfolio-session';
const sessionAge = 60 * 30;

function json(value: number | null, status = 200) {
  return NextResponse.json(value === null ? { error: 'Count unavailable' } : { value }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET() {
  try {
    return json(Number(await redisCommand('SCARD', visitorSetKey)));
  } catch {
    return json(null, 503);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return json(null, 403);
  let path = '/';
  let source = 'Direto';
  try {
    const payload = await request.json();
    if (typeof payload.path === 'string' && isTrackedPath(payload.path)) path = payload.path;
    if (typeof payload.source === 'string' && /^[a-zA-Z0-9._:-]{1,64}$/.test(payload.source)) source = payload.source.toLowerCase();
  } catch { /* Existing clients can still count a visit without a body. */ }

  const existing = request.cookies.get(cookieName)?.value;
  const visitorId = existing && /^[0-9a-f-]{36}$/i.test(existing) ? existing : randomUUID();
  const visitorHash = createHash('sha256').update(visitorId).digest('hex');
  const sessionId = request.cookies.get(sessionCookie)?.value;
  const isNewSession = !sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId);
  const day = analyticsDay();

  let response: NextResponse;
  try {
    await redisCommand('SADD', visitorSetKey, visitorHash);
    const newToday = Number(await redisCommand('SADD', `portfolio:analytics:visitors:${day}`, visitorHash)) === 1;
    await Promise.all([
      redisCommand('EXPIRE', `portfolio:analytics:visitors:${day}`, String(60 * 60 * 24 * 32)),
      redisCommand('HINCRBY', analyticsTotalKey, 'pageviews', '1'),
      redisCommand('HINCRBY', analyticsPagesKey, path, '1'),
      redisCommand('HINCRBY', analyticsDailyKey, `${day}:pageviews`, '1'),
      ...(newToday ? [redisCommand('HINCRBY', analyticsDailyKey, `${day}:visitors`, '1')] : []),
      ...(isNewSession ? [
        redisCommand('HINCRBY', analyticsTotalKey, 'visits', '1'),
        redisCommand('HINCRBY', analyticsDailyKey, `${day}:visits`, '1'),
        redisCommand('HINCRBY', analyticsSourcesKey, source, '1'),
      ] : []),
    ]);
    response = json(Number(await redisCommand('SCARD', visitorSetKey)));
  } catch {
    response = json(null, 503);
  }

  response.cookies.set(cookieName, visitorId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: cookieAge,
  });
  if (response.ok) response.cookies.set(sessionCookie, isNewSession ? randomUUID() : sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: sessionAge,
  });
  return response;
}
