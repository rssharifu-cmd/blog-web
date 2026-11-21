import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  FileCheck,
  Mail,
  Send,
  User,
  Wrench,
  Package
} from 'lucide-react';
import ArticleCard from './ArticleCard.js';
import { Article, Category, DigitalProduct, SiteSettings } from '../types.js';
import { DIGITAL_PRODUCTS } from '../data/products.js';
import { PROCESS_STEPS, SERVICES_DATA, WORK_ITEMS } from '../data/agencyContent.js';

interface SharedNavProps {
  navigate: (path: string) => void;
}

const useSpaHref = (navigate: (path: string) => void) => {
  return (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(path);
    }
  };
};

interface HomePageProps extends SharedNavProps {
  articles: Article[];
  categories: Category[];
  settings: SiteSettings;
  founderImageFailed: boolean;
  setFounderImageFailed: (failed: boolean) => void;
}

export function HomePage({
  navigate,
  articles,
  categories,
  settings,
  founderImageFailed,
  setFounderImageFailed
}: HomePageProps) {
  const handleLink = useSpaHref(navigate);
  const recentArticles = articles.slice(0, 3);
  const featuredProducts = DIGITAL_PRODUCTS.slice(0, 3);
  const founderPortraitUrl = settings.founderImageUrl || '/uploads/stefan-sharf.jpg';

  return (
    <div className="space-y-20 animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="relative overflow-hidden bg-zinc-950 text-white rounded-3xl px-6 sm:px-12 lg:px-16 py-16 sm:py-22 border border-zinc-800">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-500">
              Hospitality Digital Agency
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-[3.25rem] tracking-tight leading-[1.12] text-white">
              Websites and digital systems for hotels and restaurants.
            </h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
              NetVentures builds clear, mobile-friendly websites, custom internal management tools, and grounded local and AI-search visibility so hospitality owners win more direct enquiries and run smoother day-to-day operations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/contact"
                onClick={(e) => handleLink(e, '/contact')}
                className="whitespace-nowrap px-6 py-3.5 rounded-xl bg-gold-500 text-zinc-950 font-semibold text-sm hover:bg-gold-200 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Discuss your project
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/services"
                onClick={(e) => handleLink(e, '/services')}
                className="whitespace-nowrap px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-200 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Explore services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE FOCUSED SERVICE CARDS */}
      <section aria-labelledby="services-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
              Core Services
            </p>
            <h2 id="services-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Built for independent hospitality teams
            </h2>
          </div>
          <a
            href="/services"
            onClick={(e) => handleLink(e, '/services')}
            className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
          >
            All service details <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between p-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-gray-100 dark:border-zinc-900 pb-3">
                  <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-500">
                    {service.number}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Hospitality Scope
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.summary}
                </p>
                <ul className="space-y-2 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {service.deliverables.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gold-600 dark:text-gold-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-zinc-900">
                <a
                  href={`/services#${service.anchor}`}
                  onClick={(e) => handleLink(e, `/services#${service.anchor}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  Review service scope <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SELECTED WORK (COMPACT & HONEST) */}
      <section aria-labelledby="work-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
              Selected Work
            </p>
            <h2 id="work-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Verified systems &amp; active reference builds
            </h2>
          </div>
          <a
            href="/our-work"
            onClick={(e) => handleLink(e, '/our-work')}
            className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
          >
            View Our Work <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/30 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-gold-700 dark:text-gold-500 uppercase tracking-wider">
                    {item.statusLabel}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {item.linkHref && item.linkLabel && (
                <div>
                  <a
                    href={item.linkHref}
                    onClick={(e) => handleLink(e, item.linkHref!)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                  >
                    {item.linkLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPACT PRODUCTS SECTION */}
      <section aria-labelledby="products-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
              Digital Products
            </p>
            <h2 id="products-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Self-serve templates, tools &amp; micro apps
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Planned as individual one-time purchases separate from custom agency services. Currently in preparation ahead of checkout setup.
            </p>
          </div>
          <a
            href="/products"
            onClick={(e) => handleLink(e, '/products')}
            className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.slug}
              className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {product.category}
                  </span>
                  <span className="text-gold-700 dark:text-gold-500 font-semibold">
                    {product.availability === 'available' && product.price !== null
                      ? `$${product.price} one-time`
                      : 'Coming Soon'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <a
                href={`/products/${product.slug}`}
                onClick={(e) => handleLink(e, `/products/${product.slug}`)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
              >
                View specifications <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SHORT PROCESS */}
      <section aria-labelledby="process-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 max-w-2xl border-b border-gray-200 dark:border-zinc-800 pb-6">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
            How Projects Run
          </p>
          <h2 id="process-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            Clear scope from first conversation to handover
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Every engagement follows four practical steps. Ongoing maintenance or search updates remain optional per project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3"
            >
              <span className="block font-mono text-xs font-bold text-gold-600 dark:text-gold-500">
                STEP {step.number}
              </span>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SHORT FOUNDER INTRODUCTION */}
      <section aria-labelledby="founder-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {founderPortraitUrl && !founderImageFailed ? (
              <img
                src={founderPortraitUrl}
                alt="Stefan Sharf - Founder & CEO, NetVentures"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setFounderImageFailed(true)}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-gold-500/30 shrink-0"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-gold-500/30 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 shrink-0">
                <User className="w-12 h-12 stroke-1 mb-1" />
                <span className="text-[11px] font-mono uppercase tracking-wider">Stefan Sharf</span>
              </div>
            )}

            <div className="space-y-4 text-center sm:text-left">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500 mb-1">
                  Leadership
                </p>
                <h2 id="founder-heading" className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                  Stefan Sharf
                </h2>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Founder &amp; CEO, NetVentures
                </p>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                NetVentures combines practical web engineering, workflow automation, and search visibility work to help independent hotel and restaurant owners replace slow sites and scattered spreadsheets with dependable digital systems. Alongside client work, we continue to publish practical software and automation guides in our blog.
              </p>
              <div>
                <a
                  href="/about"
                  onClick={(e) => handleLink(e, '/about')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  About Stefan Sharf &amp; NetVentures <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPACT RECENT BLOG SECTION */}
      <section aria-labelledby="recent-blog-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
              From the Blog
            </p>
            <h2 id="recent-blog-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Recent articles &amp; guides
            </h2>
          </div>
          <a
            href="/blog"
            onClick={(e) => handleLink(e, '/blog')}
            className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
          >
            View all articles <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              category={categories.find((c) => c.id === art.categoryId)}
              onClick={() => navigate(`/blog/${art.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="rounded-3xl bg-zinc-950 text-white px-6 sm:px-12 py-12 sm:py-14 border border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-500">
              Start a Conversation
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Planning a new hospitality website, management tool, or local visibility audit?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Share a short summary of your property and goals. We will review your current setup and reply with clear next steps.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="/contact"
              onClick={(e) => handleLink(e, '/contact')}
              className="whitespace-nowrap px-6 py-3.5 rounded-xl bg-gold-500 text-zinc-950 font-semibold text-sm hover:bg-gold-200 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              Discuss your project <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ServicesPage({ navigate }: SharedNavProps) {
  const handleLink = useSpaHref(navigate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 animate-fade-in">
      <div className="space-y-4 border-b border-gray-200 dark:border-zinc-800 pb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
          Services for Hotels &amp; Restaurants
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          Practical websites, custom management tools, and search visibility
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
          Every hospitality business has different systems, booking setups, and guest expectations. We scope each project honestly around your property rather than forcing pre-packaged promises.
        </p>
      </div>

      <div className="space-y-10">
        {SERVICES_DATA.map((service) => (
          <section
            key={service.id}
            id={service.anchor}
            className="scroll-mt-24 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 dark:border-zinc-900 pb-4">
              <span className="font-mono text-xs font-bold text-gold-600 dark:text-gold-500">
                SERVICE {service.number}
              </span>
              <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                Custom Scoped Engagement
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">
                {service.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  What this covers
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-gold-600 dark:text-gold-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  Scope &amp; Verification Notes
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.scopeNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/contact"
                onClick={(e) => handleLink(e, '/contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Discuss {service.title} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        ))}
      </div>

      {/* Process Recap */}
      <section className="p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            How we scope and deliver projects
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ongoing support or search follow-up is optional and agreed per project—never bundled as hidden lock-in.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="space-y-2">
              <span className="font-mono text-xs font-bold text-gold-600 dark:text-gold-500">
                {step.number}
              </span>
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function OurWorkPage({ navigate }: SharedNavProps) {
  const handleLink = useSpaHref(navigate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      <div className="space-y-4 border-b border-gray-200 dark:border-zinc-800 pb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
          Portfolio &amp; Reference Builds
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          Our Work
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
          We list only verified, inspectable systems here—explicitly distinguishing our own live web platform from agency service reference architectures and work in progress.
        </p>
      </div>

      <div className="space-y-6">
        {WORK_ITEMS.map((item) => (
          <article
            key={item.id}
            className="p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-zinc-900 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-500">
                {item.statusLabel}
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {item.category}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              {item.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.summary}
            </p>

            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {item.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-gold-600 dark:text-gold-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {item.linkHref && item.linkLabel && (
              <div className="pt-2">
                <a
                  href={item.linkHref}
                  onClick={(e) => handleLink(e, item.linkHref!)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  {item.linkLabel} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="p-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
        <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
          Client Portfolio Transparency
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Client hotel and restaurant projects are published here only when the property owner approves public showcase and deliverables can be directly verified. We do not publish anonymized placeholder logos, fabricated traffic percentages, or unverified testimonials.
        </p>
        <div className="pt-1">
          <a
            href="/contact"
            onClick={(e) => handleLink(e, '/contact')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 dark:text-gold-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
          >
            Request a live walkthrough for your property <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductsPage({ navigate }: SharedNavProps) {
  const handleLink = useSpaHref(navigate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      <div className="space-y-4 border-b border-gray-200 dark:border-zinc-800 pb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
          Digital Products
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          Templates, small business tools &amp; micro apps
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
          Self-serve digital tools designed for individual one-time purchase—separate from our custom hotel and restaurant agency engagements and independent blog articles.
        </p>
      </div>

      {/* Honest Launch / Checkout Status Notice */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-2">
        <div className="flex items-center gap-2 text-sm font-display font-bold text-amber-900 dark:text-amber-300">
          <Package className="h-4 w-4 shrink-0" />
          <span>Checkout &amp; Deliverables Currently in Preparation</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Individual one-time checkout links, finalized pricing, packaged download files, and product-specific licensing and refund terms are currently awaiting final owner configuration before sales open. No payments or instant downloads are active on this page yet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DIGITAL_PRODUCTS.map((product) => (
          <article
            key={product.slug}
            className="p-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs font-mono border-b border-gray-100 dark:border-zinc-900 pb-3">
                <span className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {product.category}
                </span>
                <span className="font-semibold text-gold-700 dark:text-gold-500">
                  {product.availability === 'available' && product.price !== null
                    ? `$${product.price} (${product.billingType})`
                    : 'Coming Soon'}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.shortDescription}
              </p>

              <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1">
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">For:</span>{' '}
                  {product.intendedUsers}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Pricing model:</span>{' '}
                  One-time purchase (final price TBA)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 flex items-center justify-between gap-3">
              <a
                href={`/products/${product.slug}`}
                onClick={(e) => handleLink(e, `/products/${product.slug}`)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
              >
                View details <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Distinction CTA */}
      <div className="p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
            Need a custom website or management system built for your property?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Self-serve products are standalone tools. For tailored hospitality websites, management dashboards, or Local SEO &amp; AI visibility audits, see our agency services.
          </p>
        </div>
        <a
          href="/services"
          onClick={(e) => handleLink(e, '/services')}
          className="whitespace-nowrap px-5 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-semibold text-gray-900 dark:text-white hover:border-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          Explore Agency Services
        </a>
      </div>
    </div>
  );
}

interface ProductDetailPageProps extends SharedNavProps {
  product: DigitalProduct;
  contactEmail: string;
}

export function ProductDetailPage({ navigate, product, contactEmail }: ProductDetailPageProps) {
  const handleLink = useSpaHref(navigate);
  const isBuyable = product.availability === 'available' && Boolean(product.checkoutUrl) && product.price !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
        <a
          href="/"
          onClick={(e) => handleLink(e, '/')}
          className="hover:text-gold-600 dark:hover:text-gold-500 focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
        >
          Home
        </a>
        <span>/</span>
        <a
          href="/products"
          onClick={(e) => handleLink(e, '/products')}
          className="hover:text-gold-600 dark:hover:text-gold-500 focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
        >
          Products
        </a>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 truncate">{product.title}</span>
      </nav>

      <div className="space-y-4 border-b border-gray-200 dark:border-zinc-800 pb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {product.category}
          </span>
          <span className="text-gray-300 dark:text-zinc-700">|</span>
          <span className="font-semibold text-gold-700 dark:text-gold-500">
            {isBuyable ? `$${product.price} ${product.currency} · One-time purchase` : 'Coming Soon · One-time purchase'}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          {product.title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Purchase / Availability Box */}
      <div className="p-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
        {isBuyable ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-xl text-gray-900 dark:text-white">
                ${product.price} {product.currency}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Single one-time purchase · {product.deliveryFormat}
              </p>
            </div>
            <a
              href={product.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-6 py-3 rounded-xl bg-gold-500 text-zinc-950 font-semibold text-sm hover:bg-gold-200 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              Proceed to Checkout <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="font-display font-bold text-lg text-gray-900 dark:text-white">
                Not Yet Available for Online Purchase
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                This digital product is planned as a single one-time purchase, but checkout integration, final pricing, downloadable files, and product-specific license and refund terms are not yet finalized.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Product launch inquiry: ${product.title}`)}`}
                className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                <Mail className="h-3.5 w-3.5" /> Email to request launch update
              </a>
              <a
                href="/services"
                onClick={(e) => handleLink(e, '/services')}
                className="whitespace-nowrap px-5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 font-semibold text-xs uppercase tracking-wider hover:border-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Need custom implementation?
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Product Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Planned Contents
          </h2>
          <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
            {product.includedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-gold-600 dark:text-gold-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Requirements &amp; Scope
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Intended Users</p>
              <p>{product.intendedUsers}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Delivery Format</p>
              <p>{product.deliveryFormat}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">Technical Requirements</p>
              <ul className="list-disc pl-5 space-y-1">
                {product.technicalRequirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Support & License Terms */}
      <div className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
          Support, Licensing &amp; Pending Release Notes
        </h2>
        <p>
          <strong className="text-gray-900 dark:text-white">Support scope:</strong> {product.supportScope}
        </p>
        <p>
          <strong className="text-gray-900 dark:text-white">Licensing &amp; refund terms:</strong> {product.licenseNotes}
        </p>
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-900">
          <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
            Pending Owner Configuration Before Launch
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {product.ownerSetupNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface AboutPageProps extends SharedNavProps {
  settings: SiteSettings;
  founderImageFailed: boolean;
  setFounderImageFailed: (failed: boolean) => void;
}

export function AboutPage({
  navigate,
  settings,
  founderImageFailed,
  setFounderImageFailed
}: AboutPageProps) {
  const handleLink = useSpaHref(navigate);
  const founderPortraitUrl = settings.founderImageUrl || '/uploads/stefan-sharf.jpg';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      <div className="space-y-3 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
          About NetVentures
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          About Us &amp; Leadership
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          NetVentures is a focused digital agency helping hotel and restaurant owners build dependable websites, custom operational tools, and stronger local and AI search visibility—alongside our independent technology blog.
        </p>
      </div>

      {/* Stefan Sharf Profile Photo, Identity & Introduction */}
      <div className="p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {founderPortraitUrl && !founderImageFailed ? (
            <img
              src={founderPortraitUrl}
              alt="Stefan Sharf - Founder & CEO, NetVentures"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setFounderImageFailed(true)}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-2 border-gold-500/30 shadow-md shrink-0"
            />
          ) : (
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-gold-500/30 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 shrink-0 shadow-inner">
              <User className="w-14 h-14 stroke-1 mb-1 text-zinc-400 dark:text-zinc-500" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Stefan Sharf
              </span>
            </div>
          )}

          <div className="space-y-4 text-center sm:text-left">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white">
                Stefan Sharf
              </h2>
              <p className="text-gold-600 dark:text-gold-500 font-semibold text-sm mt-0.5">
                Founder &amp; CEO, NetVentures
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white pt-1">
                About Stefan Sharf &amp; Our Focus
              </h3>
              <p>
                Stefan Sharf is the Founder &amp; CEO of NetVentures. We work directly with hotel and restaurant owners who want practical digital infrastructure—clear customer-facing websites, custom internal management tools tailored to their staff workflows, and honest local and AI search visibility work.
              </p>
              <p>
                Alongside client agency work, NetVentures publishes an independent technology and digital business blog covering AI tools, automation, SaaS reviews, and online operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Help & Services Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-gold-600 dark:text-gold-500 shrink-0" />
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Hospitality Businesses We Serve
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Independent hotels, boutique guesthouses, restaurants, cafes, and regional hospitality operators seeking direct guest enquiries, clearer online menus and room information, and internal tools built around how their teams actually work.
          </p>
          <a
            href="/services"
            onClick={(e) => handleLink(e, '/services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 dark:text-gold-500 hover:underline focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
          >
            Explore our three core services <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="p-7 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-gold-600 dark:text-gold-500 shrink-0" />
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Scoping &amp; Delivery Standards
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We confirm third-party booking engines, enquiry routing, and technical requirements before promising integrations. Management apps are scoped carefully to distinguish enquiries from confirmed payments or reservations, and search audits rely on verifiable evidence rather than inflated scores.
          </p>
          <a
            href="/contact"
            onClick={(e) => handleLink(e, '/contact')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 dark:text-gold-500 hover:underline focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
          >
            Discuss your project <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* How We Work (Blog & Editorial Principles) */}
      <div className="p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
        <div className="flex items-center gap-3">
          <FileCheck className="h-5 w-5 text-gold-600 dark:text-gold-500 shrink-0" />
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
            Blog Editorial Principles
          </h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            For the NetVentures Blog, we work with an editorial and research team to publish guides, software comparisons, and automation walkthroughs using official documentation, publicly available product information, and practical analysis.
          </p>
          <p>
            We aim to distinguish verified information from analysis and opinion. When a product reviewed on the blog has not been personally tested by our team, we do not claim that it has been tested.
          </p>
        </div>
      </div>

      {/* Editorial Transparency / Affiliate Disclosure (Explicitly Scoped to Blog) */}
      <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <h4 className="font-display font-bold text-amber-800 dark:text-amber-400 text-sm">
          Blog Editorial Transparency &amp; Affiliate Disclosure
        </h4>
        <p className="leading-relaxed">
          On the NetVentures Blog, we may receive compensation through affiliate links when readers purchase software or tools mentioned in our articles, at no extra cost to you. Client agency projects are scoped and billed independently of editorial content. Read our full{' '}
          <a
            href="/disclosure"
            onClick={(e) => handleLink(e, '/disclosure')}
            className="font-semibold text-gold-700 dark:text-gold-500 underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
          >
            Affiliate Disclosure
          </a>.
        </p>
      </div>
    </div>
  );
}

interface ContactPageProps {
  settings: SiteSettings;
}

export function ContactPage({ settings }: ContactPageProps) {
  const contactEmail = settings.contactEmail || 'editor@netventures.online';
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    businessName: '',
    serviceInterest: 'Hotel & Restaurant Website',
    message: ''
  });
  const [mailtoPrompted, setMailtoPrompted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const buildMailtoUrl = () => {
    const subjectLine = `[NetVentures Inquiry] ${contactForm.serviceInterest}${
      contactForm.businessName.trim() ? ` - ${contactForm.businessName.trim()}` : ''
    }`;
    const bodyLines = [
      `Name: ${contactForm.name.trim()}`,
      `Reply Email: ${contactForm.email.trim()}`,
      contactForm.businessName.trim() ? `Hotel / Restaurant / Business: ${contactForm.businessName.trim()}` : null,
      `Area of Interest: ${contactForm.serviceInterest}`,
      '',
      'Project Details:',
      contactForm.message.trim()
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:${contactEmail}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyLines)}`;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildMailtoUrl();
    setLastMailtoUrl(url);
    setMailtoPrompted(true);
    window.location.href = url;
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="space-y-3 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
          Project Inquiries
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          Contact NetVentures
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
          Tell us about your hotel, restaurant, or digital product question. Submitting the form below prepares an email in your default mail app addressed to{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-semibold text-gold-700 dark:text-gold-500 underline"
          >
            {contactEmail}
          </a>.
        </p>
      </div>

      {/* Direct Email Utility Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
          <Mail className="h-4 w-4 text-gold-600 dark:text-gold-500 shrink-0" />
          <span>
            Direct email:{' '}
            <a href={`mailto:${contactEmail}`} className="font-mono font-semibold hover:underline">
              {contactEmail}
            </a>
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gold-500 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {copiedEmail ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Email copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy email address
            </>
          )}
        </button>
      </div>

      {mailtoPrompted && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-gray-800 dark:text-gray-200 space-y-3 animate-fade-in">
          <p className="font-display font-bold text-base text-gray-900 dark:text-white">
            Review &amp; Send in Your Email App
          </p>
          <p className="text-sm leading-relaxed">
            Your device was prompted to open your email client with a pre-filled draft to{' '}
            <span className="font-mono font-semibold">{contactEmail}</span>. Your message has <strong>not</strong> been sent by this website automatically—please click <strong>Send</strong> inside your email app to complete delivery.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {lastMailtoUrl && (
              <a
                href={lastMailtoUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold"
              >
                <Mail className="h-3.5 w-3.5" /> Open Email App Again
              </a>
            )}
            <button
              type="button"
              onClick={() => setMailtoPrompted(false)}
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:underline cursor-pointer"
            >
              Dismiss notice
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleContactSubmit}
        className="space-y-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Your Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
              placeholder="you@yourhotel.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-business" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Hotel / Restaurant Name (Optional)
            </label>
            <input
              id="contact-business"
              type="text"
              value={contactForm.businessName}
              onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
              placeholder="Property or business name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div>
            <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Project or Inquiry Topic
            </label>
            <select
              id="contact-service"
              value={contactForm.serviceInterest}
              onChange={(e) => setContactForm({ ...contactForm, serviceInterest: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            >
              <option value="Hotel & Restaurant Website">Hotel &amp; Restaurant Website</option>
              <option value="Custom Management Website / App">Custom Management Website / App</option>
              <option value="Local SEO & AI Search Visibility">Local SEO &amp; AI Search Visibility</option>
              <option value="Digital Product Inquiry">Digital Product Inquiry</option>
              <option value="Blog / Editorial Inquiry">Blog / Editorial Inquiry</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Project Details
          </label>
          <textarea
            id="contact-message"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            required
            rows={5}
            placeholder="Share your current website URL (if any), booking or management workflow needs, and preferred timeline..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-zinc-950 dark:bg-white hover:opacity-90 text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider rounded-xl transition-opacity flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          <Send className="h-4 w-4" /> Prepare Email to {contactEmail}
        </button>
      </form>
    </div>
  );
}
