"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

const anatomy = [
  {
    tag: "Step 1",
    title: "Upload",
    text: "Drag your Excel or CSV file directly into the Glass Vault.",
  },
  {
    tag: "Step 2",
    title: "Sanitize",
    text: "Our high-speed C++ engine automatically detects names, emails, and addresses, then anonymizes them instantly.",
  },
  {
    tag: "Step 3",
    title: "Use Safely",
    text: "Export your sanitized file and share it confidently with ChatGPT or any AI workflow.",
  },
];

const steps = [
  "Connect your workspace or drag your CSV/JSON file into the Glass Vault.",
  "Define your redaction rules (Strict, Balanced, or Custom patterns).",
  "Export the sanitized data or pipe it directly into ChatGPT/Claude via secure API.",
];

const demoFlow = [
  {
    title: "Upload source files",
    detail: "Drop CSV, XLSX, DOCX, or PDF into the Glass Vault.",
    stat: "8 formats accepted",
  },
  {
    title: "Auto-anonymize with C++",
    detail: "Names, emails, and phone numbers are masked in milliseconds.",
    stat: "Up to 100x faster",
  },
  {
    title: "Review audit logs",
    detail: "Watch scrubbed entities and policy actions update live.",
    stat: "Real-time compliance feed",
  },
  {
    title: "Export safe AI-ready data",
    detail: "Share anonymized output with ChatGPT and analytics tools.",
    stat: "Privacy-first output",
  },
];

const auditPreviewRows = [
  "[09:24] PII detected in column 4... SUCCESS",
  "[09:25] Email pattern masked... SUCCESS",
  "[09:25] Phone numbers tokenized... SUCCESS",
  "[09:26] Export policy validation... SUCCESS",
];

const reviews = [
  { name: "Marcus", quote: "Spectra Vault gave us speed and compliance in one stroke. The C++ path is blazing." },
  { name: "Elena", quote: "Finally a privacy stack that feels premium and performs like enterprise software." },
  { name: "Sarah", quote: "Our AI workflows feel safe now. Sanitization happens so fast we barely notice it." },
  { name: "Noah", quote: "The deterministic masking changed our reporting quality overnight." },
  { name: "Amelia", quote: "Incredible UX. Our team adopted it in a day without training." },
  { name: "Luca", quote: "Latency dropped dramatically compared with our legacy Python-only flow." },
  { name: "Maya", quote: "Audit visibility is clear and executive-friendly. Exactly what we needed." },
  { name: "Jonas", quote: "The privacy posture feels mature. This looks and behaves like a 2026 SaaS platform." },
  { name: "Ava", quote: "We now process campaign exports with confidence before sending anything to LLMs." },
  { name: "Ethan", quote: "The C++ engine is genuinely fast. It turned minutes into seconds for us." },
  { name: "Lina", quote: "Security and elegance in one product. Rare combo." },
  { name: "David", quote: "Our legal team finally stopped blocking AI pilots after this rollout." },
  { name: "Sofia", quote: "The vault flow is intuitive and reassuring for non-technical teams." },
  { name: "Ravi", quote: "Excellent architecture split between control and performance layers." },
  { name: "Nora", quote: "The polished UI helped us win internal buy-in instantly." },
];

const techCompanies = [
  { name: "Databricks", logo: "https://cdn.simpleicons.org/databricks/EF3A2D" },
  { name: "Snowflake", logo: "https://cdn.simpleicons.org/snowflake/29B5E8" },
  { name: "Cloudflare", logo: "https://cdn.simpleicons.org/cloudflare/F38020" },
  { name: "MongoDB", logo: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Notion", logo: "https://cdn.simpleicons.org/notion/111111" },
  { name: "Vercel", logo: "https://cdn.simpleicons.org/vercel/111111" },
  { name: "Figma", logo: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/635BFF" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "#about" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const repeatedReviews = useMemo(() => [...reviews, ...reviews], []);

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-16 pt-8">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lux-nav sticky top-4 z-40 mb-8 flex items-center justify-between gap-4 rounded-2xl px-5 py-3"
      >
        <Link href="/" className="inline-flex items-center">
          <img
            src="/spectra-vault-logo.svg"
            alt="Spectra Vault logo"
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <div
          className="relative hidden items-center gap-6 text-sm text-slate-600 lg:flex"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.label} href={item.href} className="transition hover:text-fuchsia-600">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="transition hover:text-fuchsia-600">
                {item.label}
              </a>
            ),
          )}

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-1/2 top-10 z-50 w-[480px] -translate-x-1/2 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_26px_90px_rgba(15,23,42,0.14)] backdrop-blur-md"
              >
                <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="rounded-xl bg-white/70 p-3">
                    <p className="font-semibold text-slate-900">Product</p>
                    <p className="mt-1">
                      High-speed C++ engine, Real-time audit logs, en Privacy-compliance met één klik.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-3">
                    <p className="font-semibold text-slate-900">Solutions</p>
                    <p className="mt-1">
                      We deliver privacy solutions for marketing agencies, HR teams, and data analysts
                      who need safe AI workflows.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-3">
                    <p className="font-semibold text-slate-900">Pricing</p>
                    <p className="mt-1">
                      Starter Vault: $0/month. Pro Architect: $9.99/month with unlimited scans and full API access.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Link
          href="/dashboard"
          className="rounded-full bg-[#FF2D95] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(255,45,149,0.55)] transition hover:-translate-y-0.5"
        >
          Enter Vault
        </Link>
      </motion.nav>

      <header id="product" className="mb-10 grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.05] text-slate-900 md:text-6xl">
            Innovation without Exposure
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Elite privacy orchestration for the AI era. Powered by C++ for unmatched speed, wrapped in luxury
            for the modern agency.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="vault-live lg:col-span-6 rounded-[28px] p-[1.5px]"
        >
          <div className="glass-panel rounded-[27px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Dashboard Preview</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/65 p-3 ring-1 ring-white/80">
                <p className="text-xs text-slate-500">Vault Queue</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">24 files</p>
              </div>
              <div className="rounded-xl bg-white/65 p-3 ring-1 ring-white/80">
                <p className="text-xs text-slate-500">Latency</p>
                <p className="mt-2 text-lg font-semibold text-fuchsia-600">0.02ms</p>
              </div>
              <div className="rounded-xl bg-white/65 p-3 ring-1 ring-white/80">
                <p className="text-xs text-slate-500">Secure Runs</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">99.99%</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white/60 p-3 ring-1 ring-white/80">
              <p className="text-xs text-slate-500">C++ Performance HUD</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[92%] rounded-full bg-slate-300" />
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[9%] rounded-full bg-[#FF2D95] shadow-[0_0_14px_rgba(255,45,149,0.6)]" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Live product preview for enterprise privacy teams.</p>
          </div>
        </motion.div>
      </header>

      <motion.section
        id="solutions"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">
          The Anatomy of Privacy
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {anatomy.map((item) => (
            <article key={item.title} className="glass-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-600">{item.tag}</p>
              <h3 className="mt-2 font-[family-name:var(--font-instrument)] text-2xl text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="demo"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">See it in action</h2>
        <div className="glass-panel mt-5 p-6">
          <div className="space-y-4">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 rounded-2xl border border-white/80 bg-gradient-to-r from-fuchsia-100/50 via-white/75 to-sky-100/50 p-4 md:grid-cols-2"
            >
              <div className="rounded-xl bg-white/75 p-4 ring-1 ring-white/80">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-600">Step 1</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{demoFlow[0].title}</h3>
                <p className="mt-2 text-sm text-slate-600">{demoFlow[0].detail}</p>
              </div>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="rounded-xl border border-white/80 bg-white/70 p-4 ring-1 ring-white/80"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Glass Upload Zone</p>
                <div className="mt-3 rounded-xl border border-dashed border-fuchsia-300/70 bg-white/70 p-5 text-center">
                  <p className="text-3xl">📄</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">Drag &amp; Drop your CSV</p>
                  <div className="mx-auto mt-3 h-2 w-44 rounded-full bg-fuchsia-100">
                    <motion.div
                      initial={{ width: "12%" }}
                      animate={{ width: ["12%", "82%", "48%"] }}
                      transition={{ repeat: Infinity, duration: 2.8 }}
                      className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 rounded-2xl border border-white/80 bg-gradient-to-r from-fuchsia-100/50 via-white/75 to-sky-100/50 p-4 md:grid-cols-2"
            >
              <div className="rounded-xl bg-white/75 p-4 ring-1 ring-white/80">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-600">Step 2</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{demoFlow[1].title}</h3>
                <p className="mt-2 text-sm text-slate-600">{demoFlow[1].detail}</p>
              </div>
              <div className="grid gap-2 rounded-xl border border-white/80 bg-white/70 p-4 ring-1 ring-white/80 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Raw Data</p>
                  <p className="mt-2 text-xs text-slate-700">name: John Doe</p>
                  <p className="text-xs text-slate-700">email: john@brand.com</p>
                  <p className="text-xs text-slate-700">phone: +32 470 00 00 00</p>
                </div>
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(244,114,182,0)",
                      "0 0 24px rgba(244,114,182,0.35)",
                      "0 0 0 rgba(244,114,182,0)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-100"
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-700">Sanitized</p>
                  <p className="mt-2 text-xs text-emerald-700">name: [REDACTED]</p>
                  <p className="text-xs text-emerald-700">email: [REDACTED]</p>
                  <p className="text-xs text-emerald-700">phone: [REDACTED]</p>
                </motion.div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 rounded-2xl border border-white/80 bg-gradient-to-r from-fuchsia-100/50 via-white/75 to-sky-100/50 p-4 md:grid-cols-2"
            >
              <div className="rounded-xl bg-white/75 p-4 ring-1 ring-white/80">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-600">Step 3</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{demoFlow[2].title}</h3>
                <p className="mt-2 text-sm text-slate-600">{demoFlow[2].detail}</p>
              </div>
              <div className="rounded-xl border border-white/80 bg-slate-950 p-4 ring-1 ring-slate-800">
                <p className="text-[11px] uppercase tracking-[0.14em] text-fuchsia-300">Audit Log Terminal</p>
                <div className="mt-3 h-20 overflow-hidden rounded-md bg-black/35 p-2 ring-1 ring-white/10">
                  <motion.div
                    animate={{ y: [0, -36, -72, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="space-y-1 text-[11px] text-emerald-300"
                  >
                    {auditPreviewRows.map((row) => (
                      <p key={row}>{row}</p>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 rounded-2xl border border-white/80 bg-gradient-to-r from-fuchsia-100/50 via-white/75 to-sky-100/50 p-4 md:grid-cols-2"
            >
              <div className="rounded-xl bg-white/75 p-4 ring-1 ring-white/80">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-600">Step 4</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{demoFlow[3].title}</h3>
                <p className="mt-2 text-sm text-slate-600">{demoFlow[3].detail}</p>
              </div>
              <div className="flex items-center rounded-xl border border-white/80 bg-white/70 p-4 ring-1 ring-white/80">
                <div className="w-full rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span className="text-xl">✅</span>
                    <p className="text-sm font-semibold">Secured export complete</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="button"
                    className="mt-3 w-full rounded-full bg-[#FF2D95] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_22px_rgba(255,45,149,0.6)]"
                  >
                    Download Secured File
                  </motion.button>
                </div>
              </div>
            </motion.article>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
            <div
              className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-white/80"
              role="img"
              aria-label="Vault illustration"
            >
              🔒 Vault security flow
            </div>
            <div
              className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-white/80"
              role="img"
              aria-label="Shield illustration"
            >
              🛡️ PII protection map
            </div>
            <div
              className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-white/80"
              role="img"
              aria-label="Data stream illustration"
            >
              📡 Data stream insights
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="documentation"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">User Guide</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <article key={step} className="glass-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Step {idx + 1}</p>
              <p className="mt-3 text-sm text-slate-600">{step}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">About Us</h2>
        <div className="glass-panel mt-5 p-6">
          <p className="text-sm text-slate-600">
            We make privacy simple in a world dominated by AI. Spectra Vault exists to help modern teams innovate
            faster while protecting identities, compliance posture, and customer trust at enterprise scale.
          </p>
        </div>
      </motion.section>

      <motion.section
        id="reviews"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">Wall of Love</h2>
        <div className="marquee-shell mt-5">
          <div className="marquee-track group-hover:[animation-play-state:paused]">
            {repeatedReviews.map((review, index) => (
              <article key={`${review.name}-${index}`} className="glass-panel min-w-[320px] max-w-[320px] p-5">
                <p className="text-sm text-[#FFD700]">★★★★★</p>
                <p className="mt-3 text-sm text-slate-700">"{review.quote}"</p>
                <p className="mt-4 text-xs font-semibold text-slate-500">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="trusted-tech"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-[family-name:var(--font-instrument)] text-4xl text-slate-900">
          Trusted by modern tech teams
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Built for high-growth organizations that need secure AI workflows without slowing down operations.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {techCompanies.map((company) => (
            <article
              key={company.name}
              className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ring-white/80"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 ring-1 ring-fuchsia-100">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-5 w-5 object-contain"
                  loading="lazy"
                />
              </span>
              <span className="text-sm font-semibold text-slate-700">{company.name}</span>
            </article>
          ))}
        </div>
      </motion.section>

      <footer className="footer-glow mt-12 rounded-2xl border border-white/60 bg-white/60 px-6 py-5 text-sm text-slate-600 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="transition hover:text-fuchsia-600">
              Home
            </Link>
            <a href="#about" className="transition hover:text-fuchsia-600">
              About Us
            </a>
            <Link href="/pricing" className="transition hover:text-fuchsia-600">
              Pricing
            </Link>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-fuchsia-600"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-xs font-medium text-fuchsia-600">Built for the future of AI</p>
        </div>
      </footer>
    </main>
  );
}
