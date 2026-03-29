import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "California Fire Data — Department Research & Comparison",
  description:
    "Structured, source-linked profiles of California fire departments. Compare salary, staffing, retirement, EMS models, and operations across departments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-amber-400"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-5-5-11-5-11z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight text-stone-900">
                  California Fire Data
                </span>
                <span className="hidden sm:inline text-xs text-stone-400 ml-2">
                  Department Research & Comparison
                </span>
              </div>
            </a>
            <nav className="flex items-center gap-6 text-sm">
              <a
                href="/"
                className="text-stone-500 hover:text-stone-900 transition-colors"
              >
                Departments
              </a>
              <a
                href="/compare"
                className="text-stone-500 hover:text-stone-900 transition-colors"
              >
                Compare
              </a>
              <a
                href="/about"
                className="text-stone-500 hover:text-stone-900 transition-colors"
              >
                About
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white mt-auto">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-stone-400 leading-relaxed max-w-xl">
              All data sourced from official public records — MOUs, city/district
              budgets, department websites, and pension system documents.
              This is an independent research project. Not affiliated with any
              fire department, city, or county.
            </div>
            <div className="text-xs text-stone-400">
              Last updated March 2026
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
