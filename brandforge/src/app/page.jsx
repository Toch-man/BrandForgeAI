"use client";

import { useState } from "react";
import {
  Zap,
  Sparkles,
  Hash,
  Lightbulb,
  CalendarDays,
  Wand2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://your-render-backend.onrender.com";

const PLATFORMS = ["Twitter", "Facebook", "LinkedIn", "Instagram"];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-700 transition-colors"
    >
      {copied ? (
        <>
          <Check size={11} className="text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={11} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs font-medium text-gray-500 mb-1.5">
      {children}
    </label>
  );
}

function Input({ placeholder, value, onChange, onEnter }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                 text-gray-800 placeholder-gray-400 bg-gray-50
                 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                 transition-all duration-150"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                 text-gray-800 bg-gray-50 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                 transition-all duration-150"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function GenerateButton({ onClick, loading, label }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2
                 bg-[#6D28D9] hover:bg-purple-800 text-white
                 font-medium px-4 py-2.5 rounded-xl text-sm
                 transition-all duration-150
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Wand2 size={14} />
      )}
      {loading ? "Generating…" : label}
    </button>
  );
}

function ResultArea({ value, label, loading, rows = 5 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <CopyButton text={value} />
      </div>
      <div className="relative">
        <textarea
          readOnly
          rows={rows}
          value={loading ? "" : value || ""}
          placeholder={loading ? "" : "Output will appear here…"}
          className="w-full border border-purple-100 rounded-xl px-4 py-3
                     text-sm text-gray-700 bg-purple-50 resize-none
                     focus:outline-none leading-relaxed font-mono"
        />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-purple-50 gap-2">
            <Loader2 size={20} className="text-purple-700 animate-spin" />
            <span className="text-xs text-purple-600 font-medium">
              Generating…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}

function CardShell({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-purple-700" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base leading-tight">
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

async function callAgent(endpoint, body) {
  const res = await fetch(`${API_URL}/agent/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

function formatOutput(data) {
  if (typeof data === "string") return data;
  if (Array.isArray(data))
    return data.map((item, i) => `${i + 1}. ${item}`).join("\n");
  return JSON.stringify(data, null, 2);
}

// ─────────────────────────────────────────────────────────
// SERVICE CARD 1 — Caption Generator
// ─────────────────────────────────────────────────────────
function CaptionCard() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!topic.trim()) return setError("Please enter a topic");
    setError("");
    setLoading(true);
    setResult("");
    try {
      const data = await callAgent("caption", { topic, platform });
      setResult(data.caption || data.result || formatOutput(data));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={Sparkles}
      title="AI Caption Generator"
      description="Generate scroll-stopping captions tailored to each platform's style and character limits."
    >
      <div>
        <Label>Topic</Label>
        <Input
          placeholder="e.g. New product launch, summer sale…"
          value={topic}
          onChange={setTopic}
          onEnter={generate}
        />
      </div>
      <div>
        <Label>Platform</Label>
        <Select value={platform} onChange={setPlatform} options={PLATFORMS} />
      </div>
      <ErrorMessage message={error} />
      <GenerateButton
        onClick={generate}
        loading={loading}
        label="Generate Caption"
      />
      <ResultArea
        value={result}
        label="Generated Caption"
        loading={loading}
        rows={4}
      />
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────
// SERVICE CARD 2 — Hashtag Generator
// ─────────────────────────────────────────────────────────
function HashtagCard() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!topic.trim()) return setError("Please enter a topic");
    setError("");
    setLoading(true);
    setResult("");
    try {
      const data = await callAgent("hashtags", { topic, platform });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.hashtags)
          ? data.hashtags
          : null;

      if (list) {
        setResult(
          list.map((h) => (h.startsWith("#") ? h : `#${h}`)).join("  "),
        );
      } else {
        setResult(formatOutput(data));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={Hash}
      title="Hashtag Generator"
      description="Get optimised, platform-specific hashtag sets to maximise your reach and discoverability."
    >
      <div>
        <Label>Topic</Label>
        <Input
          placeholder="e.g. Fitness, digital marketing, travel…"
          value={topic}
          onChange={setTopic}
          onEnter={generate}
        />
      </div>
      <div>
        <Label>Platform</Label>
        <Select value={platform} onChange={setPlatform} options={PLATFORMS} />
      </div>
      <ErrorMessage message={error} />
      <GenerateButton
        onClick={generate}
        loading={loading}
        label="Generate Hashtags"
      />
      <ResultArea
        value={result}
        label="Generated Hashtags"
        loading={loading}
        rows={4}
      />
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────
// SERVICE CARD 3 — Content Ideas Generator
// ─────────────────────────────────────────────────────────
function ContentIdeasCard() {
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!niche.trim()) return setError("Please enter a niche");
    setError("");
    setLoading(true);
    setResult("");
    try {
      const data = await callAgent("content-ideas", { niche });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.ideas)
          ? data.ideas
          : null;

      if (list) {
        setResult(
          list
            .map((idea, i) => {
              if (typeof idea === "string") return `${i + 1}. ${idea}`;
              return `${i + 1}. ${
                idea.title ||
                idea.idea ||
                idea.content ||
                idea.description ||
                Object.values(idea)[0]
              }`;
            })
            .join("\n"),
        );
      } else {
        setResult(formatOutput(data));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={Lightbulb}
      title="Content Ideas Generator"
      description="Get 10 fresh, engaging content ideas tailored to your niche to keep your feed alive."
    >
      <div>
        <Label>Niche</Label>
        <Input
          placeholder="e.g. Personal finance, fitness, tech reviews…"
          value={niche}
          onChange={setNiche}
          onEnter={generate}
        />
      </div>
      <ErrorMessage message={error} />
      <GenerateButton
        onClick={generate}
        loading={loading}
        label="Generate 10 Ideas"
      />
      <ResultArea
        value={result}
        label="10 Content Ideas"
        loading={loading}
        rows={8}
      />
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────
// SERVICE CARD 4 — Content Calendar Generator
// ─────────────────────────────────────────────────────────
function ContentCalendarCard() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!niche.trim()) return setError("Please enter a niche");
    setError("");
    setLoading(true);
    setResult("");
    try {
      const data = await callAgent("content-calendar", { niche, platform });

      const days = Array.isArray(data)
        ? data
        : Array.isArray(data.days)
          ? data.days
          : null;

      if (days) {
        setResult(
          days
            .map((entry, i) => {
              if (typeof entry === "string") return `Day ${i + 1}: ${entry}`;
              const day = entry.day || entry.date || `Day ${i + 1}`;
              const topic =
                entry.topic ||
                entry.title ||
                entry.content ||
                entry.caption ||
                "";
              const cta = entry.cta ? ` → ${entry.cta}` : "";
              return `${day}: ${topic}${cta}`;
            })
            .join("\n"),
        );
      } else {
        setResult(formatOutput(data));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={CalendarDays}
      title="Content Calendar Generator"
      description="Plan a full week of content with daily post ideas structured around your niche and platform."
    >
      <div>
        <Label>Niche</Label>
        <Input
          placeholder="e.g. Personal finance, skincare, SaaS…"
          value={niche}
          onChange={setNiche}
          onEnter={generate}
        />
      </div>
      <div>
        <Label>Platform</Label>
        <Select value={platform} onChange={setPlatform} options={PLATFORMS} />
      </div>
      <ErrorMessage message={error} />
      <GenerateButton
        onClick={generate}
        loading={loading}
        label="Generate Calendar"
      />
      <ResultArea
        value={result}
        label="7-Day Content Calendar"
        loading={loading}
        rows={8}
      />
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D28D9] flex items-center justify-center shrink-0">
              <Zap size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-none">
                BrandForge AI
              </p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block leading-none">
                AI-powered content generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-green-700">
              AI Online
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 mb-5">
          <Sparkles size={12} className="text-purple-700" />
          <span className="text-xs font-medium text-purple-700">
            Powered by Gemini AI
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Create content that <span className="text-[#6D28D9]">converts</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          AI-powered content generation for creators, brands and marketers.
        </p>
      </section>

      {/* 4 SERVICE CARDS */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CaptionCard />
          <HashtagCard />
          <ContentIdeasCard />
          <ContentCalendarCard />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#6D28D9] flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              BrandForge AI
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Powered by{" "}
            <span className="text-purple-700 font-medium">Gemini AI</span> •{" "}
            <span className="text-purple-700 font-medium">
              CROO Agent Network
            </span>
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} BrandForge AI
          </p>
        </div>
      </footer>
    </div>
  );
}
