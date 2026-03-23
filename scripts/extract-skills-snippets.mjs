#!/usr/bin/env node
/**
 * extract-skills-snippets.mjs — .claude/skills/ + examples/ → snippets.json
 *
 * Scans the dcyfr-workspace for:
 *   1. .claude/skills/<name>/ directories — reads the skill markdown for code examples
 *   2. dcyfr-ai/examples/ — reads standalone TypeScript/JavaScript examples
 *
 * Outputs publishable snippets to data/snippets.json.
 *
 * Snippet frontmatter (YAML in the first code block comment or a separate .snip.yml file):
 *   # snip:title: Basic Delegation Contract
 *   # snip:description: Delegate a task to a subagent with typed inputs
 *   # snip:category: Delegation
 *   # snip:difficulty: beginner
 *   # snip:tags: [delegation, agents, "@dcyfr/ai"]
 *   # snip:publish: true
 *
 * Usage:
 *   node scripts/extract-skills-snippets.mjs
 *   node scripts/extract-skills-snippets.mjs --workspace-root /path/to/dcyfr-workspace
 *   node scripts/extract-skills-snippets.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const wsFlag = args.indexOf('--workspace-root');
const wsRoot = wsFlag >= 0
  ? args[wsFlag + 1]
  : path.resolve(import.meta.dirname, '../../../../');

const outputPath = path.resolve(import.meta.dirname, '../data/snippets.json');

const SCAN_PATHS = [
  { dir: path.join(wsRoot, '.claude/skills'), type: 'skill' },
  { dir: path.join(wsRoot, 'dcyfr-ai/examples'), type: 'example' },
  { dir: path.join(wsRoot, 'dcyfr-ai-nodejs/examples'), type: 'example' },
];

const LANG_BY_EXT = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'typescript',
  '.mjs': 'typescript',
  '.sh': 'bash',
  '.bash': 'bash',
  '.py': 'python',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.md': 'markdown',
};

const CATEGORY_PATTERNS = [
  { pattern: /delegat/i, category: 'Delegation' },
  { pattern: /context|checkpoint|window|attention/i, category: 'Context Engineering' },
  { pattern: /rag|retriev|embed|vector/i, category: 'RAG' },
  { pattern: /code.?gen|generat/i, category: 'Code Generation' },
  { pattern: /cli|command/i, category: 'CLI' },
  { pattern: /docker|k8s|kubernetes|infra/i, category: 'Infrastructure' },
  { pattern: /test|vitest|jest|playwright/i, category: 'Testing' },
];

function inferCategory(title, tags) {
  const text = `${title} ${tags.join(' ')}`.toLowerCase();
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category;
  }
  return 'Agent Patterns';
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parse # snip:key: value annotations from code comments.
 */
function parseSnipAnnotations(content) {
  const meta = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^[/#*\s]*snip:(\w+):\s*(.+)$/);
    if (!match) continue;
    const [, key, value] = match;
    let parsed = value.trim();
    if (parsed.startsWith('[') && parsed.endsWith(']')) {
      parsed = parsed.slice(1, -1).split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
    } else if (parsed === 'true') {
      parsed = true;
    } else if (parsed === 'false') {
      parsed = false;
    }
    meta[key] = parsed;
  }
  return meta;
}

function extractCodeBlocks(mdContent) {
  const blocks = [];
  const regex = /```(\w+)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(mdContent)) !== null) {
    blocks.push({ lang: match[1], code: match[2].trim() });
  }
  return blocks;
}

function processFile(filePath, type) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  const snippets = [];

  if (ext === '.md') {
    // Extract code blocks from markdown skill files
    const annotations = parseSnipAnnotations(content);
    if (annotations.publish !== true) return [];

    const blocks = extractCodeBlocks(content);
    for (const block of blocks) {
      if (!block.code || block.code.length < 30) continue;

      const title = annotations.title ?? path.basename(path.dirname(filePath));
      const tags = Array.isArray(annotations.tags) ? annotations.tags : [];
      const category = annotations.category ?? inferCategory(title, tags);
      const slug = slugify(title);
      const id = `${slug}-${crypto.createHash('md5').update(block.code).digest('hex').slice(0, 6)}`;

      snippets.push({
        id,
        slug,
        title,
        description: annotations.description ?? '',
        category,
        difficulty: annotations.difficulty ?? 'intermediate',
        language: LANG_BY_EXT[`.${block.lang}`] ?? block.lang,
        tags,
        code: block.code,
        explanation: '',
        relatedSnippets: [],
        sourceFile: path.relative(wsRoot, filePath),
        dcyfrAiVersion: annotations.dcyfrAiVersion ?? null,
        deprecated: false,
      });
    }
  } else if (Object.hasOwn(LANG_BY_EXT, ext)) {
    // Standalone code file
    const annotations = parseSnipAnnotations(content);
    if (annotations.publish !== true) return [];

    const title = annotations.title ?? path.basename(filePath, ext).replace(/-/g, ' ');
    const tags = Array.isArray(annotations.tags) ? annotations.tags : [];
    const category = annotations.category ?? inferCategory(title, tags);
    const slug = slugify(title);
    const id = slug;

    snippets.push({
      id,
      slug,
      title,
      description: annotations.description ?? '',
      category,
      difficulty: annotations.difficulty ?? 'beginner',
      language: LANG_BY_EXT[ext],
      tags,
      code: content.trim(),
      explanation: '',
      relatedSnippets: [],
      sourceFile: path.relative(wsRoot, filePath),
      dcyfrAiVersion: annotations.dcyfrAiVersion ?? null,
      deprecated: false,
    });
  }

  return snippets;
}

function scanDir(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanDir(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

// Load existing (manual) snippets
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
} catch { /* fresh start */ }

const manualIds = new Set(existing.filter((s) => !s.sourceFile).map((s) => s.id));

const extracted = [];
let skipped = 0;

for (const { dir } of SCAN_PATHS) {
  for (const file of scanDir(dir)) {
    try {
      const snippets = processFile(file, 'skill');
      extracted.push(...snippets);
    } catch (err) {
      console.warn(`Warning: could not process ${file}: ${err.message}`);
      skipped++;
    }
  }
}

const extractedIds = new Set(extracted.map((s) => s.id));
const merged = [
  ...existing.filter((s) => manualIds.has(s.id) || !extractedIds.has(s.id)),
  ...extracted,
];

if (dryRun) {
  console.log(`[dry-run] Would extract ${extracted.length} snippets, skip ${skipped} files`);
  console.log('[dry-run] Merged total:', merged.length);
} else {
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Extracted ${extracted.length} snippets from workspace`);
  console.log(`Skipped ${skipped} files (errors or missing publish:true)`);
  console.log(`Total snippets: ${merged.length}`);
}
