import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw, ChevronDown, ArrowUpRight } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm NetBot, your AI co-pilot here at NetVentures. Ask me anything about our published articles on making money online, SaaS platforms, SEO frameworks, or automation strategies!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: "AI Content Scaling", text: "What is the strategy for scaling an AI content empire?" },
    { label: "Outreach Automation", text: "How do you automate cold outreach using Clay and Make?" },
    { label: "High-Ticket Affiliate", text: "What is the difference between high-ticket and low-ticket affiliate marketing?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const generateSmartFallback = (text: string) => {
    const query = text.toLowerCase();
    let reply = "That's a fantastic question. At NetVentures, we focus heavily on building scalable digital leverage. ";

    if (query.includes('ai') || query.includes('content') || query.includes('gpt') || query.includes('gemini')) {
      reply = "### Scaling an AI Content Empire\n\nTo build a highly optimized AI-driven content flywheel, follow this 3-step blueprint:\n\n1. **Programmatic Keyword Mapping**: Target low-competition informational queries with high transaction intent.\n2. **AI Co-Writing & Editorial Polish**: Avoid copy-pasting raw outputs. Elevate content with personal case studies, unique tables, and professional vocabulary.\n3. **Generative Engine Tuning (GEO)**: Optimize for LLM citation engines by providing direct, structured Q&A blocks and rich schema JSON-LD markup.";
    } else if (query.includes('outreach') || query.includes('clay') || query.includes('make') || query.includes('automation')) {
      reply = "### High-Converting Outreach Automation\n\nAutomating your cold pipeline requires high-quality enrichment rather than pure volume:\n\n1. **Enrichment with Clay**: Connect sources like LinkedIn Sales Navigator, Crunchbase, and GitHub. Gather personalized details (e.g., specific job listings, tech stack data).\n2. **Agentic Workflows via Make**: Route enriched data to OpenAI/Gemini to draft ultra-personalized outreach sequences that speak directly to the lead's current pain points.\n3. **Deliverability Protection**: Spin up secondary domains (Google Workspace or Microsoft 365) and warm them up using services like Instantly.ai before initiating sequences.";
    } else if (query.includes('affiliate') || query.includes('high-ticket') || query.includes('commission')) {
      reply = "### High-Ticket Affiliate Marketing Framework\n\nUnlike traditional low-ticket marketing (e.g., selling cheap physical goods), high-ticket affiliate programs pay $500 to $3,000+ per conversion:\n\n- **The Target Audience**: Focus on B2B SaaS, enterprise operations tools, high-ticket masterminds, or private financial coaching.\n- **Silo Construction**: Build deep educational content (comparisons, video walkthroughs, pricing breakdowns) that attracts decision-makers ready to purchase.\n- **SaaS Programs**: Top-tier software suites like HubSpot, ActiveCampaign, or ClickFunnels offer lucrative recurring commissions.";
    } else if (query.includes('make money') || query.includes('passive income') || query.includes('online business')) {
      reply = "### High-Leverage Online Business Model\n\nIn 2026, the ultimate model for generating digital cashflow is a premium media brand paired with automated B2B services:\n\n1. **Build the Audience Silo**: Focus on high-intent topics like SaaS Reviews, Digital Marketing, and Automation.\n2. **Monetize via High-Ticket Affiliate**: Promote premium software or automated agency setups.\n3. **Productize the Service**: Transition from active freelancing to automated digital productization (e.g., custom automation template packs, templates, or consulting workflows).";
    } else {
      reply = `Thank you for asking about **"${text}"**! While we set up the active live Gemini credentials, we are proud to provide actionable digital strategies. \n\nWe recommend reading our top guides on:\n- **[AI Tools & SEO Engines](/articles/ai-seo)**\n- **[Cold Outreach Automation Frameworks](/articles/outreach-automation)**\n- **[High-Ticket Affiliate Silos](/articles/high-ticket)**\n\nLet me know if you would like me to unpack any of these frameworks further!`;
    }

    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsLoading(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const historyPayload = messages.slice(1).map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));
        historyPayload.push({
          role: 'user',
          parts: [{ text: text }]
        });

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: historyPayload,
            systemInstruction: {
              parts: [{ text: "You are NetBot, a premium AI co-pilot for NetVentures. Answer questions on making money online, SaaS platforms, affiliate marketing, digital business building, and automation. Keep answers clear, professional, and formatted in markdown." }]
            }
          })
        });

        if (!res.ok) {
          throw new Error('Gemini API call failed');
        }

        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a reply.";
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Gemini fetch error, using smart fallback:', err);
        generateSmartFallback(text);
      }
    } else {
      // Simulate network lag then generate smart fallback
      setTimeout(() => {
        generateSmartFallback(text);
      }, 800);
    }
  };

  // Render markdown links elegantly
  const renderMessageText = (text: string) => {
    // Regex to capture markdown links: [Label](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      // Add text before link
      if (matchIndex > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, matchIndex)}</span>);
      }
      
      const label = match[1];
      const url = match[2];

      // Render custom inline link component
      parts.push(
        <a
          key={matchIndex}
          href={url}
          className="inline-flex items-center gap-0.5 font-semibold text-gold-600 dark:text-gold-500 hover:underline border-b border-gold-500/30"
        >
          {label} <ArrowUpRight className="h-3 w-3" />
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return <p className="whitespace-pre-wrap leading-relaxed text-sm break-words">{parts.length > 0 ? parts : text}</p>;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        >
          <div className="p-1 bg-gold-500 rounded-full text-zinc-950 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider pr-1">Ask NetBot</span>
          <MessageSquare className="h-4 w-4" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-fade-in transition-colors duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gold-500 rounded-lg text-zinc-900 flex items-center justify-center">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-tight">NetBot Co-Pilot</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium text-gray-400">Online | Pure factual context</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-br-none' 
                      : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 text-gray-800 dark:text-zinc-100 rounded-bl-none'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Co-pilot Error</p>
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations pills */}
          {messages.length === 1 && !isLoading && (
            <div className="px-5 py-2.5 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800/60">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Suggested Queries</p>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp.text)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:border-gold-500/30 hover:bg-gold-500/2 dark:hover:bg-gold-500/5 transition-all cursor-pointer font-sans"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask NetBot about published articles..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
