![SentinAI Banner](./github-banner.svg)

# SentinAI Hybrid Security Engine

Premium **hybrid data anonymization system** combining:
- **Python (FastAPI)** for orchestration, validation, and API logic
- **C++** for high-performance CSV parsing and sensitive data anonymization
- **Next.js + Tailwind dashboard** for a modern “vibrant luxury” user experience

---

## What is this?

SentinAI is a **privacy-focused data anonymization engine** designed to remove or mask sensitive information (such as names, emails, and phone numbers) from structured datasets like CSV files.

The goal is simple:
> Prepare data safely before using it in analytics or AI systems to prevent accidental data leaks.

---

## System overview

This project demonstrates a real-world **hybrid architecture**:

### 🌐 Frontend (Next.js + Tailwind)
A modern dashboard where users:
- Upload CSV files
- View anonymization process
- Download cleaned output

Designed with a **glassmorphism / luxury UI style**.

---

### 🧠 Backend (Python / FastAPI)
Responsible for:
- File upload handling
- Validation and security checks
- API routing
- Communication with the C++ engine

---

### ⚙️ Core Engine (C++)
A high-performance anonymization engine that:
- Parses large CSV files efficiently
- Detects sensitive fields using regex-based rules
- Masks or removes PII (Personally Identifiable Information)

Used either:
- via **Pybind11 (in-process integration)**, or
- via **subprocess execution (fallback mode)**

---

## Why this architecture?

This system mirrors real production design:

- Python → fast development + API logic
- C++ → performance-critical processing
- Hybrid integration → scalable and flexible architecture

---

## Live demo

Frontend:
https://sentinai-data-anonymizer.netlify.app

Backend can be deployed separately (e.g. Render) and connected via environment variables.

---

## Project structure

| Path | Description |
|------|-------------|
| `core/` | C++ anonymization engine + CLI tool |
| `native/` | Optional Pybind11 Python binding |
| `server/` | FastAPI backend |
| `frontend/` | Next.js dashboard |
| `data/` | Sample CSV datasets |

---

## Security features

- File size limit enforcement (default: 10MB)
- CSV-only upload validation
- Filename sanitization
- Binary content detection
- Temporary file isolation during processing
- Environment-based secret management

> This project is an educational implementation and does not replace production-grade compliance systems (e.g. GDPR-certified pipelines).

---

## Build C++ engine (Windows)

```powershell
powershell -ExecutionPolicy Bypass -File .\build-engine.ps1
