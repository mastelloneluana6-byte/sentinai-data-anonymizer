![SentinAI Banner](./github-banner.svg)

# SentinAI Hybrid Security Engine

Premium **hybrid** security tooling: **Python** for orchestration (FastAPI, validation, AI) and **C++** for performance-critical anonymization (regex scanning + column masking). The dashboard is a **Next.js + Tailwind** “Vibrant Luxury” experience.

## Wat is dit, in gewone taal?

**Kort gezegd:** dit is een demo van een **privacy- en anonymisatie-stack** voor gevoelige data (zoals namen, e-mails, telefoonnummers in spreadsheets). Het idee: je kunt bestanden **veilig voorbereiden** voordat je ze in AI-tools of analyses stopt — zodat je minder snel per ongeluk persoonsgegevens lekt.

**Wat voor systeem heb je gebouwd?** Een **hybride** opstelling, zoals je die ook in echte producten ziet:

- **Een web-dashboard** (modern, luxe UI) waar gebruikers het verhaal zien: upload → maskeren → export. Dat draait als **Next.js**-frontend.
- **Een API-server** in **Python (FastAPI)** die uploads aanneemt, limieten afdwingt, en de zware klus **doorstuurt naar C++** waar het echt snel moet: het eigenlijke **scrubben/maskeren** van tekst in CSV’s.
- **C++** als “motor”: een aparte engine (en optioneel een native Python-koppeling) voor **hoge snelheid** op grote of lastige bestanden.

**Waarom zo splitsen?** Python is ideaal om snel een veilige API en productlogica te bouwen; C++ is sterk als je **performance** op de voorgrond wilt. Samen is dat een **bewuste architectuurkeuze**, niet alleen een mooie demo-UI.

**Live voorbeeld:** de gepubliceerde site staat op [sentinai-data-anonymizer.netlify.app](https://sentinai-data-anonymizer.netlify.app). De backend kun je apart hosten (bijv. op Render) en koppelen via omgevingsvariabelen — zie verderop in dit document.

> Dit blijft **educatieve demo-software**: goed om te leren en te tonen, maar voor echte productie heb je nog extra zaken nodig (authenticatie, audit, juridische review, enz.).

## Hybrid architecture (why this shape)

- **Brain (Python / FastAPI):** HTTP API, upload handling, size limits, filename hygiene, OpenAI orchestration, CORS, observability hooks.
- **Muscles (C++):** Streaming-safe CSV parsing path for the CLI binary; in-process string anonymization shares the same logic for Pybind11.
- **Integration (two tiers):**
  1. **Preferred:** `sentinai_native` **Pybind11** extension calls `sentinai::anonymize_csv_string` in-process (lowest latency; requires a compiler toolchain compatible with your Python build on Windows, typically MSVC).
  2. **Fallback:** FastAPI hands off to the compiled **`sentinai_engine`** binary via **`subprocess`** (works everywhere the binary exists; higher per-call overhead).

This mirrors common production patterns: Python for product velocity, C++ for hot paths—connected either in-process or via a controlled sidecar.

## Repository layout

| Path | Role |
| --- | --- |
| `core/` | C++ library (`src/anonymize.cpp`) + CLI `sentinai_engine` |
| `native/` | Optional Pybind11 extension (`pip install ./native`) |
| `server/` | FastAPI app (`main.py`, `engine.py`, `security.py`) |
| `frontend/` | Next.js 14 + Tailwind dashboard |
| `data/` | Sample CSV fixtures |

## Security practices (server)

- **Hard upload ceiling:** `SENTINAI_MAX_CSV_MB` (default **10** MB) enforced while reading chunks.
- **CSV-only contract:** rejects non-`.csv` filenames at the API edge.
- **Filename sanitization:** strips path components, caps length, rejects odd characters.
- **Binary rejection heuristic:** rejects uploads with NUL bytes in the first 4 KiB.
- **Ephemeral processing:** anonymization via subprocess uses a temporary directory that is destroyed automatically.
- **Secrets:** load from `server/.env` (`python-dotenv`); never commit real keys.

> This is educational scaffolding—treat threat modeling, authn/z, logging, and deployment hardening as follow-ups for a certification-ready deployment.

## Build the C++ engine (Windows-friendly)

From the repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-engine.ps1
```

This prefers **WinLibs MinGW** when present, otherwise Visual Studio generators. Output:

- `core/build_mingw/sentinai_engine.exe` (typical on your setup), or
- `core/build/Release/sentinai_engine.exe`

Smoke test:

```powershell
.\core\build_mingw\sentinai_engine.exe .\data\sample_marketing.csv .\data\out.csv
```

## Optional: Pybind11 in-process module

```powershell
cd server
.\.venv\Scripts\Activate.ps1
pip install pybind11
pip install ..\native
```

On Windows, this step usually requires **Visual Studio Build Tools (Desktop C++ + Windows SDK)** so the extension ABI matches CPython. If installation fails, the API **still works** via the `subprocess` fallback.

## Run the API

```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```

Defaults to **https://sentinai-data-anonymizer.netlify.app** (override with `SENTINAI_API_PORT`).

### Key endpoints

- `POST /process` and `POST /api/process` — multipart field **`file`**
- `GET /api/health` — liveness + `native_cpp` flag
- `GET /api/performance` — micro-benchmark JSON for the dashboard chart

## Run the luxury dashboard (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

Visit **https://sentinai-data-anonymizer.netlify.app**.

**Snelste start (Windows):** dubbelklik of run vanaf de projectroot:

```powershell
powershell -ExecutionPolicy Bypass -File .\Run-SentinAI.ps1
```

Dat opent de API in een **nieuw** venster en start Next in je huidige venster.

Rewrites proxy `/api/*` en `/process` naar `SENTINAI_API_ORIGIN` (standaard `http://127.0.0.1:9123`, zie `frontend/.env.development`). Aanpassen kan zo:

```powershell
$env:SENTINAI_API_ORIGIN="http://127.0.0.1:9123"
npm.cmd run dev
```

## Deploy (Netlify frontend + Render API)

This repo is a **monorepo**:

- **Netlify** should deploy the **`frontend/`** directory as a **Next.js** project.
- **Render** should deploy the **`server/`** directory as a **Python Web Service**.

### Netlify (Next.js)

1. Import the GitHub repo in Netlify.
2. Set **Base Directory** to `frontend`.
3. Add an environment variable (Production + Preview):
   - `SENTINAI_API_ORIGIN` = your Render API base URL, e.g. `https://your-api.onrender.com` (no trailing slash)
4. Redeploy (prefer **without cache**).

### Render (FastAPI)

1. Create a **Web Service** from the same GitHub repo.
2. Set **Root Directory** to `server`.
3. **Build command:** `pip install -r requirements.txt`
4. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `SENTINAI_CORS_ORIGINS` = comma-separated list of your **exact** Netlify/browser origins, e.g.
     - `https://sentinai-data-anonymizer.netlify.app`
     - plus any preview URLs you use (each preview URL is a separate origin)

Notes:

- CORS **does not support wildcards** like `*.netlify.app` for browser `Origin` headers. You must list the concrete `https://...netlify.app` origins you use (or set a single custom domain and allow only that).
- The C++ binary may not exist on Linux cloud hosts; the API can still run, but engine mode depends on what is available in that environment.

## Lighthouse / performance posture

The frontend is intentionally lightweight (App Router static shell, `next/font` self-hosted Google fonts, minimal client JS). **We do not claim an unaudited “100/100 Lighthouse” score**—scores depend on machine, extensions, and network. That said, the stack is aligned with common **100/100 targeting** practices:

- System fonts loading strategy via `next/font`
- Small client bundle for the landing dashboard
- No massive image payloads on the critical path

Run Lighthouse in Chrome DevTools against `http://localhost:3100` after `npm run build && npm start` for production-like numbers.

## Art direction recap

- **Canvas:** `#f8fafc` crisp light base + aurora glows
- **Glass:** `backdrop-blur-xl` panels, translucent borders
- **Gradients:** `#ff2d95` → `#7c3aed` → `#38bdf8`
- **Typography:** `Instrument Serif` + `Inter`

## License

Educational demo—add your own license before distribution.
