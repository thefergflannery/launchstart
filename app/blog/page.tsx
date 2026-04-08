import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-posts';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Blog — A11YO',
  description: 'Accessibility, SEO, and launch guides for Irish businesses — plain English, business case led.',
};

const CATEGORY_COLORS: Record<string, string> = {
  Accessibility: 'text-green',
  Compliance:    'text-green',
  SEO:           'text-green-mid',
  Checklist:     'text-warn',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1">

        {/* Hero */}
        <section className="border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-5">From the blog</span>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-none tracking-tight mb-5">
              Accessibility,<br /><span className="text-green">plain English.</span>
            </h1>
            <p className="text-secondary text-lg max-w-xl leading-relaxed">
              A series on web accessibility for Irish businesses — the legal context, the tools, the quick wins, and the business case.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16 border-b border-border">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {BLOG_POSTS.map((post) => (
                <article key={post.slug} className="bg-black p-8 flex flex-col group">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono text-xs uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'text-secondary'}`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-xs text-secondary">{post.date}</span>
                  </div>
                  <h2 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-green transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed flex-1 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{post.readingTime} read</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-mono text-xs tracking-wider uppercase text-green hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-surface border border-border p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Ready to check?</span>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
                  Audit your site in 30 seconds.
                </h2>
                <p className="text-secondary leading-relaxed max-w-md">
                  Free, no account required. Paste a URL, get a shareable accessibility and launch-readiness report.
                </p>
              </div>
              <Link
                href="/"
                className="flex-shrink-0 font-mono text-sm tracking-wider uppercase bg-green text-black px-8 py-4 hover:bg-green/80 transition-colors whitespace-nowrap"
              >
                Run free audit →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
