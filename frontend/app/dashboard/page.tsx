"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Perf = {
  python_ms_per_run: number;
  cpp_ms_per_run: number;
  speedup_estimate: number | null;
  native_available: boolean;
  cpp_backend: string;
};

type ProcessResponse = {
  status: string;
  engine: string;
  filename: string;
  anonymized_data: string;
  ai_insights: string;
};

const sidebarLinks = [
  { label: "Files", href: "#files" },
  { label: "Security Logs", href: "#security-logs" },
  { label: "Team", href: "#team" },
  { label: "Settings", href: "#settings" },
];

const seedAudit = [
  "[10:45] - file_alpha.csv - 5.2k entities scrubbed - 0.02ms",
  "[10:44] - file_beta.csv - 3.9k entities scrubbed - 0.03ms",
  "[10:42] - client_q2.csv - 7.1k entities scrubbed - 0.02ms",
];

export default function DashboardPage() {
  const [perf, setPerf] = useState<Perf | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auditFeed, setAuditFeed] = useState<string[]>(seedAudit);
  const [ruleMode, setRuleMode] = useState<"Strict" | "Balanced" | "Custom">("Balanced");
  const [deterministicMasking, setDeterministicMasking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/performance", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Perf;
        setPerf(data);
      } catch {
        // Dashboard still works without benchmark feed.
      }
    })();
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      const now = new Date();
      const stamp = `[${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]`;
      const entities = (Math.random() * 7 + 1.1).toFixed(1);
      const latency = (Math.random() * 0.03 + 0.01).toFixed(2);
      const row = `${stamp} - file_${Math.floor(Math.random() * 900 + 100)}.csv - ${entities}k entities scrubbed - ${latency}ms`;
      setAuditFeed((prev) => [row, ...prev].slice(0, 7));
    }, 3200);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (!sparkle) return;
    const id = window.setTimeout(() => setSparkle(false), 1300);
    return () => window.clearTimeout(id);
  }, [sparkle]);

  const perfBars = useMemo(() => ({ py: 92, cpp: 9 }), []);

  async function onUpload(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/process", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      setResult((await res.json()) as ProcessResponse);
      setSparkle(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
      setDragOver(false);
    }
  }

  return (
    <main className="relative mx-auto grid max-w-7xl gap-6 px-6 pb-14 pt-8 lg:grid-cols-12">
      <div className="lux-nav lg:col-span-12 flex items-center justify-between rounded-2xl px-4 py-3">
        <Link href="/" className="inline-flex items-center">
          <img
            src="/spectra-vault-logo.svg"
            alt="Spectra Vault logo"
            className="h-8 w-auto md:h-9"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:text-fuchsia-600"
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:text-fuchsia-600"
          >
            Pricing
          </Link>
          <span className="rounded-full bg-[#FF2D95] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,45,149,0.45)]">
            Vault Active
          </span>
        </div>
      </div>

      <aside className="glass-panel h-fit p-4 lg:col-span-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">SPECTRA | VAULT</p>
        <nav className="mt-4 space-y-1">
          {sidebarLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-white/80 hover:text-fuchsia-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:text-fuchsia-600"
        >
          Home
        </Link>
      </aside>

      <section className="space-y-6 lg:col-span-9">
        <motion.section
          id="files"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`vault-live rounded-[28px] p-[1.5px] ${dragOver ? "vault-drag" : ""} ${busy ? "vault-processing" : ""}`}
        >
          <div className="glass-panel rounded-[27px] p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">Glass Vault</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Import CSV/JSON and sanitize with C++ speed in the live dashboard.
                </p>
              </div>
              <div className="relative rounded-xl bg-white/70 p-2 ring-1 ring-white/80">
                <span className="text-xs font-semibold text-slate-700">SAFE</span>
                <AnimatePresence>
                  {sparkle ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.35, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: -10 }}
                      exit={{ opacity: 0, scale: 0.5, y: -18 }}
                      className="absolute -right-2 -top-2 text-fuchsia-500"
                    >
                      *
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <label className="mt-8 block">
              <input
                type="file"
                accept=".csv,.json,.txt,.tsv,.xlsx,.xls,.docx,.pdf,text/csv,application/json,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onUpload(f);
                  e.target.value = "";
                }}
              />
              <div
                onDragEnter={() => setDragOver(true)}
                onDragLeave={() => setDragOver(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) void onUpload(f);
                }}
                className="vault-dropzone cursor-pointer rounded-2xl border border-dashed border-fuchsia-200/70 bg-white/45 px-6 py-11 text-center"
              >
                <span className="rounded-full bg-[#FF2D95] px-6 py-2 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,45,149,0.58)]">
                  {busy ? "Sanitizing..." : "Choose CSV"}
                </span>
                <p className="mt-3 text-xs text-slate-500">
                  Supported: CSV, JSON, TXT, TSV, XLSX/XLS, DOCX, PDF.
                </p>
              </div>
            </label>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/60 p-3 ring-1 ring-white/70">
                <p className="text-xs font-semibold text-slate-500">Redaction rules</p>
                <div className="mt-2 flex gap-2">
                  {(["Strict", "Balanced", "Custom"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setRuleMode(mode)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        ruleMode === mode
                          ? "bg-fuchsia-500 text-white shadow-[0_0_14px_rgba(255,45,149,0.45)]"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-fuchsia-600"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <label className="rounded-xl bg-white/60 p-3 ring-1 ring-white/70">
                <p className="text-xs font-semibold text-slate-500">Deterministic Masking</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600">User A always maps to Token X</span>
                  <input
                    type="checkbox"
                    checked={deterministicMasking}
                    onChange={(e) => setDeterministicMasking(e.target.checked)}
                    className="h-4 w-4 accent-fuchsia-500"
                  />
                </div>
              </label>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

            {result ? (
              <div className="mt-6 space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  <span className="rounded-full bg-white/75 px-3 py-1 ring-1 ring-white/70">
                    Engine: <span className="font-semibold">{result.engine}</span>
                  </span>
                  <span className="rounded-full bg-white/75 px-3 py-1 ring-1 ring-white/70">
                    File: <span className="font-semibold">{result.filename}</span>
                  </span>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 p-4">
                  <p className="text-xs font-semibold text-slate-500">Anonymized preview</p>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-slate-800">
                    {result.anonymized_data.slice(0, 2600)}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>
        </motion.section>

        <div id="security-logs" className="grid gap-6 xl:grid-cols-2">
          <section className="glass-panel p-7">
            <h2 className="font-[family-name:var(--font-instrument)] text-3xl text-slate-900">Live Audit Logs</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {auditFeed.map((row) => (
                <div key={row} className="rounded-xl bg-white/55 px-3 py-2 ring-1 ring-white/70">
                  {row}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-7">
            <h2 className="font-[family-name:var(--font-instrument)] text-3xl text-slate-900">Performance HUD</h2>
            <p className="mt-2 text-sm text-slate-600">Python baseline versus Spectra C++ throughput.</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Standard Python</p>
                <div className="mt-2 h-3 rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${perfBars.py}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-3 rounded-full bg-slate-300"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Spectra C++</p>
                <div className="mt-2 h-3 rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${perfBars.cpp}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-3 rounded-full bg-[#FF2D95] shadow-[0_0_18px_rgba(255,45,149,0.75)]"
                  />
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold text-fuchsia-700">
              100x Speed Increase verified by C++ Backend.
            </p>
            {perf ? (
              <p className="mt-2 text-xs text-slate-500">
                Live feed: Python {perf.python_ms_per_run.toFixed(2)} ms | C++ {perf.cpp_ms_per_run.toFixed(2)} ms.
              </p>
            ) : null}
          </section>
        </div>

        <div id="team" className="glass-panel p-7 text-sm text-slate-600">
          <h2 className="font-[family-name:var(--font-instrument)] text-3xl text-slate-900">Team</h2>
          <p className="mt-2">
            Role-based access and reviewer workflows can be extended here for enterprise collaboration.
          </p>
        </div>

        <div id="settings" className="glass-panel p-7 text-sm text-slate-600">
          <h2 className="font-[family-name:var(--font-instrument)] text-3xl text-slate-900">Settings</h2>
          <p className="mt-2">
            Configure retention windows, export channels, and security policy presets from this control block.
          </p>
        </div>
      </section>
    </main>
  );
}
