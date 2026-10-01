import { NextResponse } from 'next/server';
import { redisCommand } from '@/lib/redis';

const snapshotKey = 'portfolio:github-activity:last-good';
const snapshotAge = 60 * 60 * 24 * 7;

type Activity = {
  total: number;
  days: { date: string; level: number; count: number }[];
  updatedAt: string;
};

async function getActivity(): Promise<Activity> {
  const response = await fetch('https://github.com/users/anttonioagst/contributions', {
    headers: { Accept: 'text/html', 'User-Agent': 'AntonioPortfolio/1.0' },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const html = await response.text();
  const match = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,.]+)/);
  const days = [...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[^>]*><\/td>\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>/g)]
    .map((entry) => ({ date: entry[1], level: Number(entry[2]), count: Number(entry[3].match(/^(\d[\d,]*) contributions?/)?.[1].replace(/,/g, '') || 0) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!match || days.length < 300) throw new Error('GitHub contributions markup changed');
  return { total: Number(match[1].replace(/[,.]/g, '')), days, updatedAt: new Date().toISOString() };
}

export async function GET() {
  try {
    const activity = await getActivity();
    try {
      await redisCommand('SET', snapshotKey, JSON.stringify(activity), 'EX', String(snapshotAge));
    } catch { /* Live GitHub data remains available without Redis. */ }
    return NextResponse.json(activity);
  } catch {
    try {
      const saved = await redisCommand('GET', snapshotKey);
      if (typeof saved === 'string') {
        const activity = JSON.parse(saved) as Activity;
        if (Number.isFinite(activity.total) && Array.isArray(activity.days) && activity.days.length >= 300) {
          return NextResponse.json({ ...activity, stale: true }, { headers: { 'Cache-Control': 'no-store' } });
        }
      }
    } catch { /* The client can retry when both sources are unavailable. */ }
    return NextResponse.json({ error: 'Atividade indisponível' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
