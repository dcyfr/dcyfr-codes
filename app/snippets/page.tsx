'use client';

import { useState, useMemo } from 'react';
import snippetsData from '@/data/snippets.json';
import type { Snippet, SnippetCategory, SnippetDifficulty, SnippetLanguage } from '@/lib/types';
import { SnippetCard } from '@/components/SnippetCard';

const snippets = (snippetsData as Snippet[]).filter((s) => !s.deprecated);

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

const DIFFICULTIES: SnippetDifficulty[] = ['beginner', 'intermediate', 'advanced'];
const LANGUAGES: SnippetLanguage[] = ['typescript', 'bash', 'python', 'json', 'yaml'];

export default function SnippetsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SnippetCategory | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<SnippetDifficulty | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<SnippetLanguage | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return snippets.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (activeDifficulty && s.difficulty !== activeDifficulty) return false;
      if (activeLanguage && s.language !== activeLanguage) return false;
      if (q) {
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, activeCategory, activeDifficulty, activeLanguage]);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-2">All Snippets</h1>
        <p className="text-dcyfr-primary-300 mb-8">{snippets.length} production-ready code patterns.</p>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dcyfr-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-dcyfr-primary-400 focus:border-dcyfr-accent/60 focus:outline-none focus:ring-1 focus:ring-dcyfr-accent/40"
            aria-label="Search snippets"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-8">
          {/* Category */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeCategory === null ? 'border-dcyfr-accent-700 bg-dcyfr-accent-700 text-white' : 'border-dcyfr-primary-700/60 bg-dcyfr-primary-800/40 text-dcyfr-primary-300 hover:border-dcyfr-accent/40'}`}
            >
              All
            </button>
            {CATEGORIES.filter((c) => snippets.some((s) => s.category === c)).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeCategory === cat ? 'border-dcyfr-accent-700 bg-dcyfr-accent-700 text-white' : 'border-dcyfr-primary-700/60 bg-dcyfr-primary-800/40 text-dcyfr-primary-300 hover:border-dcyfr-accent/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty + Language */}
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.filter((d) => snippets.some((s) => s.difficulty === d)).map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(activeDifficulty === diff ? null : diff)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${activeDifficulty === diff ? 'border-dcyfr-accent-700 bg-dcyfr-accent-700 text-white' : 'border-dcyfr-primary-700/60 bg-dcyfr-primary-800/40 text-dcyfr-primary-300 hover:border-dcyfr-accent/40'}`}
              >
                {diff}
              </button>
            ))}
            {LANGUAGES.filter((l) => snippets.some((s) => s.language === l)).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(activeLanguage === lang ? null : lang)}
                className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${activeLanguage === lang ? 'border-dcyfr-accent-700 bg-dcyfr-accent-700 text-white' : 'border-dcyfr-primary-700/60 bg-dcyfr-primary-800/40 text-dcyfr-primary-300 hover:border-dcyfr-accent/40'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dcyfr-primary-800/40 bg-dcyfr-primary-900/40 p-10 text-center">
            <p className="text-dcyfr-primary-300">No snippets match your filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null); setActiveDifficulty(null); setActiveLanguage(null); }}
              className="mt-3 text-sm text-dcyfr-accent-300 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-dcyfr-primary-300 mb-4">{filtered.length} snippet{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
