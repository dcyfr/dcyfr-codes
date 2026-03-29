'use client';

import { useState } from 'react';
import type { Snippet } from '@/lib/types';

interface GistButtonProps {
  snippet: Snippet;
}

const EXTENSIONS: Record<string, string> = {
  typescript: 'ts',
  bash: 'sh',
  python: 'py',
  json: 'json',
  yaml: 'yaml',
  markdown: 'md',
};

export function GistButton({ snippet }: Readonly<GistButtonProps>) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [gistUrl, setGistUrl] = useState<string | null>(null);

  async function handleCreateGist() {
    setState('loading');
    const ext = EXTENSIONS[snippet.language] ?? 'txt';
    const filename = `${snippet.slug}.${ext}`;

    try {
      const res = await fetch('/api/gist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `${snippet.title} — dcyfr.codes`,
          public: true,
          files: { [filename]: { content: snippet.code } },
        }),
      });

      if (!res.ok) throw new Error('Gist creation failed');
      const { url } = await res.json() as { url: string };
      setGistUrl(url);
      setState('done');
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  if (state === 'done' && gistUrl) {
    return (
      <a
        href={gistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-dcyfr-success/40 bg-dcyfr-success/10 px-3 py-1.5 text-xs font-medium text-dcyfr-success hover:text-white transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        View Gist ↗
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCreateGist}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 rounded-lg border border-dcyfr-primary-600/60 px-3 py-1.5 text-xs font-medium text-dcyfr-primary-200 hover:border-dcyfr-accent/40 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Create GitHub Gist"
    >
      {state === 'loading' ? (
        <>
          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Creating...
        </>
      ) : state === 'error' ? (
        <span className="text-dcyfr-error">Error — retry</span>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Copy to Gist
        </>
      )}
    </button>
  );
}
