import type { MetadataRoute } from 'next';
import snippets from '@/data/snippets.json';
import type { Snippet, SnippetCategory } from '@/lib/types';

const BASE = 'https://dcyfr.codes';

const CATEGORIES: SnippetCategory[] = [
  'Agent Patterns',
  'Delegation',
  'RAG',
  'Code Generation',
  'Context Engineering',
  'CLI',
  'Infrastructure',
  'Testing',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/snippets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const snippetRoutes: MetadataRoute.Sitemap = (snippets as Snippet[])
    .filter((s) => !s.deprecated)
    .map((s) => ({
      url: `${BASE}/snippets/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/categories/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...snippetRoutes, ...categoryRoutes];
}
