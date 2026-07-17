import React from 'react';
import { Clock, Eye, Calendar, User, ArrowRight } from 'lucide-react';
import { Article, Category } from '../types.js';

interface ArticleCardProps {
  key?: React.Key;
  article: Article;
  category?: Category;
  onClick: () => void;
}

export default function ArticleCard({ article, category, onClick }: ArticleCardProps) {
  // Format publish date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article 
      onClick={onClick}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-gold-500/30 hover:shadow-lg dark:hover:shadow-gold-500/2 transition-all duration-300 cursor-pointer"
    >
      {/* Featured Image Container */}
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-900">
        <img 
          src={article.featuredImage} 
          alt={article.title}
          loading="lazy"
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {category && (
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 shadow-sm">
            {category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Meta Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-gray-400 dark:text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views} views
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors duration-200 line-clamp-2 leading-snug">
          {article.title}
        </h3>

        {/* Short Description */}
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
          {article.shortDescription}
        </p>

        {/* Tags & Action Row */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 max-w-[70%]">
            {article.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 capitalize"
              >
                #{tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-gold-500 transition-colors">
            Read <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
