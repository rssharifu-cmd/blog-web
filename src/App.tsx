import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Clock, Eye, Sparkles, BookOpen, ChevronRight, 
  ArrowLeft, Mail, ArrowRight, Compass, ShieldAlert, FileCheck, HelpCircle, Send, Globe, ChevronLeft
} from 'lucide-react';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ArticleCard from './components/ArticleCard.js';
import Newsletter from './components/Newsletter.js';
import Chatbot from './components/Chatbot.js';
import Toc from './components/Toc.js';
import AdminLayout from './components/AdminLayout.js';
import SocialShare from './components/SocialShare.js';
import { Article, Category, Tag, SiteSettings } from './types.js';
import { 
  getArticles, 
  getCategories, 
  getTags, 
  getSettings, 
  incrementArticleView as sbIncrementArticleView,
  isSupabaseConfigured
} from './lib/supabase.js';

export default function App() {
  // Routing State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Base Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  // Loading & Filter states
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // GDPR Cookie Consent state
  const [cookieConsent, setCookieConsent] = useState<string | null>(() => {
    return localStorage.getItem('cookieConsent');
  });

  // Reset pagination on filter or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategorySlug]);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Active theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Handle popstate for client-side custom routing
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Check URL parameters on mount
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Navigate function
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial base details
  const fetchAllData = async () => {
    try {
      const [artData, catData, tagData, setData] = await Promise.all([
        getArticles({ status: 'published' }),
        getCategories(),
        getTags(),
        getSettings()
      ]);

      setArticles(artData);
      setCategories(catData);
      setTags(tagData);
      setSettings(setData);
    } catch (err) {
      console.error('Failed to retrieve netventures configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Increments single page hit dynamically
  const incrementArticleView = (slug: string) => {
    sbIncrementArticleView(slug)
      .then(success => {
        if (success) {
          // Increment locally to avoid laggy refresh
          setArticles(prev => prev.map(a => a.slug === slug ? { ...a, views: a.views + 1 } : a));
        }
      })
      .catch(err => console.error(err));
  };

  // Increment article view count when active article slug changes (top-level hook to avoid violations)
  useEffect(() => {
    const parts = currentPath.split('/');
    const isSingle = parts[1] === 'blog' && parts[2];
    const activeSlug = isSingle ? parts[2] : null;
    if (activeSlug) {
      incrementArticleView(activeSlug);
    }
  }, [currentPath]);

  // Safe fetch for site settings
  const currentSettings = settings || {
    siteName: 'NetVentures',
    siteDescription: 'Premium digital business strategies and insights.',
    contactEmail: 'editor@netventures.com',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80',
    footerText: '© 2026 NetVentures.',
    affiliateDisclosure: 'Disclosure: Some links are affiliate links.'
  };

  // ==========================================
  // DYNAMIC SEO, METADATA & SCHEMA.ORG GRAPH INJECTION
  // ==========================================
  useEffect(() => {
    if (loading) return;

    const siteName = currentSettings.siteName || 'NetVentures';
    const siteDesc = currentSettings.siteDescription || 'Premium digital business strategies and insights.';
    const logoUrl = currentSettings.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80';
    const origin = window.location.origin;

    let title = `${siteName} - Premium Digital Business Strategy & SaaS Magazine`;
    let description = siteDesc;
    let canonicalUrl = `${origin}${currentPath}`;
    let image = logoUrl;
    let type = 'website';
    const schemas: any[] = [];

    // Base Organization Schema (Fully mapped, FTC and GSC compliant)
    const orgSchema = {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      "name": siteName,
      "url": origin,
      "logo": {
        "@type": "ImageObject",
        "@id": `${origin}/#logo`,
        "url": logoUrl,
        "caption": siteName
      },
      "image": {
        "@id": `${origin}/#logo`
      }
    };

    // Add Organization Schema globally to all pages' graph context to reinforce authority parameters (EEAT)
    schemas.push(orgSchema);

    const parts = currentPath.split('/');
    const isBlogSingle = parts[1] === 'blog' && parts[2];
    
    if (isBlogSingle) {
      const article = articles.find(a => a.slug === parts[2]);
      if (article) {
        title = article.seoTitle || `${article.title} - ${siteName}`;
        description = article.seoDescription || article.shortDescription;
        canonicalUrl = article.canonicalUrl || `${origin}/blog/${article.slug}`;
        image = article.featuredImage;
        type = 'article';

        // 1. Multi-type Article Schema for maximum Google Discover, Google News, and GSC rich result validation
        const blogPostingSchema = {
          "@type": ["Article", "NewsArticle", "BlogPosting"],
          "@id": `${canonicalUrl}/#article`,
          "isPartOf": {
            "@id": `${origin}/#website`
          },
          "headline": article.title,
          "description": article.shortDescription,
          "image": [article.featuredImage],
          "datePublished": article.publishedAt || new Date().toISOString(),
          "dateModified": article.publishedAt || new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": article.author || "Elena Rostova"
          },
          "publisher": {
            "@id": `${origin}/#organization`
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
          }
        };
        schemas.push(blogPostingSchema);

        // 2. BreadcrumbList Schema
        const breadcrumbSchema = {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}/#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${origin}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": article.title,
              "item": canonicalUrl
            }
          ]
        };
        schemas.push(breadcrumbSchema);

        // 3. FAQPage Schema (if FAQ exists)
        if (article.faq && article.faq.length > 0) {
          const faqSchema = {
            "@type": "FAQPage",
            "mainEntity": article.faq.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          };
          schemas.push(faqSchema);
        }
      } else {
        title = `Route Missing - ${siteName}`;
        description = "The requested consulting blueprint was archived or relocated to safeguard semantic site architecture.";
      }
    } else if (currentPath === '/blog') {
      title = `Library Columns - ${siteName}`;
      description = `Browse our premium library of digital strategies, SaaS case studies, and passive income blueprints.`;
      
      // 1. Blog Schema
      const blogSchema = {
        "@type": "Blog",
        "@id": `${origin}/blog/#blog`,
        "name": `Library Columns - ${siteName}`,
        "description": description,
        "publisher": {
          "@id": `${origin}/#organization`
        }
      };
      schemas.push(blogSchema);

      // 2. Breadcrumbs Schema
      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${origin}/blog/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${origin}/blog`
          }
        ]
      };
      schemas.push(breadcrumbSchema);
    } else if (currentPath === '/search') {
      title = searchQuery ? `Search: "${searchQuery}" - ${siteName}` : `Consulting Library Search - ${siteName}`;
      description = "Utilize our secure, factual search tool to explore SaaS blueprints, cold outreach guides, and content marketing strategies.";
      
      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${origin}/search/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Search Results",
            "item": `${origin}/search`
          }
        ]
      };
      schemas.push(breadcrumbSchema);
    } else if (currentPath === '/about') {
      title = `About Our Editorial Desk - ${siteName}`;
      description = "Learn about our editorial transparency, digital systems expertise, author profiles, and content publishing workflow.";
      
      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${origin}/about/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About",
            "item": `${origin}/about`
          }
        ]
      };
      schemas.push(breadcrumbSchema);
    } else if (currentPath === '/contact') {
      title = `Contact Inquiries - ${siteName}`;
      description = "Get in touch with our administrative or editorial desk for general inquiries, SaaS reviews, or sponsorships.";
      
      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${origin}/contact/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": `${origin}/contact`
          }
        ]
      };
      schemas.push(breadcrumbSchema);
    } else if (currentPath === '/privacy') {
      title = `Privacy Policy - ${siteName}`;
      description = "Our clear data storage, cookie transparency, and editorial security parameters.";
    } else if (currentPath === '/terms') {
      title = `Terms & Conditions - ${siteName}`;
      description = "Intellectual property, compliance mandates, and consulting liability limitations.";
    } else if (currentPath === '/disclosure') {
      title = `Affiliate Marketing Disclosure - ${siteName}`;
      description = "FTC disclosure and partnership details explaining digital server asset funding.";
    } else if (currentPath === '/') {
      // Home Page WebSite Schema with SearchAction for Sitelinks Search Box
      const websiteSchema = {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        "url": origin,
        "name": siteName,
        "description": siteDesc,
        "publisher": {
          "@id": `${origin}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${origin}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
      schemas.push(websiteSchema);
    }

    // Apply Meta Updates to Document Header
    document.title = title;

    const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      let el = isProperty 
        ? document.querySelector(`meta[property="${nameOrProperty}"]`)
        : document.querySelector(`meta[name="${nameOrProperty}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameOrProperty);
        } else {
          el.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('description', description);

    // Canonical link with strict formatting
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Ensure absolute image resolution for social crawlers (Google, Facebook, Twitter, Discord)
    let absoluteImage = image;
    if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
      absoluteImage = `${origin}${image.startsWith('/') ? '' : '/'}${image}`;
    }

    // Open Graph (SEO)
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:image', absoluteImage, true);

    // Twitter Cards (SEO)
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absoluteImage);

    // Dynamic schema graph injector
    let schemaScript = document.getElementById('schema-org-jsonld') as HTMLScriptElement;
    if (schemaScript) schemaScript.remove();

    if (schemas.length > 0) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-org-jsonld';
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemas
      });
      document.head.appendChild(schemaScript);
    }

    // Google Search Console (GSC) Verification tag
    const gscValue = currentSettings?.googleSearchConsoleVerification;
    if (gscValue) {
      let token = gscValue;
      if (gscValue.includes('content=')) {
        const match = gscValue.match(/content="([^"]+)"/) || gscValue.match(/content='([^']+)'/);
        if (match) token = match[1];
      }
      let metaGsc = document.querySelector('meta[name="google-site-verification"]');
      if (!metaGsc) {
        metaGsc = document.createElement('meta');
        metaGsc.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaGsc);
      }
      metaGsc.setAttribute('content', token);
    }

    // Google Analytics 4 (GA4) Tracker injection
    const gaId = currentSettings?.googleAnalyticsId;
    if (gaId && gaId.startsWith('G-')) {
      if (!document.getElementById('google-analytics-script')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'google-analytics-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const gaInitScript = document.createElement('script');
        gaInitScript.id = 'google-analytics-init-script';
        gaInitScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(gaInitScript);
      }
    }
  }, [currentPath, articles, loading, currentSettings]);

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-zinc-900 dark:bg-zinc-850 rounded-2xl shadow-xl flex items-center justify-center animate-pulse">
            <Sparkles className="h-8 w-8 text-gold-500" />
          </div>
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white tracking-wide">
            Loading Net<span className="text-gold-500">Ventures</span> Magazine
          </span>
          <p className="text-xs text-gray-400 font-mono">Assembling clean semantic layout...</p>
        </div>
      </div>
    );
  }

  // Detect Route Matches
  const pathParts = currentPath.split('/');
  const isSingleArticle = pathParts[1] === 'blog' && pathParts[2];
  const activeArticleSlug = isSingleArticle ? pathParts[2] : null;

  // Render Hidden CMS View (Strictly separated from the public layouts)
  if (currentPath === '/secret-cms-login') {
    return (
      <AdminLayout 
        navigate={navigate}
        categories={categories}
        tags={tags}
        onRefreshData={fetchAllData}
      />
    );
  }

  // ==========================================
  // VIEW RENDER LOGIC
  // ==========================================

  const renderActiveView = () => {
    
    // ----------------------------------------
    // 1. ARTICLE DETAIL VIEW
    // ----------------------------------------
    if (activeArticleSlug) {
      const article = articles.find(a => a.slug === activeArticleSlug);

      if (!article) {
        return render404();
      }

      const category = categories.find(c => c.id === article.categoryId);
      const relatedArticles = articles
        .filter(a => a.id !== article.id && a.categoryId === article.categoryId)
        .slice(0, 3);

      const findNextPrevious = () => {
        const idx = articles.findIndex(a => a.id === article.id);
        const next = idx > 0 ? articles[idx - 1] : null;
        const prev = idx < articles.length - 1 ? articles[idx + 1] : null;
        return { next, prev };
      };
      const { next, prev } = findNextPrevious();

      return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
          {/* Breadcrumb Schema */}
          <nav className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-gold-500 transition-colors">Home</button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={() => navigate('/blog')} className="hover:text-gold-500 transition-colors">Blog</button>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <button 
                  onClick={() => {
                    setSelectedCategorySlug(category.slug);
                    navigate('/blog');
                  }} 
                  className="hover:text-gold-500 transition-colors capitalize"
                >
                  {category.name}
                </button>
              </>
            )}
          </nav>

          {/* Heading block */}
          <div className="space-y-4">
            {category && (
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
                {category.name}
              </span>
            )}
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed italic border-l-2 border-gold-500 pl-4">
              {article.shortDescription}
            </p>

            {/* Author and Metadata details */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-b border-gray-100 dark:border-zinc-900/50 pb-6 text-xs text-gray-400 dark:text-gray-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {article.author.slice(0, 2).toUpperCase()}
                </div>
                {article.author}
              </span>
              <span>Published: {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readingTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.views} views</span>
            </div>
          </div>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Cover Image */}
              <div className="rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-900">
                <img 
                  src={article.featuredImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Dynamic Table of Contents (Render on Mobile inside columns) */}
              <div className="block lg:hidden">
                <Toc content={article.content} />
              </div>

              {/* Article Content Render */}
              <div className="markdown-body text-gray-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed space-y-6">
                {article.content.split('\n\n').map((chunk, index) => {
                  if (chunk.startsWith('## ')) {
                    const txt = chunk.replace('## ', '');
                    const headingId = txt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return <h2 key={index} id={headingId}>{txt}</h2>;
                  }
                  if (chunk.startsWith('### ')) {
                    const txt = chunk.replace('### ', '');
                    const headingId = txt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return <h3 key={index} id={headingId}>{txt}</h3>;
                  }
                  if (chunk.startsWith('* ') || chunk.startsWith('- ')) {
                    return (
                      <ul key={index}>
                        {chunk.split('\n').map((li, i) => (
                          <li key={i}>{li.replace(/^[\s*-]+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  // Table parser
                  if (chunk.startsWith('|')) {
                    const rows = chunk.split('\n').filter(Boolean);
                    const parseCols = (rowStr: string) => rowStr.split('|').map(c => c.trim()).filter(Boolean);
                    return (
                      <div key={index} className="overflow-x-auto my-6 border border-gray-100 dark:border-zinc-800 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                              {parseCols(rows[0]).map((th, i) => (
                                <th key={i} className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">{th}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 text-sm text-gray-600 dark:text-gray-300">
                            {rows.slice(2).map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {parseCols(row).map((td, tdIdx) => (
                                  <td key={tdIdx} className="px-4 py-3">{td}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return <p key={index}>{chunk}</p>;
                })}
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-zinc-900/50">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate('/blog');
                    }}
                    className="cursor-pointer px-3 py-1.5 rounded-lg font-mono text-xs bg-zinc-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors capitalize"
                  >
                    #{tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>

              {/* FAQs accordion block */}
              {article.faq && article.faq.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-900/50 space-y-4">
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="h-5 w-5 text-gold-500" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {article.faq.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{item.question}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share & Affiliate Disclaimer reference */}
              <div className="mt-8 space-y-6">
                <SocialShare 
                  url={article.canonicalUrl || `${window.location.origin}/blog/${article.slug}`} 
                  title={article.seoTitle || article.title} 
                />
                
                <div className="p-4 rounded-xl border border-gray-100 dark:border-zinc-900 bg-amber-500/2 dark:bg-amber-500/1 border-amber-500/10 text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-sans">
                  <strong>Editorial Transparency:</strong> Elena and the editorial team only recommend products we have personally vetted, configured, or integrated. Read our complete{' '}
                  <button onClick={() => navigate('/disclosure')} className="font-semibold underline hover:text-gold-500">
                    Affiliate Disclosure
                  </button>.
                </div>
              </div>

              {/* Next/Previous Article Nav links */}
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-900/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <div 
                    onClick={() => navigate(`/blog/${prev.slug}`)}
                    className="p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-gold-500/30 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Previous Article</span>
                    <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mt-2 line-clamp-2">{prev.title}</h4>
                  </div>
                ) : <div />}

                {next ? (
                  <div 
                    onClick={() => navigate(`/blog/${next.slug}`)}
                    className="p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-gold-500/30 transition-all cursor-pointer flex flex-col justify-between text-right"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-end gap-1">Next Article <ChevronRight className="h-3 w-3" /></span>
                    <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mt-2 line-clamp-2">{next.title}</h4>
                  </div>
                ) : <div />}
              </div>

            </div>

            {/* Right Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <Toc content={article.content} />
              
              {/* Popular Insights Widget */}
              <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
                <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-900 pb-2">
                  Popular Insights
                </h4>
                <div className="divide-y divide-gray-100 dark:divide-zinc-900/60 space-y-3.5">
                  {articles
                    .filter(a => a.id !== article.id)
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((art, idx) => (
                      <div 
                        key={art.id} 
                        onClick={() => navigate(`/blog/${art.slug}`)}
                        className="pt-3.5 flex gap-3.5 items-start cursor-pointer group"
                      >
                        <span className="font-display font-bold text-xl text-gray-200 dark:text-zinc-800 group-hover:text-gold-500 transition-colors">
                          0{idx + 1}
                        </span>
                        <div className="space-y-0.5">
                          <h5 className="font-display font-bold text-xs text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-2">
                            {art.title}
                          </h5>
                          <p className="text-[10px] font-mono text-gray-400">{art.views} views</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Latest Blueprints Widget */}
              <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
                <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-900 pb-2">
                  Latest Blueprints
                </h4>
                <div className="divide-y divide-gray-100 dark:divide-zinc-900/60 space-y-3.5">
                  {articles
                    .filter(a => a.id !== article.id)
                    .slice(0, 3)
                    .map((art) => (
                      <div 
                        key={art.id} 
                        onClick={() => navigate(`/blog/${art.slug}`)}
                        className="pt-3.5 cursor-pointer group space-y-1"
                      >
                        <h5 className="font-display font-bold text-xs text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-2">
                          {art.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                          <span>{new Date(art.publishedAt).toLocaleDateString('en', {month: 'short', day: 'numeric'})}</span>
                          <span>•</span>
                          <span>{art.readingTime} min read</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-center space-y-4">
                <Compass className="h-8 w-8 text-gold-500 mx-auto" />
                <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">Need custom guidance?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Click the floating <strong>"Ask NetBot"</strong> co-pilot button at the bottom right. Our AI assistant only answers based on published research and facts.
                </p>
              </div>
            </aside>

          </div>

          {/* Related Articles row */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-100 dark:border-zinc-900/50 space-y-6">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">Related Insight Columns</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map(art => (
                  <ArticleCard 
                    key={art.id} 
                    article={art} 
                    category={category}
                    onClick={() => navigate(`/blog/${art.slug}`)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* In-article newsletter form */}
          <div className="mt-12">
            <Newsletter />
          </div>
        </article>
      );
    }

    // ----------------------------------------
    // 2.5. SEARCH RESULT DEDICATED VIEW
    // ----------------------------------------
    if (currentPath === '/search') {
      const filtered = articles.filter(art => {
        const query = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query) ||
          art.shortDescription.toLowerCase().includes(query) ||
          art.tags.some(t => t.toLowerCase().includes(query))
        );
      });

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-gold-500 font-bold uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full">Factual Search Query</span>
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : "Consulting Library Search"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed text-sm">
              Explore factual code blueprints, SEO guides, and passive income methodologies matching your criteria.
            </p>
          </div>

          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const url = new URL(window.location.href);
                if (e.target.value) {
                  url.searchParams.set('q', e.target.value);
                } else {
                  url.searchParams.delete('q');
                }
                window.history.replaceState(null, '', url.pathname + url.search);
              }}
              placeholder="Search library by keyword, tag, title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
          </div>

          {searchQuery && filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {filtered.map(art => (
                <ArticleCard 
                  key={art.id} 
                  article={art} 
                  category={categories.find(c => c.id === art.categoryId)}
                  onClick={() => navigate(`/blog/${art.slug}`)} 
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto space-y-3">
              <p className="text-gray-400 font-medium">No blueprints matched your search query.</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Check spelling, try broader keywords, or reset query parameter to browse the full library.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-gold-500 hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 font-medium">Explore some of our popular categories:</p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      navigate('/blog');
                    }}
                    className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-gold-500/30 transition-all cursor-pointer text-center space-y-2 flex flex-col justify-between"
                  >
                    <p className="font-display font-bold text-sm text-gray-900 dark:text-white capitalize">{cat.name}</p>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ----------------------------------------
    // 2. BLOG CATALOGUE / SEARCH VIEW
    // ----------------------------------------
    if (currentPath === '/blog') {
      const filtered = articles.filter(art => {
        const matchesCategory = selectedCategorySlug 
          ? categories.find(c => c.slug === selectedCategorySlug)?.id === art.categoryId
          : true;
        const matchesSearch = searchQuery 
          ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        return matchesCategory && matchesSearch;
      });

      const articlesPerPage = 6;
      const totalPages = Math.ceil(filtered.length / articlesPerPage);
      const paginatedArticles = filtered.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
      );

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="space-y-4">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">The NetVentures Library</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Explore professional step-by-step strategies, SaaS reviews, case studies, and monetization Blueprints. Filter by category or search below.
            </p>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-zinc-900 pb-6">
            <button
              onClick={() => setSelectedCategorySlug(null)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategorySlug === null
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-800'
              }`}
            >
              All Columns
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategorySlug === cat.slug
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Interactive Search inputs bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library by keyword, tag, title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 px-2 py-1 text-[10px] bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-500 rounded font-mono"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Article grid rendering with pagination */}
          {paginatedArticles.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {paginatedArticles.map(art => (
                  <ArticleCard 
                    key={art.id} 
                    article={art} 
                    category={categories.find(c => c.id === art.categoryId)}
                    onClick={() => navigate(`/blog/${art.slug}`)} 
                  />
                ))}
              </div>

              {/* Pagination controls widget */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-zinc-900/60 font-mono text-xs text-gray-500">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-850 hover:border-gold-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-zinc-950"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  
                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <span className="sm:hidden text-xs">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-850 hover:border-gold-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-zinc-950"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto space-y-3">
              <p className="text-gray-400 font-medium">No columns matched your filters.</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Try searching a different keyword or check the "All Columns" category. Alternatively, ask our chatbot co-pilot in the floating menu.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategorySlug(null); }}
                className="text-xs font-semibold text-gold-500 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      );
    }

    // ----------------------------------------
    // 3. ABOUT PAGE (Editorial profile)
    // ----------------------------------------
    if (currentPath === '/about') {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="space-y-4 text-center">
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500">
              The Editorial Desk
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">Our Mission & Principles</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
              Providing clear, factual frameworks to help programmers, designers, and marketers transition into automated high-ticket consulting.
            </p>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Strict Editorial Code</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We do not publish generic content or simple programmatic fluff. Every guide, SaaS review, and case study on NetVentures represents real testing, real lines of code, and verified workflows.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Our content must pass rigorous clarity checklists. If a workflow or integration is prone to errors, we outline troubleshooting procedures and code snippets in the article faq so developers have zero points of friction.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-900/50 space-y-4">
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">Core Pillars We Teach</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">✔ High-Ticket Affiliate Marketing</li>
                <li className="flex items-center gap-2">✔ Cold Outreach & Enrichment Automations</li>
                <li className="flex items-center gap-2">✔ Generative Content Engines (GEO)</li>
                <li className="flex items-center gap-2">✔ SaaS Product Reviews & Deep Tutorials</li>
                <li className="flex items-center gap-2">✔ Solopreneur Consulting Retainers</li>
              </ul>
            </div>
          </div>

          {/* Premium Brand names suggestions box (Explicitly Requested by user!) */}
          <div className="p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-linear-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles className="h-5 w-5 text-gold-500" />
              <h3 className="font-display font-bold text-lg">Platform Suggestions: Premium Brand Names</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              As part of our commitment to helping users start digital ventures, our naming team designed 10 premium, short, and highly memorable brand names tailored for online wealth, AI operations, and content platforms:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { name: '1. NetVentures', desc: 'Sleek, enterprise-level digital magazine branding.' },
                { name: '2. AIBizJournal', desc: 'Authority branding focusing on artificial intelligence.' },
                { name: '3. IncomeVanguard', desc: 'Suggests forward-thinking investment and passive income.' },
                { name: '4. DigitalVanguard', desc: 'Premium, modern web consulting or media imprint.' },
                { name: '5. VenturesFlow', desc: 'Casual, action-oriented startup blogging brand.' },
                { name: '6. RevenueRise', desc: 'Catchy, memorable brand for newsletters or SaaS reviews.' },
                { name: '7. AIWealthLab', desc: 'Tech-forward name focusing on automation and finance.' },
                { name: '8. DigitalAvenue', desc: 'Classic, professional branding for online business directories.' },
                { name: '9. SolopreneurLab', desc: 'Niche, hyper-targeted brand for single-operator tutorials.' },
                { name: '10. ApexIncome', desc: 'Strong, high-ticket agency and financial consultation brand.' }
              ].map((brand, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-zinc-900/60 rounded-xl border border-gray-100 dark:border-zinc-850">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm font-display">{brand.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------
    // 4. CONTACT PAGE
    // ----------------------------------------
    if (currentPath === '/contact') {
      const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setContactSuccess(false), 4000);
      };

      return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
          <div className="space-y-3 text-center">
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white tracking-tight">Connect with Elena</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed text-sm">
              Inquiries regarding partnerships, SaaS evaluations, or programmatic audits? Drop us a line below.
            </p>
          </div>

          {contactSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3 animate-fade-in">
              <div>
                <p className="font-bold">Transmission Secured!</p>
                <p className="text-sm mt-1 leading-relaxed">Our editorial staff enriches and filters inquiry emails using AI. We typically reply within 24 business hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    placeholder="Elena Rostova"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Location</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    placeholder="elena@netventures.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Subject Outline</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  placeholder="Programmatic SEO consulting request"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Inquiry Details</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Explain your objectives or consulting budgets clearly..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="h-4 w-4" /> Transmit Secure Message
              </button>
            </form>
          )}
        </div>
      );
    }

    // ----------------------------------------
    // 5. PRIVACY POLICY
    // ----------------------------------------
    if (currentPath === '/privacy') {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white tracking-tight">Privacy Protocol</h1>
          <p className="text-xs font-mono text-gray-400">Last Modified: July 2026 | EEAT Compliant</p>
          
          <p className="text-sm">
            At NetVentures, we prioritize editorial integrity and security. This privacy document outlines how we log, manage, and secure information transmitted via our newsletters, cookie-less search requests, and contact forms.
          </p>

          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mt-6">1. Data Storage & Local Persistence</h2>
          <p className="text-sm leading-relaxed">
            We store only minimal, necessary information (like name and email addresses for those who explicitly subscribe to the newsletter). We utilize standard client-side state managers and secure, local JSON databases hosted on server containers. We do not sell, rent, or lease subscriber lists to third-party ad exchanges or tracking networks.
          </p>

          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mt-6">2. Conversational Logs Policy</h2>
          <p className="text-sm leading-relaxed">
            The floating AI Co-pilot (NetBot) operates in memory. Chat histories sent to our secure Gemini proxy API endpoints are processed with temperature settings and strict system instructions to guarantee factual responses. No chat logs are stored persistently on third-party servers.
          </p>
        </div>
      );
    }

    // ----------------------------------------
    // 6. TERMS & CONDITIONS
    // ----------------------------------------
    if (currentPath === '/terms') {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white tracking-tight">Terms & Conditions</h1>
          <p className="text-xs font-mono text-gray-400">Effective: July 2026</p>

          <p className="text-sm">
            Welcome to NetVentures. By browsing our premium business magazine, consulting posts, and using our floating AI NetBot chatbot co-pilot, you agree to comply with our editorial terms.
          </p>

          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mt-6">1. Intellectual Property & Copying</h2>
          <p className="text-sm leading-relaxed">
            All original case study graphics, code snippets, automation workflows, and step-by-step drafting parameters published on NetVentures are copy-protected but can be modified for personal development. Programmatic copying, scraper scripts, or using our articles to train unauthorized AI models without citing our canonical URLs is strictly prohibited.
          </p>

          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mt-6">2. Liability Limitation</h2>
          <p className="text-sm leading-relaxed">
            Our columns focus on strategies for making money online and automating pipelines. While we share case study earnings, we offer zero financial warranties. Digital entrepreneurship involves technical risks, and individual conversion rates will fluctuate.
          </p>
        </div>
      );
    }

    // ----------------------------------------
    // 7. AFFILIATE DISCLOSURE
    // ----------------------------------------
    if (currentPath === '/disclosure') {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white tracking-tight">Affiliate Disclosure Notice</h1>
          <p className="text-xs font-mono text-gray-400">Updated: July 2026 | FTC Compliant</p>

          <p className="text-sm leading-relaxed">
            In compliance with FTC guidelines, we state clearly that NetVentures participates in various high-ticket software affiliate programs (such as Clay, Make, and cloud infrastructures). This means we receive recurring commission referrals if you sign up using our relative links, at zero additional cost to you.
          </p>

          <p className="text-sm leading-relaxed">
            <strong>Why we use affiliate links:</strong> Running a modern business magazine with dynamic AI co-pilots requires server compute. Affiliate partnerships allow us to provide high-value, code-verified tutorials completely free to beginners without resorting to annoying popup advertisements or paywalls.
          </p>
        </div>
      );
    }

    // ----------------------------------------
    // 8. DEFAULT MAGAZINE HOME PAGE
    // ----------------------------------------
    if (currentPath === '/') {
      const featuredArticle = articles[0];
      const latestArticles = articles.slice(1, 4);
      const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

      return (
        <div className="space-y-16 animate-fade-in">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-zinc-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 py-16 sm:py-24 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gold-500/10 via-zinc-950 to-zinc-950" />
            
            <div className="relative max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-zinc-950 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-current" /> AI & Automation Solopreneurs
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                Unlock the Automated <span className="text-gold-500">Digital Income</span> Framework
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                We design and publish battle-tested step-by-step blueprints, cold outreach setups, SaaS evaluations, and programmatic SEO guidelines to automate your digital wealth.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button 
                  onClick={() => navigate('/blog')}
                  className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  Explore blueprints <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-gray-300 font-semibold text-sm hover:text-white transition-all cursor-pointer"
                >
                  Editorial Principles
                </button>
              </div>
            </div>
          </section>

          {/* Featured Article Spot block */}
          {featuredArticle && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight">Featured Editorial Columns</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-widest">Hand-crafted high value case reviews</p>
                </div>
              </div>

              <div 
                onClick={() => navigate(`/blog/${featuredArticle.slug}`)}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer p-6 rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-gold-500/20 hover:shadow-xl dark:hover:shadow-gold-500/1 transition-all duration-300"
              >
                <div className="lg:col-span-7 aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img 
                    src={featuredArticle.featuredImage} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:col-span-5 space-y-4">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500">
                    {categories.find(c => c.id === featuredArticle.categoryId)?.name || 'Featured'}
                  </span>
                  
                  <h4 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors leading-tight">
                    {featuredArticle.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {featuredArticle.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                    <span>{featuredArticle.readingTime} min read</span>
                    <span>•</span>
                    <span>{featuredArticle.views} views</span>
                  </div>

                  <div className="pt-4 flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-gold-500 transition-colors">
                    Read Column <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Latest and Popular Columns */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Latest lists */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight">The Latest Blueprints</h3>
                <p className="text-xs text-gray-400 uppercase font-mono tracking-widest mt-1">SaaS, Automation, SEO columns</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestArticles.map(art => (
                  <ArticleCard 
                    key={art.id} 
                    article={art} 
                    category={categories.find(c => c.id === art.categoryId)}
                    onClick={() => navigate(`/blog/${art.slug}`)} 
                  />
                ))}
              </div>

              <div className="pt-4 text-center">
                <button 
                  onClick={() => navigate('/blog')}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider hover:text-gold-500 dark:hover:text-gold-500 transition-colors cursor-pointer"
                >
                  Browse Full Library
                </button>
              </div>
            </div>

            {/* Popular columns sidebar list */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight">Popular Insights</h3>
                <p className="text-xs text-gray-400 uppercase font-mono tracking-widest mt-1">High views & click volumes</p>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-900/60 space-y-4">
                {popularArticles.map((art, idx) => (
                  <div 
                    key={art.id}
                    onClick={() => navigate(`/blog/${art.slug}`)}
                    className="pt-4 flex gap-4 items-start cursor-pointer group"
                  >
                    <span className="font-display font-bold text-3xl text-gray-200 dark:text-zinc-800 group-hover:text-gold-500 transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-500">
                        {categories.find(c => c.id === art.categoryId)?.name || 'Insight'}
                      </p>
                      <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-[11px] font-mono text-gray-400">{art.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* Categories visual list */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight">Silo Content Hubs</h3>
              <p className="text-xs text-gray-400 uppercase font-mono tracking-widest">Generative optimization categories</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategorySlug(cat.slug);
                    navigate('/blog');
                  }}
                  className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:border-gold-500/30 transition-all cursor-pointer text-center space-y-2 flex flex-col justify-between"
                >
                  <p className="font-display font-bold text-sm text-gray-900 dark:text-white capitalize">{cat.name}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Home Page Newsletter Capture */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Newsletter />
          </section>
        </div>
      );
    }

    // Default to 404
    return render404();
  };

  const render404 = () => {
    const recent = articles.slice(0, 3);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="p-4 bg-zinc-900 dark:bg-zinc-850 rounded-2xl w-16 h-16 flex items-center justify-center text-white text-xl font-bold mx-auto">
          404
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Consulting Route Missing</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            The requested consulting blueprint was archived or relocated to safeguard semantic site architecture. Search our active index instead:
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/search');
              }
            }}
            placeholder="Search active columns..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
        </div>

        {recent.length > 0 && (
          <div className="pt-6 border-t border-gray-150 dark:border-zinc-900 space-y-4">
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Active Strategic Columns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {recent.map(art => (
                <div 
                  key={art.id} 
                  onClick={() => navigate(`/blog/${art.slug}`)}
                  className="p-4 rounded-xl border border-gray-100 dark:border-zinc-850 bg-white dark:bg-zinc-950 hover:border-gold-500/30 transition-all cursor-pointer"
                >
                  <h4 className="font-display font-bold text-xs text-gray-900 dark:text-white line-clamp-2">{art.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">{art.readingTime} min read</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-zinc-950 dark:bg-white hover:bg-zinc-850 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Return to magazine
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Dynamic Header */}
      <Header 
        currentPath={currentPath}
        navigate={navigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Supabase Connection Banner Fallback */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center">
          <p className="text-xs text-amber-800 dark:text-amber-400 font-mono flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>Supabase is not configured yet. Running in offline fallback mode. Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable live Supabase persistence.</span>
          </p>
        </div>
      )}

      {/* Main Container View */}
      <main className="flex-1 py-8">
        {renderActiveView()}
      </main>

      {/* Floating conversational co-pilot */}
      <Chatbot />

      {/* Dynamic Footer */}
      <Footer navigate={navigate} settings={currentSettings} />

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <span className="font-display font-semibold text-sm text-gray-900 dark:text-white">Factual Library Search</span>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-mono"
              >
                ESC / CLOSE
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchOpen(false);
                    navigate('/blog');
                  }
                }}
                placeholder="Search articles (e.g. AI tools, Passive Income...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-hidden focus:ring-1 focus:ring-gold-500"
              />
              <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            </div>

            <div className="text-[11px] text-gray-400">
              Press <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Enter</kbd> to view search results inside library columns.
            </div>
          </div>
        </div>
      )}

      {/* GDPR Cookie Consent Banner */}
      {!cookieConsent && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 shadow-2xl p-5 rounded-2xl space-y-4 animate-fade-in">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">Cookie Consent Protocol</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We utilize technical cookies to enhance site navigation, measure programmatic traffic, and optimize our floating co-pilot. All processing aligns with EEAT standard guidelines.
            </p>
          </div>
          <div className="flex items-center gap-3 justify-end text-xs font-semibold">
            <button
              onClick={() => {
                localStorage.setItem('cookieConsent', 'declined');
                setCookieConsent('declined');
              }}
              className="px-3.5 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={() => {
                localStorage.setItem('cookieConsent', 'accepted');
                setCookieConsent('accepted');
              }}
              className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              Accept Consent
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
