"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    title: "1. Scope",
    body: "This Privacy Policy describes how SPECTRA | VAULT handles data when you use our privacy-first anonymization platform for AI workflows. It covers the web app, API endpoints, and associated processing services.",
  },
  {
    title: "2. Data We Process",
    body: "We process files you upload (for example CSV, JSON, TXT, TSV, XLSX/XLS, DOCX, and PDF) solely to anonymize and sanitize sensitive content. Typical data categories can include names, emails, phone numbers, addresses, and campaign metadata.",
  },
  {
    title: "3. Processing Purpose",
    body: "Our primary purpose is privacy protection before AI usage. Uploaded content is transformed into anonymized output so customers can safely use downstream LLM tools and analytics systems with reduced exposure risk.",
  },
  {
    title: "4. Legal Basis (GDPR-Oriented)",
    body: "Where GDPR applies, processing is generally performed under legitimate interests and/or contract performance, depending on customer configuration and deployment context. Customers remain responsible for ensuring an appropriate lawful basis for their source data.",
  },
  {
    title: "5. Data Minimization and Security Controls",
    body: "We apply data minimization principles and process only what is needed for sanitization. Core controls include deterministic masking options, C++ high-performance anonymization, temporary processing directories, and configurable retention behavior in customer-managed operations.",
  },
  {
    title: "6. Retention",
    body: "By design, uploaded files are intended for short-lived processing. Temporary artifacts are deleted after pipeline completion. Customers should configure infrastructure-level backups, retention windows, and logs according to their compliance requirements.",
  },
  {
    title: "7. AI Integrations",
    body: "If AI insight features are enabled, only anonymized sample content should be sent to external AI providers. Customers control whether they provide API credentials and remain responsible for provider-side compliance and data handling terms.",
  },
  {
    title: "8. International Transfers",
    body: "Any international transfer of data depends on the customer's deployment and provider choices. When transfers occur, appropriate safeguards (such as SCCs or equivalent mechanisms) should be in place under applicable law.",
  },
  {
    title: "9. Your Rights",
    body: "Subject to applicable law, users may have rights to access, correction, deletion, restriction, objection, and portability. Enterprise customers should route rights requests through their designated data controller processes.",
  },
  {
    title: "10. Incident Response",
    body: "We recommend maintaining an incident response workflow with audit log review, containment, and notification procedures aligned with regulatory timelines relevant to your jurisdiction and industry.",
  },
  {
    title: "11. Children’s Data",
    body: "The service is not intended for use by children under the age required by applicable law. Do not upload data that you are not authorized to process.",
  },
  {
    title: "12. Policy Updates",
    body: "We may update this policy periodically to reflect legal, security, or product changes. Material updates should be reviewed before continued operational use.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative mx-auto max-w-5xl px-6 pb-16 pt-8">
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
          Privacy Policy
        </h1>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          Enterprise-grade privacy commitments for AI data anonymization workflows.
        </p>
        <p className="mt-2 text-xs text-slate-500">Last updated: April 2026</p>
      </header>

      <section className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} className="glass-panel p-6">
            <h2 className="font-[family-name:var(--font-instrument)] text-2xl text-slate-900">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
