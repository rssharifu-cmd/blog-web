import React from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Code2,
  ExternalLink, Globe2, Mail, MapPin, MonitorSmartphone,
  SearchCheck, Sparkles, UserRound, Workflow
} from 'lucide-react';
import { Article } from '../types.js';

type Navigate = (path: string) => void;

const contactEmail = 'hello@sharflow.online';
const githubUrl = 'https://github.com/rssharifu-cmd';

const projects = [
  {
    number: '01', name: 'Sharflow', category: 'SaaS · Website intelligence',
    description: 'A website monitoring product that brings verified Google Analytics, Search Console and Bing findings into useful daily updates. I am refining it ahead of a wider customer launch.',
    url: 'https://sharflow.online/', action: 'Explore Sharflow',
    color: 'from-blue-500/20 via-indigo-500/10 to-transparent', label: 'Product in development'
  },
  {
    number: '02', name: 'Soroban Parent Training', category: 'Education · Learning platform',
    description: 'A Bengali video course and learning platform designed to help parents learn Japanese Soroban and teach their children. Lessons and materials are being prepared.',
    url: '', action: '', color: 'from-amber-500/20 via-orange-500/10 to-transparent', label: 'Course in progress'
  },
  {
    number: '03', name: 'NetVentures', category: 'Publishing · Content & SEO',
    description: 'My collection of practical writing about AI tools, SaaS, SEO, hosting and building online businesses. The existing articles remain available in the blog.',
    url: '/blog', action: 'Read the blog', color: 'from-emerald-500/20 via-teal-500/10 to-transparent', label: 'Published project'
  }
];

const services = [
  {
    icon: MonitorSmartphone, title: 'Business websites',
    description: 'Clear, mobile-friendly websites for small businesses, including hospitality and restaurants. Start with the pages customers actually need.'
  },
  {
    icon: Workflow, title: 'Practical automation',
    description: 'Simple dashboards and workflows that reduce manual work. I assess requirements before suggesting an integration or custom tool.'
  },
  {
    icon: SearchCheck, title: 'Lead research & outreach',
    description: 'Prospect research and individually tailored outreach drafts built around what a business actually does, with review before any messages are sent.'
  }
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.23em] text-amber-600 dark:text-amber-400">{children}</span>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">{title}</h2>
      {description && <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>}
    </div>
  );
}

function ProjectCards({ navigate }: { navigate: Navigate }) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {projects.map((project) => (
        <article key={project.number} className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm flex flex-col">
          <div className={`min-h-36 p-6 flex flex-col justify-between bg-gradient-to-br ${project.color} dark:bg-zinc-900`}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">PROJECT {project.number}</span>
              <Code2 className="w-6 h-6 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{project.label}</span>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">{project.category}</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-zinc-950 dark:text-white">{project.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">{project.description}</p>
            {project.url ? (
              project.url.startsWith('/') ? (
                <button onClick={() => navigate(project.url)} className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-zinc-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400">
                  {project.action}<ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-zinc-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400">
                  {project.action}<ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )
            ) : <span className="mt-6 text-xs font-medium text-zinc-500">More details coming as the course develops</span>}
          </div>
        </article>
      ))}
    </div>
  );
}

function ServiceCards() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {services.map(({ icon: Icon, title, description }) => (
        <article key={title} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 p-7 bg-white dark:bg-zinc-950">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold text-zinc-950 dark:text-white mt-5">{title}</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-3">{description}</p>
        </article>
      ))}
    </div>
  );
}

export function PersonalHome({ navigate, articles }: { navigate: Navigate; articles: Article[] }) {
  return (
    <div className="space-y-20 pb-12 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] mx-4 sm:mx-6 lg:mx-8 bg-zinc-950 text-white px-6 sm:px-12 lg:px-16 py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_88%_18%,rgba(217,162,47,.16),transparent_50%)]" />
        <div className="relative grid lg:grid-cols-[1fr_250px] gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Independent builder · Based in Saudi Arabia
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-6xl leading-[1.12] tracking-tight">
              Hi, I'm <span className="text-amber-400">MD Sharif Miah.</span><br />I build things for the web.
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              I'm Sharif, a Bangladeshi maker working in Saudi Arabia. Outside my day job, I build websites, explore SaaS ideas, and create useful digital learning tools. This is where I share my work and what I learn along the way.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-zinc-950 font-semibold text-sm hover:bg-amber-300 transition-colors">See my projects <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 text-white font-semibold text-sm hover:border-amber-400 transition-colors">Let's talk <Mail className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex aspect-square w-44 sm:w-64 lg:w-auto mx-auto lg:mx-0 rounded-[2.5rem] border border-amber-400/20 bg-zinc-900 items-center justify-center relative">
            <img src="/uploads/md-sharif-miah.jpg" alt="Illustrated portrait of MD Sharif Miah" className="w-full h-full object-cover rounded-[2.5rem]" />
            <div className="absolute -bottom-4 -left-6 rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-xs text-zinc-300 shadow-xl">Building in public ↗</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Selected work" title="Projects, not just ideas." description="A few of the products and learning experiences I'm working on, with their current status clearly shown." />
          <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline">All projects <ArrowRight className="w-4 h-4" /></button>
        </div>
        <ProjectCards navigate={navigate} />
      </section>

      <section className="bg-zinc-100/70 dark:bg-zinc-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="What I can help with" title="Small businesses, practical technology." description="I focus on clear business needs, useful websites and tools that make everyday work easier." />
            <button onClick={() => navigate('/services')} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline">Explore services <ArrowRight className="w-4 h-4" /></button>
          </div>
          <ServiceCards />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.25fr] gap-10 items-center">
        <div className="space-y-5">
          <SectionHeading eyebrow="My story" title="Learning by building, every day." />
          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            I started with curiosity about the internet and online business. While working in hospitality in Saudi Arabia, I began building real products, testing ideas and teaching myself the tools needed to make them work.
          </p>
          <button onClick={() => navigate('/about')} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white hover:text-amber-600">More about me <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="rounded-3xl bg-zinc-950 text-zinc-100 p-8 sm:p-10 grid sm:grid-cols-2 gap-8">
          <div><Globe2 className="w-6 h-6 text-amber-400 mb-4" /><h3 className="font-display font-semibold text-lg">Bangladesh → Saudi Arabia</h3><p className="text-sm text-zinc-400 mt-2 leading-relaxed">Two places that shaped how I see work, learning and business.</p></div>
          <div><BriefcaseBusiness className="w-6 h-6 text-amber-400 mb-4" /><h3 className="font-display font-semibold text-lg">Work + building</h3><p className="text-sm text-zinc-400 mt-2 leading-relaxed">Learning and developing products alongside a full-time job.</p></div>
          <div><Code2 className="w-6 h-6 text-amber-400 mb-4" /><h3 className="font-display font-semibold text-lg">Web & SaaS</h3><p className="text-sm text-zinc-400 mt-2 leading-relaxed">Experimenting with useful software, analytics and digital services.</p></div>
          <div><BookOpen className="w-6 h-6 text-amber-400 mb-4" /><h3 className="font-display font-semibold text-lg">Always learning</h3><p className="text-sm text-zinc-400 mt-2 leading-relaxed">Sharing progress honestly, including what hasn't worked yet.</p></div>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="From the archive" title="Writing about the digital world." description="My existing NetVentures articles about AI, tools and online business are still here." />
            <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline">Visit the blog <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {articles.slice(0, 3).map(article => (
              <button key={article.id} onClick={() => navigate(`/blog/${article.slug}`)} className="text-left overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-amber-500/60 transition-colors group">
                <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  {article.featuredImage ? <img src={article.featuredImage} alt={article.featuredImageAlt || article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-zinc-400" /></div>}
                </div>
                <div className="p-5"><h3 className="font-display font-semibold text-zinc-950 dark:text-white line-clamp-2">{article.title}</h3><p className="text-xs text-zinc-500 mt-3">{article.readingTime} min read <ArrowUpRight className="w-3.5 h-3.5 inline" /></p></div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-amber-400 text-zinc-950 p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-widest">Start a conversation</p><h2 className="font-display font-bold text-2xl sm:text-3xl">Have a business problem or an idea?</h2><p className="text-sm">Tell me what you're working on. We can explore whether I can help.</p></div>
          <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800">Contact Sharif <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
    </div>
  );
}

export function PersonalAbout({ navigate }: { navigate: Navigate }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12 animate-fade-in">
      <div className="space-y-5"><Eyebrow><UserRound className="w-4 h-4" /> The person behind the projects</Eyebrow><h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white">I'm MD Sharif Miah.<br/><span className="text-amber-600 dark:text-amber-400">You can call me Sharif.</span></h1><p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-3xl">I'm a Bangladeshi independent maker based in Saudi Arabia. I work in hospitality and spend my spare time learning, building software and trying to solve useful problems.</p></div>
      <div className="grid md:grid-cols-[200px_1fr] gap-7 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <img src="/uploads/md-sharif-miah.jpg" alt="Illustrated portrait of MD Sharif Miah" className="w-36 h-36 rounded-3xl object-cover border border-amber-500/30" loading="lazy" />
        <div className="space-y-5 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          <h2 className="font-display text-2xl font-semibold text-zinc-950 dark:text-white">My journey so far</h2>
          <p>I grew up in Bangladesh and moved to Saudi Arabia for work. My professional background is in restaurants and hospitality, which taught me how important simple, reliable systems are for a small business.</p>
          <p>Alongside work, I started learning how websites and online products are built. NetVentures began as a place to publish what I was exploring. Since then, I've been developing Sharflow, a website monitoring SaaS, and a Bengali Soroban learning experience for parents.</p>
          <p>I don't pretend to have all the answers. This site is my personal home for projects, experiments, lessons and services. I'll show what is live, what is still being developed, and what I learn as I go.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"><MapPin className="w-5 h-5 text-amber-600 mb-3" /><h3 className="font-semibold text-zinc-950 dark:text-white">Based in Saudi Arabia</h3><p className="text-sm text-zinc-500 mt-2">Originally from Bangladesh.</p></div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"><Code2 className="w-5 h-5 text-amber-600 mb-3" /><h3 className="font-semibold text-zinc-950 dark:text-white">Building independently</h3><p className="text-sm text-zinc-500 mt-2">Websites, software experiments and digital products.</p></div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"><BookOpen className="w-5 h-5 text-amber-600 mb-3" /><h3 className="font-semibold text-zinc-950 dark:text-white">Learning in public</h3><p className="text-sm text-zinc-500 mt-2">Sharing real progress without inflated claims.</p></div>
      </div>
      <div className="flex flex-wrap gap-3"><button onClick={() => navigate('/projects')} className="px-5 py-3 rounded-xl bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 font-semibold text-sm">Explore my projects</button><button onClick={() => navigate('/contact')} className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white font-semibold text-sm">Get in touch</button></div>
    </div>
  );
}

export function PersonalProjects({ navigate }: { navigate: Navigate }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10 animate-fade-in"><SectionHeading eyebrow="Portfolio" title="What I'm building." description="Real projects with honest descriptions and development status. I will add verified client case studies as those projects are completed." /><ProjectCards navigate={navigate} /><div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 flex flex-wrap gap-5 items-center justify-between"><div><h2 className="font-display font-semibold text-2xl text-zinc-950 dark:text-white">Want to see the code?</h2><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Some of my work is available on GitHub.</p></div><a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center font-semibold text-sm text-amber-600 dark:text-amber-400">Visit my GitHub <ExternalLink className="w-4 h-4" /></a></div></div>;
}

export function PersonalServices({ navigate }: { navigate: Navigate }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10 animate-fade-in"><SectionHeading eyebrow="Work with me" title="Digital work, grounded in your needs." description="I offer focused project discussions for small businesses. Each scope is agreed before development; I don't claim integrations or results that haven't been tested." /><ServiceCards /><div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-12 space-y-5"><h2 className="font-display font-semibold text-2xl sm:text-3xl">How we can start</h2><div className="grid sm:grid-cols-3 gap-6 text-sm text-zinc-300">{['Tell me about your business and its main problem.', 'I review the current website, workflow or outreach need.', 'We agree on a small, clear first deliverable and next steps.'].map((step,i)=><div key={step} className="space-y-2"><span className="text-amber-400 font-bold text-lg">0{i+1}</span><p className="leading-relaxed">{step}</p></div>)}</div><button onClick={() => navigate('/contact')} className="inline-flex gap-2 items-center px-5 py-3 bg-amber-400 text-zinc-950 rounded-xl font-semibold text-sm">Discuss a project <ArrowRight className="w-4 h-4" /></button></div></div>;
}

export function PersonalContact() {
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10 animate-fade-in"><SectionHeading eyebrow="Contact" title="Let's talk about your idea." description="Whether you're looking for a website, a useful digital tool or a project discussion, send me a short note explaining what you need." /><div className="grid md:grid-cols-2 gap-5"><a href={`mailto:${contactEmail}?subject=Project%20inquiry%20from%20NetVentures`} className="rounded-3xl p-8 bg-zinc-950 text-white hover:ring-2 hover:ring-amber-400 transition-all"><Mail className="w-7 h-7 text-amber-400"/><h2 className="font-display font-semibold text-2xl mt-5">Send an email</h2><p className="text-amber-300 text-sm mt-2 break-all">{contactEmail}</p><p className="text-zinc-400 text-sm mt-4">Opens your email app. Your message is only sent when you choose to send it.</p><span className="inline-flex items-center gap-2 text-sm font-semibold mt-6">Write to Sharif <ArrowUpRight className="w-4 h-4" /></span></a><a href={githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-amber-500/60 transition-colors"><Globe2 className="w-7 h-7 text-amber-600"/><h2 className="font-display font-semibold text-2xl mt-5 text-zinc-950 dark:text-white">Find my work</h2><p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">github.com/rssharifu-cmd</p><p className="text-zinc-500 text-sm mt-4">Browse my public development projects and experiments.</p><span className="inline-flex items-center gap-2 text-sm font-semibold mt-6 text-amber-600 dark:text-amber-400">Open GitHub <ArrowUpRight className="w-4 h-4" /></span></a></div><p className="text-xs text-zinc-500">This is a personal project website. I haven't added a contact form that stores your information or claims to have delivered a message.</p></div>;
}
