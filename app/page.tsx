import type { Metadata } from 'next';
import Link from 'next/link';
import snippets from '@/data/snippets.json';
import type { Snippet, SnippetCategory } from '@/lib/types';
import { SnippetCard } from '@/components/SnippetCard';
import { DcyfrButton } from '@/components/ui/dcyfr-button';
import { DcyfrBadge } from '@/components/ui/dcyfr-badge';

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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            DCYFR Codes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Production-ready code patterns and recipes for the DCYFR ecosystem.
            Copy, adapt, ship.
          </p>
          <div className="mt-4">
            <DcyfrButton asChild variant="brand">
              <Link href="/snippets">Browse all snippets →</Link>
            </DcyfrButton>
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
              className="rounded-xl border border-input/60 bg-card/60 p-4 text-center"
            >
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <section className="mb-12" aria-label="Recent snippets">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Snippets</h2>
            <DcyfrButton asChild variant="ghostly" size="sm">
              <Link href="/snippets" className="text-muted-foreground">
                All snippets →
              </Link>
            </DcyfrButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section aria-label="Browse by category">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Categories</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory.map(({ category, snippets: cats }) => (
              <a
                key={category}
                href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group rounded-xl border border-input/60 bg-card/60 p-4 hover:border-secure/40 transition-colors"
              >
                <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {category}
                </p>
                <DcyfrBadge
                  variant="info"
                  size="sm"
                  className="mt-1 border-0 bg-transparent px-0 text-muted-foreground"
                >
                  {cats.length} {cats.length === 1 ? 'snippet' : 'snippets'}
                </DcyfrBadge>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
