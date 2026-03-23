import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import snippets from '@/data/snippets.json';
import type { Snippet } from '@/lib/types';
import { CopyButton } from '@/components/CopyButton';
import { GistButton } from '@/components/GistButton';
import { clsx } from 'clsx';

interface Props {
  params: Promise<{ slug: string }>;
}

const DIFFICULTY_COLORS = {
  beginner: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  intermediate: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  advanced: 'border-red-500/30 bg-red-500/10 text-red-300',
} as const;

export async function generateStaticParams() {
  return (snippets as Snippet[]).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snippet = (snippets as Snippet[]).find((s) => s.slug === slug);
  if (!snippet) return {};
  return {
    title: snippet.title,
    description: snippet.description,
    openGraph: {
      title: `${snippet.title} — DCYFR Codes`,
      description: snippet.description,
      url: `https://dcyfr.codes/snippets/${snippet.slug}`,
    },
  };
}

export default async function SnippetPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  const snippet = (snippets as Snippet[]).find((s) => s.slug === slug);
  if (!snippet) notFound();

  const related = (snippets as Snippet[]).filter(
    (s) => snippet.relatedSnippets.includes(s.id) && !s.deprecated,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: snippet.title,
            description: snippet.description,
            programmingLanguage: snippet.language,
            url: `https://dcyfr.codes/snippets/${snippet.slug}`,
            publisher: { '@type': 'Organization', name: 'DCYFR', url: 'https://dcyfr.codes' },
          }),
        }}
      />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-dcyfr-primary-300" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">dcyfr.codes</a>
            <span aria-hidden="true">/</span>
            <a href="/snippets" className="hover:text-white transition-colors">Snippets</a>
            <span aria-hidden="true">/</span>
            <span className="text-dcyfr-primary-200" aria-current="page">{snippet.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={clsx('rounded-full border px-2.5 py-0.5 text-xs font-medium', DIFFICULTY_COLORS[snippet.difficulty])}>
                    {snippet.difficulty}
                  </span>
                  <span className="rounded border border-dcyfr-primary-600/40 bg-dcyfr-primary-800/60 px-1.5 py-0.5 text-xs font-mono text-dcyfr-accent-300">
                    {snippet.language}
                  </span>
                  {snippet.deprecated && (
                    <span className="rounded-full border border-dcyfr-primary-600/40 bg-dcyfr-primary-800/40 px-2 py-0.5 text-xs text-dcyfr-primary-300">
                      deprecated
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{snippet.title}</h1>
                <p className="text-dcyfr-primary-300 leading-relaxed">{snippet.description}</p>
              </div>

              {/* Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-white">Code</h2>
                  <div className="flex items-center gap-2">
                    <CopyButton code={snippet.code} />
                    <GistButton snippet={snippet} />
                  </div>
                </div>
                <div className="code-block">
                  <pre><code>{snippet.code}</code></pre>
                </div>
              </div>

              {/* Explanation */}
              {snippet.explanation && (
                <div>
                  <h2 className="text-sm font-medium text-white mb-2">How it works</h2>
                  <p className="text-dcyfr-primary-300 leading-relaxed text-sm">{snippet.explanation}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Meta */}
              <div className="rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4">
                <h2 className="font-semibold text-white mb-3 text-sm">Details</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-dcyfr-primary-300">Category</dt>
                    <dd className="text-white">{snippet.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dcyfr-primary-300">Difficulty</dt>
                    <dd className="text-white capitalize">{snippet.difficulty}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dcyfr-primary-300">Language</dt>
                    <dd className="text-white">{snippet.language}</dd>
                  </div>
                  {snippet.dcyfrAiVersion && (
                    <div className="flex justify-between">
                      <dt className="text-dcyfr-primary-300">@dcyfr/ai</dt>
                      <dd className="font-mono text-xs text-dcyfr-accent-300">{snippet.dcyfrAiVersion}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4">
                  <h2 className="font-semibold text-white mb-3 text-sm">Tags</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {snippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-dcyfr-primary-600/40 bg-dcyfr-primary-800/60 px-2.5 py-0.5 text-xs text-dcyfr-primary-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related */}
              {related.length > 0 && (
                <div className="rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4">
                  <h2 className="font-semibold text-white mb-3 text-sm">Related Snippets</h2>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.id}>
                        <a
                          href={`/snippets/${r.slug}`}
                          className="text-sm text-dcyfr-primary-300 hover:text-white transition-colors"
                        >
                          {r.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {/* Back */}
          <div className="mt-10">
            <a href="/snippets" className="text-sm text-dcyfr-primary-300 hover:text-white transition-colors">
              ← All snippets
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
