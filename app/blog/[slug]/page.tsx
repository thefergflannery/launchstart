import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS, getBlogPost } from '@/lib/blog-posts';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — A11YO Blog`,
    description: post.excerpt,
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Accessibility: 'text-green',
  Compliance:    'text-green',
  SEO:           'text-green-mid',
  Checklist:     'text-warn',
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const prev = BLOG_POSTS[currentIndex - 1];
  const next = BLOG_POSTS[currentIndex + 1];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav
        links={PAGE_NAV_LINKS}
        cta={{ href: '/', label: 'Full audit →' }}
      />

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <Link href="/blog" className="font-mono text-xs text-secondary hover:text-green transition-colors uppercase tracking-wider block mb-8">
            ← Blog
          </Link>

          {/* Article header */}
          <header className="mb-12 pb-10 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-mono text-xs uppercase tracking-widest ${CATEGORY_COLORS[post.category] ?? 'text-secondary'}`}>
                {post.category}
              </span>
              <span className="text-border">·</span>
              <span className="font-mono text-xs text-secondary">{post.date}</span>
              <span className="text-border">·</span>
              <span className="font-mono text-xs text-secondary">{post.readingTime} read</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-secondary text-lg leading-relaxed mb-5">
              {post.excerpt}
            </p>
            <p className="font-mono text-xs text-muted uppercase tracking-wider">{post.series}</p>
          </header>

          {/* Article body */}
          <article className="prose-a11yo">
            {post.sections.map((section, i) => (
              <div key={i} className="mb-10">
                {section.heading && section.headingLevel === 2 && (
                  <h2 className="text-xl font-display font-bold text-white mb-4 mt-10 first:mt-0">
                    {section.heading}
                  </h2>
                )}
                {section.heading && section.headingLevel === 3 && (
                  <h3 className="text-lg font-semibold text-white mb-3 mt-8">
                    {section.heading}
                  </h3>
                )}
                {section.body.map((para, j) => (
                  <p key={j} className="text-secondary leading-relaxed mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
                {section.pullQuote && (
                  <blockquote className="my-8 border-l-2 border-green pl-6">
                    <p className="text-white text-base leading-relaxed italic">
                      {section.pullQuote}
                    </p>
                  </blockquote>
                )}
              </div>
            ))}
          </article>

          {/* CTA */}
          <div className="mt-16 border border-green/20 bg-black p-8" style={{ boxShadow: '0 0 40px -8px rgba(0,233,106,0.08)' }}>
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Try it now</span>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Check your site in 30 seconds.
            </h2>
            <p className="text-secondary mb-6 leading-relaxed">
              Paste your URL and get a full accessibility, SEO, and launch-readiness audit — free, no account required.
            </p>
            <Link href="/" className="inline-block font-mono text-sm tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green/80 transition-colors font-semibold">
              Run free audit →
            </Link>
          </div>

          {/* Prev / Next */}
          {(prev || next) && (
            <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border" aria-label="Article navigation">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="bg-black p-6 hover:bg-surface transition-colors group">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary block mb-2">← Previous</span>
                  <span className="text-white text-sm font-medium group-hover:text-green transition-colors leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : <div className="bg-black" />}
              {next ? (
                <Link href={`/blog/${next.slug}`} className="bg-black p-6 hover:bg-surface transition-colors group text-right">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary block mb-2">Next →</span>
                  <span className="text-white text-sm font-medium group-hover:text-green transition-colors leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : <div className="bg-black" />}
            </nav>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
