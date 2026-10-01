import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.domain;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}${site.qualityPanel.href}`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/experience`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
