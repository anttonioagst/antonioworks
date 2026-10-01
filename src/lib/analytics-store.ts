import { redisCommand } from '@/lib/redis';

export const visitorSetKey = 'portfolio:unique-visitors:v1';
export const analyticsTotalKey = 'portfolio:analytics:total:v1';
export const analyticsPagesKey = 'portfolio:analytics:pages:v1';
export const analyticsSourcesKey = 'portfolio:analytics:sources:v1';
export const analyticsClicksKey = 'portfolio:analytics:clicks:v1';
export const analyticsDailyKey = 'portfolio:analytics:daily:v1';
export const resumeQrScanKey = 'portfolio:analytics:resume-qr:scans:v1';
export const resumeQrVisitorKey = 'portfolio:analytics:resume-qr:visitors:v1';
export const trackedPaths = ['/', '/projects', '/projects/painel-de-qualidade', '/experience', '/contact'] as const;

export function analyticsDay(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function isTrackedPath(path: string): path is (typeof trackedPaths)[number] {
  return trackedPaths.includes(path as (typeof trackedPaths)[number]);
}

function hashToRecord(value: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  const entries = Array.isArray(value) ? Array.from({ length: Math.floor(value.length / 2) }, (_, index) => [value[index * 2], value[index * 2 + 1]]) :
    value && typeof value === 'object' ? Object.entries(value) : [];
  for (const [field, raw] of entries) {
    const key = String(field);
    const count = Number(raw);
    if (Number.isFinite(count)) result[key] = count;
  }
  return result;
}

export type AnalyticsSummary = {
  uniqueVisitors: number;
  visits: number;
  pageviews: number;
  clicks: number;
  resumeQrScans: number;
  resumeQrVisitors: number;
  days: { date: string; visitors: number; visits: number; pageviews: number; clicks: number }[];
  pages: { name: string; count: number }[];
  sources: { name: string; count: number }[];
  targets: { path: string; section: string; label: string; count: number }[];
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const today = analyticsDay();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - (13 - index));
    return date.toISOString().slice(0, 10);
  });
  const dailyFields = days.flatMap((day) => ['visitors', 'visits', 'pageviews', 'clicks'].map((metric) => `${day}:${metric}`));
  const [uniqueResult, totalsResult, pagesResult, sourcesResult, clicksResult, dailyResult, qrScansResult, qrVisitorsResult] = await Promise.all([
    redisCommand('SCARD', visitorSetKey),
    redisCommand('HGETALL', analyticsTotalKey),
    redisCommand('HGETALL', analyticsPagesKey),
    redisCommand('HGETALL', analyticsSourcesKey),
    redisCommand('HGETALL', analyticsClicksKey),
    redisCommand('HMGET', analyticsDailyKey, ...dailyFields),
    redisCommand('GET', resumeQrScanKey),
    redisCommand('SCARD', resumeQrVisitorKey),
  ]);
  const totals = hashToRecord(totalsResult);
  const pages = hashToRecord(pagesResult);
  const sources = hashToRecord(sourcesResult);
  const clicks = hashToRecord(clicksResult);
  const daily = Array.isArray(dailyResult) ? dailyResult :
    dailyResult && typeof dailyResult === 'object' ? dailyFields.map((field) => (dailyResult as Record<string, unknown>)[field]) : [];
  const ranked = (values: Record<string, number>) => Object.entries(values).map(([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count);

  return {
    uniqueVisitors: Number(uniqueResult) || 0,
    visits: totals.visits ?? 0,
    pageviews: totals.pageviews ?? 0,
    clicks: totals.clicks ?? 0,
    resumeQrScans: Number(qrScansResult) || 0,
    resumeQrVisitors: Number(qrVisitorsResult) || 0,
    days: days.map((date, index) => ({
      date,
      visitors: Number(daily[index * 4]) || 0,
      visits: Number(daily[index * 4 + 1]) || 0,
      pageviews: Number(daily[index * 4 + 2]) || 0,
      clicks: Number(daily[index * 4 + 3]) || 0,
    })),
    pages: ranked(pages),
    sources: ranked(sources),
    targets: ranked(clicks).flatMap(({ name, count }) => {
      try {
        const [path, section, label] = JSON.parse(name);
        if (typeof path === 'string' && typeof section === 'string' && typeof label === 'string') return [{ path, section, label, count }];
      } catch { /* Ignore invalid legacy entries. */ }
      return [];
    }).slice(0, 20),
  };
}
