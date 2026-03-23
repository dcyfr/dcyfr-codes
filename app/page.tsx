import type { Metadata } from 'next';
import snippets from '@/data/snippets.json';
import type { Snippet, SnippetCategory } from '@/lib/types';
import { SnippetCard } from '@/components/SnippetCard';

export const metadata: Metadata = {
  title: 'DCYFR Codes — Agent patterns, delegation recipes, and RAG pipelines',
};

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

export default function HomePage() {
  const typed = snippets as Snippet[];

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    snippets: typed.filter((s) => s.category === cat && !s.deprecated),
  })).filter((g) => g.snippets.length > 0);

  const recent = typed
    .filter((s) => !s.deprecated)
    .slice(0, 6);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            DCYFR Codes
          </h1>
          <p className="text-dcyfr-primary-300 text-lg max-w-2xl leading-relaxed">
            Production-ready code patterns and recipes for the DCYFR ecosystem.
            Copy, adapt, ship.
          </p>
          <div className="mt-4">
            <a
              href="/snippets"
              className="inline-flex items-center gap-2 rounded-lg bg-dcyfr-accent-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dcyfr-accent-600"
            >
              Browse all snippets →
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Snippets', value: typed.filter(s => !s.deprecated).length },
            { label: 'Categories', value: byCategory.length },
            { label: 'Languages', value: new Set(typed.map(s => s.language)).size },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4 text-center"
            >
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-dcyfr-primary-300 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <section className="mb-12" aria-label="Recent snippets">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-dcyfr-primary-300 uppercase tracking-wider">Snippets</h2>
            <a href="/snippets" className="text-xs text-dcyfr-primary-300 hover:text-white transition-colors">
              All snippets →
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section aria-label="Browse by category">
          <h2 className="text-sm font-medium text-dcyfr-primary-300 uppercase tracking-wider mb-4">Categories</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory.map(({ category, snippets: cats }) => (
              <a
                key={category}
                href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4 hover:border-dcyfr-accent/40 transition-colors"
              >
                <p className="font-medium text-white group-hover:text-dcyfr-accent-300 transition-colors">{category}</p>
                <p className="text-xs text-dcyfr-primary-300 mt-1">
                  {cats.length} {cats.length === 1 ? 'snippet' : 'snippets'}
                </p>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
