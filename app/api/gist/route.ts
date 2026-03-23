import type { NextRequest } from 'next/server';

interface GistFile {
  content: string;
}

interface GistPayload {
  description: string;
  public: boolean;
  files: Record<string, GistFile>;
}

/**
 * POST /api/gist
 * Creates a GitHub Gist via the GitHub API and returns its URL.
 *
 * Required env var: GITHUB_TOKEN (with gist scope)
 */
export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: 'Gist creation not configured' }, { status: 501 });
  }

  let payload: GistPayload;
  try {
    payload = await req.json() as GistPayload;
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate
  if (!payload.files || Object.keys(payload.files).length === 0) {
    return Response.json({ error: 'files required' }, { status: 400 });
  }
  for (const [name, file] of Object.entries(payload.files)) {
    if (typeof file.content !== 'string' || file.content.length === 0) {
      return Response.json({ error: `Empty content for file: ${name}` }, { status: 400 });
    }
    if (file.content.length > 100_000) {
      return Response.json({ error: 'File too large (max 100KB)' }, { status: 400 });
    }
  }

  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      description: payload.description ?? '',
      public: payload.public ?? true,
      files: payload.files,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('GitHub Gist API error:', res.status, error);
    return Response.json({ error: 'GitHub API error' }, { status: 502 });
  }

  const gist = await res.json() as { html_url: string; id: string };
  return Response.json({ url: gist.html_url, id: gist.id });
}
