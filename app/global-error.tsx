'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-dcyfr-primary-950 text-white">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
          <p className="mb-4 text-dcyfr-primary-300">An unexpected error occurred.</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-dcyfr-accent-700 px-4 py-2 text-sm font-medium hover:bg-dcyfr-accent-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
