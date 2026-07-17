import React from 'react';
import { AlignLeft, ArrowDown } from 'lucide-react';

interface TocProps {
  content: string;
}

export interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

export default function Toc({ content }: TocProps) {
  // Parse headings from raw markdown content
  const getHeadings = (md: string): HeadingItem[] => {
    const lines = md.split('\n');
    const headingList: HeadingItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        headingList.push({ text, id, level });
      }
    });

    return headingList;
  };

  const headings = getHeadings(content);

  if (headings.length === 0) return null;

  const handleScrollTo = (id: string) => {
    // Look for matching elements
    // In our markdown body, we can give h2/h3 tags custom ids, or let's find heading elements with matching text content!
    const elements = Array.from(document.querySelectorAll('.markdown-body h2, .markdown-body h3'));
    const targetElement = elements.find((el) => {
      const elId = el.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return elId === id;
    });

    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-5 rounded-xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-zinc-900">
        <AlignLeft className="h-4 w-4 text-gold-500" />
        <span>Table of Contents</span>
      </div>

      <nav className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {headings.map((heading, idx) => (
          <button
            key={idx}
            onClick={() => handleScrollTo(heading.id)}
            className={`block text-left text-xs text-gray-500 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-500 transition-colors font-medium cursor-pointer leading-relaxed ${
              heading.level === 3 ? 'pl-4 border-l border-gray-100 dark:border-zinc-900 ml-1 py-0.5' : 'py-1'
            }`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
