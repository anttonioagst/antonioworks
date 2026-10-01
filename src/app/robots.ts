import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.domain;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/cv'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
