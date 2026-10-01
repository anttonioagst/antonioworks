import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { analyticsClicksKey, analyticsDailyKey, analyticsDay, analyticsTotalKey, isTrackedPath } from '@/lib/analytics-store';
import { redisCommand } from '@/lib/redis';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return new NextResponse(null, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return new NextResponse(null, { status: 415 });

  let path: string;
  let section: string;
  let label: string;
  try {
    const body = await request.text();
    if (body.length > 512) return new NextResponse(null, { status: 413 });
    const payload = JSON.parse(body);
    path = payload.path;
    section = payload.section;
    label = payload.label;
    if (!isTrackedPath(path) || typeof section !== 'string' || !section || section.length > 80 || typeof label !== 'string' || !label || label.length > 80) {
      return new NextResponse(null, { status: 400 });
    }
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const identity = request.cookies.get('portfolio-visitor')?.value || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const rateKey = `portfolio:analytics:click-rate:${createHash('sha256').update(identity).digest('hex')}`;
  const day = analyticsDay();
  try {
    const rate = Number(await redisCommand('INCR', rateKey));
    if (rate === 1) await redisCommand('EXPIRE', rateKey, '60');
    if (rate > 120) return new NextResponse(null, { status: 204 });
    await Promise.all([
      redisCommand('HINCRBY', analyticsTotalKey, 'clicks', '1'),
      redisCommand('HINCRBY', analyticsDailyKey, `${day}:clicks`, '1'),
      redisCommand('HINCRBY', analyticsClicksKey, JSON.stringify([path, section, label]), '1'),
    ]);
    return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
