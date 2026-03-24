import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'DCYFR Codes — Agent patterns, delegation recipes, and RAG pipelines',
    template: '%s | DCYFR Codes',
  },
  description:
    'Searchable code patterns and production-ready recipes for building with the DCYFR ecosystem — agent delegation, RAG pipelines, context engineering, and more.',
  openGraph: {
    type: 'website',
    siteName: 'DCYFR Codes',
    url: 'https://dcyfr.codes',
  },
  metadataBase: new URL('https://dcyfr.codes'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-dcyfr-accent focus:bg-dcyfr-primary-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none">
          Skip to main content
        </a>
        <header className="border-b border-dcyfr-primary-800/60 bg-dcyfr-primary-950/80 backdrop-blur sticky top-0 z-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <Link href="/" className="font-semibold text-white hover:text-dcyfr-accent-300 transition-colors">
              dcyfr<span className="text-dcyfr-accent-400">.codes</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
              <Link href="/snippets" className="text-dcyfr-primary-300 hover:text-white transition-colors">Browse</Link>
              <Link href="/categories" className="text-dcyfr-primary-300 hover:text-white transition-colors">Categories</Link>
              <a
                href="https://dcyfr.io"
                className="text-dcyfr-primary-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                dcyfr.io ↗
              </a>
            </nav>
          </div>
        </header>

        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        <footer className="border-t border-dcyfr-primary-800/60 mt-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">
                  dcyfr<span className="text-dcyfr-accent-400">.codes</span>
                </p>
                <p className="text-xs text-dcyfr-primary-300 mt-1">
                  Production-ready code patterns for the DCYFR ecosystem.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-dcyfr-primary-300">
                <a href="https://dcyfr.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">dcyfr.tech</a>
                <span aria-hidden="true" className="text-dcyfr-primary-700">·</span>
                <a href="https://dcyfr.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">dcyfr.io</a>
                <span aria-hidden="true" className="text-dcyfr-primary-700">·</span>
                <a href="https://dcyfr.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">dcyfr.app</a>
              </div>
            </div>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
