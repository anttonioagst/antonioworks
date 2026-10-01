'use client';

import { Analytics } from '@vercel/analytics/next';

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const pathname = new URL(event.url).pathname;
        return pathname === '/admin' || pathname.startsWith('/admin/') ? null : event;
      }}
    />
  );
}
