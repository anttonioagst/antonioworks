'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = new Set(['/', '/projects', '/projects/painel-de-qualidade', '/experience', '/contact']);

export function trafficSource(): string {
  const campaign = new URLSearchParams(location.search).get('utm_source')?.trim().toLowerCase();
  if (campaign && /^[a-z0-9._-]{1,60}$/.test(campaign)) return `utm:${campaign}`;
  if (!document.referrer) return 'Direto';
  try {
    const host = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, '');
    return host === location.hostname.replace(/^www\./, '') ? 'Interno' : host.slice(0, 64);
  } catch {
    return 'Direto';
  }
}

export function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (coarse && innerWidth < 768) return 'mobile';
  if (coarse) return 'tablet';
  return 'desktop';
}

export function Analytics() {
  const path = usePathname();

  useEffect(() => {
    if (!publicPaths.has(path) || path === '/') return;
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, source: trafficSource(), device: deviceType() }),
      cache: 'no-store',
      keepalive: true,
    }).catch(() => undefined);
  }, [path]);

  useEffect(() => {
    if (!publicPaths.has(path)) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest<HTMLElement>('a, button, [role="button"]');
      if (!control) return;
      const section = control.closest('section');
      const sectionName = control.closest('nav') ? 'Navegação' :
        section?.querySelector('h2, h1')?.textContent?.trim() ||
        (path === '/contact' ? 'Contato' : path === '/experience' ? 'Experiência' : path.startsWith('/projects') ? 'Projetos' : 'Página');
      const label = (control.getAttribute('aria-label') || control.textContent || control.getAttribute('href') || '').replace(/\s+/g, ' ').trim();
      if (!label) return;
      const payload = JSON.stringify({ path, section: sectionName.slice(0, 80), label: label.slice(0, 80) });
      if (!navigator.sendBeacon?.('/api/analytics/click', new Blob([payload], { type: 'application/json' }))) {
        fetch('/api/analytics/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => undefined);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [path]);

  return null;
}
