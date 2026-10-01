import { contactMessagesKey, listContactSubmissions } from '@/lib/contact-store';
import { redisCommand } from '@/lib/redis';

export const visitorSetKey = 'portfolio:unique-visitors:v1';
export const analyticsTotalKey = 'portfolio:analytics:total:v1';
export const analyticsPagesKey = 'portfolio:analytics:pages:v1';
export const analyticsSourcesKey = 'portfolio:analytics:sources:v1';
export const analyticsClicksKey = 'portfolio:analytics:clicks:v1';
export const analyticsDailyKey = 'portfolio:analytics:daily:v1';
export const analyticsDevicesKey = 'portfolio:analytics:devices:v1';
export const analyticsCountriesKey = 'portfolio:analytics:countries:v1';
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

export const analyticsPeriods = [7, 14, 30] as const;
export type AnalyticsPeriod = (typeof analyticsPeriods)[number];

type Day = { date: string; visitors: number; visits: number; pageviews: number; clicks: number; messages: number };
type Totals = { visits: number; pageviews: number; clicks: number; messages: number };

export type AnalyticsSummary = {
  period: AnalyticsPeriod;
  updatedAt: string;
  sample: boolean;
  uniqueVisitors: number;
  visits: number;
  pageviews: number;
  clicks: number;
  messages: number;
  current: Totals;
  previous: Totals;
  resumeQrScans: number;
  resumeQrVisitors: number;
  days: Day[];
  pages: { name: string; count: number }[];
  sources: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  targets: { path: string; section: string; label: string; count: number }[];
  latestMessage: { name: string; submittedAt: string } | null;
};

function lastDays(count: number): string[] {
  const today = analyticsDay();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - (count - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

function sum(days: Day[]): Totals {
  return days.reduce((total, day) => ({
    visits: total.visits + day.visits,
    pageviews: total.pageviews + day.pageviews,
    clicks: total.clicks + day.clicks,
    messages: total.messages + day.messages,
  }), { visits: 0, pageviews: 0, clicks: 0, messages: 0 });
}

const ranked = (values: Record<string, number>) => Object.entries(values).map(([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count);

export async function getAnalyticsSummary(period: AnalyticsPeriod = 14): Promise<AnalyticsSummary> {
  const span = lastDays(period * 2);
  const metrics = ['visitors', 'visits', 'pageviews', 'clicks'] as const;
  const dailyFields = span.flatMap((day) => metrics.map((metric) => `${day}:${metric}`));
  const [uniqueResult, totalsResult, pagesResult, sourcesResult, clicksResult, dailyResult, qrScansResult, qrVisitorsResult, devicesResult, countriesResult, messageCount, messages] = await Promise.all([
    redisCommand('SCARD', visitorSetKey),
    redisCommand('HGETALL', analyticsTotalKey),
    redisCommand('HGETALL', analyticsPagesKey),
    redisCommand('HGETALL', analyticsSourcesKey),
    redisCommand('HGETALL', analyticsClicksKey),
    redisCommand('HMGET', analyticsDailyKey, ...dailyFields),
    redisCommand('GET', resumeQrScanKey),
    redisCommand('SCARD', resumeQrVisitorKey),
    redisCommand('HGETALL', analyticsDevicesKey),
    redisCommand('HGETALL', analyticsCountriesKey),
    redisCommand('LLEN', contactMessagesKey),
    listContactSubmissions().catch(() => []),
  ]);
  const totals = hashToRecord(totalsResult);
  const daily = Array.isArray(dailyResult) ? dailyResult :
    dailyResult && typeof dailyResult === 'object' ? dailyFields.map((field) => (dailyResult as Record<string, unknown>)[field]) : [];
  const messagesByDay: Record<string, number> = {};
  for (const message of messages) {
    const day = analyticsDay(new Date(message.submittedAt));
    messagesByDay[day] = (messagesByDay[day] ?? 0) + 1;
  }
  const days: Day[] = span.map((date, index) => ({
    date,
    visitors: Number(daily[index * 4]) || 0,
    visits: Number(daily[index * 4 + 1]) || 0,
    pageviews: Number(daily[index * 4 + 2]) || 0,
    clicks: Number(daily[index * 4 + 3]) || 0,
    messages: messagesByDay[date] ?? 0,
  }));

  return {
    period,
    updatedAt: new Date().toISOString(),
    sample: false,
    uniqueVisitors: Number(uniqueResult) || 0,
    visits: totals.visits ?? 0,
    pageviews: totals.pageviews ?? 0,
    clicks: totals.clicks ?? 0,
    messages: Number(messageCount) || 0,
    current: sum(days.slice(period)),
    previous: sum(days.slice(0, period)),
    resumeQrScans: Number(qrScansResult) || 0,
    resumeQrVisitors: Number(qrVisitorsResult) || 0,
    days: days.slice(period),
    pages: ranked(hashToRecord(pagesResult)),
    sources: ranked(hashToRecord(sourcesResult)),
    devices: ranked(hashToRecord(devicesResult)),
    countries: ranked(hashToRecord(countriesResult)),
    targets: ranked(hashToRecord(clicksResult)).flatMap(({ name, count }) => {
      try {
        const [path, section, label] = JSON.parse(name);
        if (typeof path === 'string' && typeof section === 'string' && typeof label === 'string') return [{ path, section, label, count }];
      } catch { /* Ignore invalid legacy entries. */ }
      return [];
    }).slice(0, 20),
    latestMessage: messages[0] ? { name: messages[0].name, submittedAt: messages[0].submittedAt } : null,
  };
}

/** Deterministic sample used only by `next dev` when Redis is not configured, so the layout can be reviewed. */
export function sampleAnalyticsSummary(period: AnalyticsPeriod = 14): AnalyticsSummary {
  const wave = (index: number, base: number, spread: number) => Math.max(0, Math.round(base + Math.sin(index * 1.7) * spread + Math.cos(index * 0.6) * spread * 0.6));
  const days: Day[] = lastDays(period * 2).map((date, index) => {
    const visits = wave(index, 9 + index * 0.25, 5);
    return { date, visitors: Math.round(visits * 0.8), visits, pageviews: Math.round(visits * 2.6), clicks: Math.round(visits * 1.4), messages: index % 9 === 4 ? 1 : 0 };
  });
  return {
    period,
    updatedAt: new Date().toISOString(),
    sample: true,
    uniqueVisitors: 412, visits: 538, pageviews: 1391, clicks: 702, messages: 6,
    current: sum(days.slice(period)),
    previous: sum(days.slice(0, period)),
    resumeQrScans: 23, resumeQrVisitors: 19,
    days: days.slice(period),
    pages: [{ name: '/', count: 538 }, { name: '/projects', count: 221 }, { name: '/projects/painel-de-qualidade', count: 164 }, { name: '/experience', count: 189 }, { name: '/contact', count: 61 }],
    sources: [{ name: 'Direto', count: 241 }, { name: 'linkedin.com', count: 168 }, { name: 'github.com', count: 41 }, { name: 'utm:curriculo_qr', count: 23 }, { name: 'Interno', count: 12 }],
    devices: [{ name: 'mobile', count: 302 }, { name: 'desktop', count: 221 }, { name: 'tablet', count: 15 }],
    countries: [{ name: 'BR', count: 497 }, { name: 'PT', count: 21 }, { name: 'US', count: 20 }],
    targets: [
      { path: '/', section: 'Contato', label: 'LinkedIn', count: 88 },
      { path: '/', section: 'Contato', label: 'Currículo', count: 71 },
      { path: '/', section: 'Projetos', label: 'Painel de Qualidade', count: 64 },
      { path: '/projects/painel-de-qualidade', section: 'Projetos', label: 'Vamos conversar', count: 17 },
    ],
    latestMessage: { name: 'Exemplo', submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  };
}
