import type { Snippet } from '@/lib/types';
import { clsx } from 'clsx';

interface SnippetCardProps {
  snippet: Snippet;
}

const DIFFICULTY_COLORS = {
  beginner: 'border-dcyfr-success/30 bg-dcyfr-success/10 text-dcyfr-success',
  intermediate: 'border-dcyfr-warning/30 bg-dcyfr-warning/10 text-dcyfr-warning',
  advanced: 'border-dcyfr-error/30 bg-dcyfr-error/10 text-dcyfr-error',
} as const;

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TS',
  bash: 'SH',
  python: 'PY',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'MD',
};

export function SnippetCard({ snippet }: Readonly<SnippetCardProps>) {
  return (
    <a
      href={`/snippets/${snippet.slug}`}
      className="group flex flex-col rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-4 hover:border-dcyfr-accent/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded border border-dcyfr-primary-600/40 bg-dcyfr-primary-800/60 px-1.5 py-0.5 text-xs font-mono font-medium text-dcyfr-accent-300">
          {LANGUAGE_LABELS[snippet.language] ?? snippet.language.toUpperCase()}
        </span>
        <span className={clsx('rounded-full border px-2 py-0.5 text-xs font-medium', DIFFICULTY_COLORS[snippet.difficulty])}>
          {snippet.difficulty}
        </span>
        {snippet.deprecated && (
          <span className="rounded-full border border-dcyfr-primary-600/40 bg-dcyfr-primary-800/40 px-2 py-0.5 text-xs text-dcyfr-primary-300 line-through">
            deprecated
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-white group-hover:text-dcyfr-accent-300 transition-colors mb-1">
        {snippet.title}
      </h3>
      <p className="text-xs text-dcyfr-primary-300 leading-relaxed line-clamp-2 flex-1">
        {snippet.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {snippet.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-dcyfr-primary-700/40 bg-dcyfr-primary-800/40 px-2 py-0.5 text-xs text-dcyfr-primary-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
