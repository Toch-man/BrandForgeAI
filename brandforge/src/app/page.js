'use client';
import { useState } from 'react';
import {
  Sparkles, Hash, Lightbulb, CalendarDays,
  Wand2, Copy, Check, Zap, Loader2,
} from 'lucide-react';
import clsx from 'clsx';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://your-app.onrender.com';
const PLATFORMS = ['Twitter', 'Facebook', 'LinkedIn', 'Instagram'];

// ── Copy button ───────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-purple-700 transition-colors"
    >
      {copied
        ? <><Check size={11} className="text-green-500" /> Copied</>
        : <><Copy size={11} /> Copy</>}
    </button>
  );
}

// ── Card shell ────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, description, color = 'purple', children }) {
  return (
    <div className="card flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-purple-700" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base leading-tight">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

// ── Result area ───────────────────────────────────────────
function ResultBox({ value, label = 'Result', loading, rows = 5 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="label mb-0">{label}</span>
        <CopyBtn text={value} />
      </div>
      <div className="relative">
        <textarea
          readOnly
          rows={rows}
          className="result-box w-full"
          value={loading ? '' : (value || '')}
          placeholder={loading ? '' : 'Output will appear here…'}
        />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-purple-50 gap-2">
            <Loader2 size={20} className="text-purple-700 animate-spin" />
            <span className="text-xs text-purple-600 font-medium">Generating…</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Error line ────────────────────────────────────────────
function Err({ msg }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{msg}</p>;
}

// ── Shared API call ───────────────────────────────────────
async function callAgent(endpoint, body) {
  const res = await fetch(`${API}/agent/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

function formatResult(data) {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map((item, i) => `${i + 1}. ${item}`).join('\n');
  return JSON.stringify(data, null, 2);
}

// ════════════════════════════════════════════════════════
// 1. Caption Generator  →  POST /agent/caption
// ════════════════════════════════════════════════════════
function CaptionCard() {
  const [topic, setTopic]       = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const [result, setResult]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function generate() {
    if (!topic.trim()) return setError('Please enter a topic');
    setError(''); setLoading(true); setResult('');
    try {
      const data = await callAgent('caption', { topic, platform });
      setResult(
        data.caption || data.result || formatResult(data)
      );
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <ServiceCard
      icon={Sparkles}
      title="AI Caption Generator"
      description="Generate scroll-stopping captions tailored to each platform's style and tone."
    >
      <div>
        <label className="label">Topic</label>
        <input
          className="input"
          placeholder="e.g. New product launch, summer sale…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
      </div>
      <div>
        <label className="label">Platform</label>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)}>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <Err msg={error} />
      <button className="btn-primary" onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : <Wand2 size={14} />}
        {loading ? 'Generating…' : 'Generate Caption'}
      </button>
      <ResultBox value={result} label="Generated Caption" loading={loading} rows={4} />
    </ServiceCard>
  );
}

// ════════════════════════════════════════════════════════
// 2. Hashtag Generator  →  POST /agent/hashtags
// ════════════════════════════════════════════════════════
function HashtagCard() {
  const [topic, setTopic]       = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [result, setResult]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function generate() {
    if (!topic.trim()) return setError('Please enter a topic');
    setError(''); setLoading(true); setResult('');
    try {
      const data = await callAgent('hashtags', { topic, platform });
      // data could be array of strings or { hashtags: [...] }
      const list = Array.isArray(data) ? data
        : Array.isArray(data.hashtags) ? data.hashtags
        : [];
      setResult(
        list.length
          ? list.map(h => (h.startsWith('#') ? h : `#${h}`)).join('  ')
          : formatResult(data)
      );
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <ServiceCard
      icon={Hash}
      title="Hashtag Generator"
      description="Get optimized, platform-specific hashtag sets to maximise reach and discoverability."
    >
      <div>
        <label className="label">Topic</label>
        <input
          className="input"
          placeholder="e.g. Fitness, digital marketing, travel…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
      </div>
      <div>
        <label className="label">Platform</label>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)}>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <Err msg={error} />
      <button className="btn-primary" onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : <Wand2 size={14} />}
        {loading ? 'Generating…' : 'Generate Hashtags'}
      </button>
      <ResultBox value={result} label="Generated Hashtags" loading={loading} rows={4} />
    </ServiceCard>
  );
}

// ════════════════════════════════════════════════════════
// 3. Content Ideas Generator  →  POST /agent/content-ideas
// ════════════════════════════════════════════════════════
function ContentIdeasCard() {
  const [niche, setNiche]     = useState('');
  const [result, setResult]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function generate() {
    if (!niche.trim()) return setError('Please enter a niche');
    setError(''); setLoading(true); setResult('');
    try {
      const data = await callAgent('content-ideas', { niche });
      const list = Array.isArray(data) ? data
        : Array.isArray(data.ideas) ? data.ideas
        : null;
      setResult(list ? list.map((idea, i) => `${i + 1}. ${idea}`).join('\n') : formatResult(data));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <ServiceCard
      icon={Lightbulb}
      title="Content Ideas Generator"
      description="Get 10 fresh, engaging content ideas tailored to your niche to keep your feed alive."
    >
      <div>
        <label className="label">Niche</label>
        <input
          className="input"
          placeholder="e.g. Personal finance, fitness, tech reviews…"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
      </div>
      <Err msg={error} />
      <button className="btn-primary" onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : <Wand2 size={14} />}
        {loading ? 'Generating…' : 'Generate 10 Ideas'}
      </button>
      <ResultBox value={result} label="10 Content Ideas" loading={loading} rows={7} />
    </ServiceCard>
  );
}

// ════════════════════════════════════════════════════════
// 4. Content Calendar Generator  →  POST /agent/content-calendar
// ════════════════════════════════════════════════════════
function ContentCalendarCard() {
  const [niche, setNiche]       = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [result, setResult]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function generate() {
    if (!niche.trim()) return setError('Please enter a niche');
    setError(''); setLoading(true); setResult('');
    try {
      const data = await callAgent('content-calendar', { niche, platform });
      // Could be array of days or object
      if (Array.isArray(data)) {
        setResult(data.map((entry, i) => {
          if (typeof entry === 'string') return `Day ${i + 1}: ${entry}`;
          const day   = entry.day   || entry.date  || `Day ${i + 1}`;
          const topic = entry.topic || entry.title || entry.content || JSON.stringify(entry);
          return `${day}: ${topic}`;
        }).join('\n'));
      } else {
        setResult(formatResult(data));
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <ServiceCard
      icon={CalendarDays}
      title="Content Calendar Generator"
      description="Plan a week of content with daily post ideas structured around your niche and platform."
    >
      <div>
        <label className="label">Niche</label>
        <input
          className="input"
          placeholder="e.g. Personal finance, skincare, SaaS…"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
      </div>
      <div>
        <label className="label">Platform</label>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)}>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <Err msg={error} />
      <button className="btn-primary" onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : <Wand2 size={14} />}
        {loading ? 'Generating…' : 'Generate Calendar'}
      </button>
      <ResultBox value={result} label="7-Day Content Calendar" loading={loading} rows={8} />
    </ServiceCard>
  );
}

// ════════════════════════════════════════════════════════
// Main Page
// ════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center shrink-0">
              <Zap size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-none">BrandForge AI</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5 hidden sm:block">
                AI-powered content generation
              </p>
            </div>
          </div>

          {/* AI Online badge */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-green-700">AI Online</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 mb-5">
          <Sparkles size={12} className="text-purple-700" />
          <span className="text-xs font-medium text-purple-700">Powered by Gemini AI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Create content that{' '}
          <span className="text-purple-700">converts</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          AI-powered content generation for creators, brands and marketers.
        </p>
      </section>

      {/* ── Cards ── */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CaptionCard />
          <HashtagCard />
          <ContentIdeasCard />
          <ContentCalendarCard />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-700 flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">BrandForge AI</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Powered by{' '}
            <span className="text-purple-700 font-medium">Gemini AI</span>
            {' '}•{' '}
            <span className="text-purple-700 font-medium">CROO Agent Network</span>
          </p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} BrandForge AI</p>
        </div>
      </footer>

    </div>
  );
}
