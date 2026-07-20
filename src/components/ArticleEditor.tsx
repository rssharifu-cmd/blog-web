import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Eye, FileEdit, Sparkles } from 'lucide-react';
import { Category, Tag, ArticleInput, Article } from '../types.js';
import { getArticleById, saveArticle, uploadFeaturedImage } from '../lib/supabase.js';

interface ArticleEditorProps {
  articleId: string | null;
  categories: Category[];
  tags: Tag[];
  onClose: () => void;
  getToken: () => string;
}

export default function ArticleEditor({ articleId, categories, tags, onClose, getToken }: ArticleEditorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editor Tabs: 'write' | 'preview'
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Input states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [author, setAuthor] = useState('Elena Rostova');

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // FAQs
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Prebuilt premium background options for fast composing
  const coverOptions = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=630&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=630&q=80'
  ];

  // If editing an existing article, fetch its details
  useEffect(() => {
    if (articleId) {
      setLoading(true);
      getArticleById(articleId)
        .then((data) => {
          if (!data) throw new Error('Failed to find article details');
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setShortDescription(data.shortDescription);
          setCategoryId(data.categoryId);
          setSelectedTags(data.tags);
          setStatus(data.status);
          setFeaturedImage(data.featuredImage);
          setAuthor(data.author);
          setSeoTitle(data.seoTitle || '');
          setSeoDescription(data.seoDescription || '');
          setCanonicalUrl(data.canonicalUrl || '');
          setFaq(data.faq || []);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // Setup default placeholder categories & image
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
      setFeaturedImage(coverOptions[0]);
    }
  }, [articleId, categories]);

  // Handle Title change and auto-slugify
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
      setSeoTitle(`${val} - NetVentures`);
      setCanonicalUrl(`https://netventures.online/blog/${generated}`);
    }
  };

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug) ? prev.filter((t) => t !== tagSlug) : [...prev, tagSlug]
    );
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaq((prev) => [...prev, { question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveFaq = (idx: number) => {
    setFaq((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const articleInput = {
      id: articleId || undefined,
      title,
      slug,
      content,
      shortDescription,
      categoryId,
      tags: selectedTags,
      status,
      featuredImage,
      author,
      seoTitle: seoTitle || `${title} - NetVentures`,
      seoDescription: seoDescription || shortDescription,
      canonicalUrl: canonicalUrl || `https://netventures.online/blog/${slug}`,
      faq,
    };

    try {
      const saved = await saveArticle(articleInput);
      if (!saved) {
        throw new Error('Failed to persist article changes');
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
              {articleId ? 'Edit Editorial Post' : 'Compose New Business Post'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Define metadata, write content, and configure SEO markup.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Editor tab switches */}
          <div className="flex bg-gray-100 dark:bg-zinc-800/80 p-0.5 rounded-lg mr-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'write' ? 'bg-white dark:bg-zinc-900 shadow-xs text-gray-900 dark:text-white' : 'text-gray-500'
              }`}
            >
              <FileEdit className="h-3.5 w-3.5" /> Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-white dark:bg-zinc-900 shadow-xs text-gray-900 dark:text-white' : 'text-gray-500'
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Live Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Draft / Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-500 text-xs flex gap-2">
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'write' ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main composition card */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Slug */}
            <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/80">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Article Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a compelling premium title..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-base font-bold tracking-tight focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">SEO Friendly Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ai-powered-content-empire"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-xs font-mono focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Author Pen Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Elena Rostova"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* Markdown editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Article Body (Markdown Enabled)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Supports ## headings, tables, lists, and code blocks</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your high-value article here. Use ## markdown syntax for headings to automatically compile the Table of Contents."
                required
                rows={16}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm leading-relaxed font-sans focus:outline-hidden focus:ring-1 focus:ring-gold-500 font-mono"
              />
            </div>

            {/* FAQ Block */}
            <div className="p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Article FAQ Block (JSON-LD Supported)</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Embed micro-questions to boost generative engine and search index authority.</p>
              </div>

              {faq.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {faq.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-start justify-between gap-4">
                      <div className="text-xs">
                        <p className="font-bold text-gray-900 dark:text-white">Q: {item.question}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">A: {item.answer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide the direct, helpful answer..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-gold-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar configurations card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status & Category */}
            <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Publish Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      status === 'draft'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-transparent'
                        : 'border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      status === 'published'
                        ? 'bg-emerald-500 text-white border-transparent'
                        : 'border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Category Silo</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-gold-500 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Short Abstract (Snippet)</label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Enter a brief, scannable summary for cards and search snippets (max 160 characters)..."
                  rows={3}
                  maxLength={250}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-750 dark:text-gray-300 focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Featured Image URL</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-750 dark:text-gray-300 focus:ring-1 focus:ring-gold-500"
                  />
                  <label className="px-3 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center transition-all">
                    Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setError(null);
                            setLoading(true);
                            const publicUrl = await uploadFeaturedImage(file);
                            setFeaturedImage(publicUrl);
                          } catch (err: any) {
                            setError('Image upload failed: ' + err.message);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Cover Presets */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Or Choose Premium Cover Cover Preset</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {coverOptions.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFeaturedImage(src)}
                      className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        featuredImage === src ? 'border-gold-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={src} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags checkboxes */}
            <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/80 space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Content Keyword Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isChecked = selectedTags.includes(tag.slug);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.slug)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize font-mono border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-transparent shadow-xs'
                          : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      #{tag.name.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEO Tuning Box */}
            <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-gold-500" /> SEO & Generative Engine Tuning
              </h3>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">SEO Title (Ideal: Under 60 Chars)</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Catchy Title - NetVentures"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-750 dark:text-gray-300 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Meta Description (Ideal: Under 155 Chars)</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Summary for search results page description..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-750 dark:text-gray-300 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Canonical URL (Cross-Silo Preservation)</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://netventures.online/blog/..."
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-750 dark:text-gray-300 focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

          </div>

        </form>
      ) : (
        /* Real-time HTML Content preview mode */
        <div className="space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img src={featuredImage} alt={title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-zinc-950 uppercase mb-3">
                {categories.find(c => c.id === categoryId)?.name || 'Editorial'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">{title || 'Untitled Draft Post'}</h1>
              <p className="text-xs text-gray-300 font-mono mt-2">By {author} | Status: <span className="uppercase text-gold-500 font-bold">{status}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            {/* Left Preview Body */}
            <div className="lg:col-span-8 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed italic border-l-2 border-gold-500 pl-4 mb-6">
                {shortDescription || 'Provide a brief summary snippet...'}
              </p>

              {/* Simulating Markdown rendering body */}
              <div className="markdown-body">
                {content ? (
                  content.split('\n\n').map((chunk, index) => {
                    if (chunk.startsWith('## ')) {
                      return <h2 key={index}>{chunk.replace('## ', '')}</h2>;
                    }
                    if (chunk.startsWith('### ')) {
                      return <h3 key={index}>{chunk.replace('### ', '')}</h3>;
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
                    return <p key={index}>{chunk}</p>;
                  })
                ) : (
                  <p className="text-gray-400 italic">No content typed yet. Type your draft inside the Editor tab.</p>
                )}
              </div>

              {faq.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {faq.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Q: {item.question}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 leading-relaxed">A: {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Preview Meta info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs">
                <p className="font-bold uppercase tracking-wider text-gray-400">SEO & Schema Audit</p>
                <div>
                  <p className="text-gray-400">Meta Title:</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{seoTitle || `${title} - NetVentures`}</p>
                </div>
                <div>
                  <p className="text-gray-400">Meta Description:</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">{seoDescription || shortDescription}</p>
                </div>
                <div>
                  <p className="text-gray-400">Canonical Location:</p>
                  <p className="text-gray-500 font-mono mt-0.5 break-all">{canonicalUrl || `https://netventures.online/blog/${slug}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
