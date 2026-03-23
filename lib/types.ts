export type SnippetCategory =
  | 'Agent Patterns'
  | 'Delegation'
  | 'RAG'
  | 'Code Generation'
  | 'CLI'
  | 'Infrastructure'
  | 'Context Engineering'
  | 'Testing';

export type SnippetDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type SnippetLanguage = 'typescript' | 'bash' | 'python' | 'json' | 'yaml' | 'markdown';

export interface Snippet {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: SnippetCategory;
  difficulty: SnippetDifficulty;
  language: SnippetLanguage;
  tags: string[];
  code: string;
  explanation: string;
  relatedSnippets: string[]; // snippet ids
  sourceFile?: string; // .claude/skills/ path
  dcyfrAiVersion?: string; // minimum @dcyfr/ai version
  deprecated?: boolean;
}
