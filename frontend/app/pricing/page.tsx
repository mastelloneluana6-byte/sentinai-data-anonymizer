"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-16 pt-8">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lux-nav sticky top-4 z-30 mb-8 flex items-center justify-between gap-4 rounded-2xl px-5 py-3"
      >
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
            href="/dashboard"
            className="rounded-full bg-[#FF2D95] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(255,45,149,0.45)] transition hover:-translate-y-0.5"
          >
            Enter Vault
          </Link>
        </div>
      </motion.nav>

      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.05] text-slate-900 md:text-6xl">
          Pricing
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">
          Transparent plans for teams that want enterprise-grade privacy without enterprise complexity.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Starter Vault</p>
          <h2 className="mt-2 font-[family-name:var(--font-instrument)] text-4xl text-slate-900">$0</h2>
          <p className="text-sm text-slate-500">/ month</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>• 5 File Scans per month.</li>
            <li>• Standard Processing Speed.</li>
            <li>• Community Support.</li>
            <li>• Basic Privacy Audit Logs.</li>
          </ul>
          <button
            type="button"
            className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            Get Started for Free
          </button>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Pro Architect</p>
          <h2 className="mt-2 font-[family-name:var(--font-instrument)] text-4xl text-slate-900">$9.99</h2>
          <p className="text-sm text-slate-500">/ month</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>• Unlimited File Scans.</li>
            <li>• C++ High-Performance Mode (100x Speed).</li>
            <li>• Priority 24/7 Support.</li>
            <li>• Full API Access & Integrations.</li>
            <li>• Deterministic Masking.</li>
          </ul>
          <button
            type="button"
            className="mt-6 rounded-full bg-[#FF2D95] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_26px_rgba(255,45,149,0.62)]"
          >
            Upgrade to Pro
          </button>
        </motion.article>
      </section>
    </main>
  );
}
