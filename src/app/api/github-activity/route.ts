import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://github.com/users/anttonioagst/contributions', {
      headers: { Accept: 'text/html', 'User-Agent': 'AntonioPortfolio/1.0' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const html = await response.text();
    const match = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,.]+)/);
    const days = [...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"/g)]
      .map((entry) => ({ date: entry[1], level: Number(entry[2]) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    if (!match || days.length < 300) throw new Error('GitHub contributions markup changed');
    return NextResponse.json({ total: Number(match[1].replace(/[,.]/g, '')), days });
  } catch {
    return NextResponse.json({ error: 'Atividade indisponível' }, { status: 503 });
  }
}
