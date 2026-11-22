import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Copy, Mail, User, Youtube, Facebook } from 'lucide-react';
import { SiteSettings } from '../types.js';
import { GENUINE_WORK, SERVICES_LIST, SOCIAL_LINKS } from '../data/agencyContent.js';

interface PortfolioHomeProps {
  navigate: (path: string) => void;
  settings: SiteSettings;
  founderImageFailed: boolean;
  setFounderImageFailed: (failed: boolean) => void;
}

export default function PortfolioHome({
  navigate,
  settings,
  founderImageFailed,
  setFounderImageFailed
}: PortfolioHomeProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const publicEmail =
    settings.contactEmail && settings.contactEmail !== 'editor@netventures.online'
      ? settings.contactEmail
      : 'hello@netventures.online';

  const founderPortraitUrl = settings.founderImageUrl || '/uploads/stefan-sharf.jpg';

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(path);
    }
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(publicEmail)
        .then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2500);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 animate-fade-in">
      {/* 1. PERSONAL INTRODUCTION */}
      <section id="about" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10">
          {founderPortraitUrl && !founderImageFailed ? (
            <img
              src={founderPortraitUrl}
              alt="Stefan Sharf - Founder & CEO, NetVentures"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setFounderImageFailed(true)}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-gold-500/30 shadow-md shrink-0"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-gold-500/30 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 shrink-0">
              <User className="w-12 h-12 stroke-1 mb-1" />
              <span className="text-[11px] font-mono uppercase tracking-wider">Stefan Sharf</span>
            </div>
          )}

          <div className="space-y-4 text-center sm:text-left">
            <div className="space-y-1">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
                Stefan Sharf
              </h1>
              <p className="text-sm sm:text-base font-semibold text-gold-600 dark:text-gold-500">
                Founder &amp; CEO, NetVentures
              </p>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              I build clean, mobile-friendly websites, custom management apps, and grounded local and AI search visibility for hotels and restaurants. I also write practical guides on software, automation, and digital operations on the NetVentures blog.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <a
                href="/#contact"
                onClick={(e) => handleLink(e, '/#contact')}
                className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Get in touch <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/blog"
                onClick={(e) => handleLink(e, '/blog')}
                className="whitespace-nowrap px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:border-gold-500/50 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Read the blog
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CONCISE SERVICES */}
      <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 space-y-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
            Services
          </p>
          <h2 id="services-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            What I help hospitality teams build
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES_LIST.map((service) => (
            <div
              key={service.number}
              className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3"
            >
              <span className="block font-mono text-xs font-semibold text-gold-600 dark:text-gold-500">
                {service.number}
              </span>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-snug">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SMALL WORK SECTION (GENUINE EXISTING WORK ONLY) */}
      <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 space-y-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
            Selected Work
          </p>
          <h2 id="work-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            Existing platforms &amp; publishing work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GENUINE_WORK.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="block text-xs font-mono font-semibold text-gold-700 dark:text-gold-500 uppercase tracking-wider">
                  {item.tag}
                </span>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div>
                <a
                  href={item.linkPath}
                  onClick={(e) => handleLink(e, item.linkPath)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 rounded-xs"
                >
                  {item.linkLabel} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Client properties and custom systems are showcased here only when published with owner permission.
        </p>
      </section>

      {/* 4. CONTACT & SOCIAL BUTTONS */}
      <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 pt-4 border-t border-gray-200 dark:border-zinc-800 pb-4">
        <div className="p-7 sm:p-9 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-500">
              Contact
            </p>
            <h2 id="contact-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Get in touch
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              For hospitality websites, custom management tools, or local visibility questions, email me directly or connect below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${publicEmail}`}
              className="whitespace-nowrap px-5 py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <Mail className="h-4 w-4" />
              <span>{publicEmail}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="whitespace-nowrap px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:border-gold-500/50 transition-colors inline-flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy email</span>
                </>
              )}
            </button>

            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:border-gold-500/50 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <Youtube className="h-4 w-4 text-gold-600 dark:text-gold-500" />
              <span>YouTube</span>
            </a>

            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:border-gold-500/50 transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <Facebook className="h-4 w-4 text-gold-600 dark:text-gold-500" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
