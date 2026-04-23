import os
import subprocess
import time
import json
import csv
import io
from typing import Any
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from docx import Document
from openpyxl import load_workbook
from pypdf import PdfReader

import engine as hybrid_engine
import security
from python_engine import anonymize_csv_string_py

load_dotenv()

app = FastAPI(title="SentinAI Hybrid Security Engine", version="2.0.0")

_origins = os.getenv(
    "SENTINAI_CORS_ORIGINS",
    "http://localhost:3100,http://127.0.0.1:3100,http://localhost:3000,http://127.0.0.1:3000",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_BENCH_FIXTURE = (
    "Name,Email,Note\n"
    + "".join(
        f"User{i},user{i}@example.com,Call +1 555-010-{i:04d} or x@y.com\n"
        for i in range(400)
    )
)
_BENCH_BYTES = _BENCH_FIXTURE.encode("utf-8")
_BENCH_ITER = 25


def request_ai_insights(sample_csv: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "OPENAI_API_KEY not set. AI insights are unavailable."

    client = OpenAI(api_key=api_key)
    prompt = (
        "Analyze these anonymized marketing trends and suggest 3 high-conversion "
        "strategies.\n\n"
        f"{sample_csv}"
    )
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )
    return response.output_text


async def _read_upload_bytes(file: UploadFile) -> bytes:
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > security.MAX_CSV_BYTES:
            raise HTTPException(status_code=413, detail="CSV exceeds maximum allowed size.")
        chunks.append(chunk)
    return b"".join(chunks)


def _json_to_csv_bytes(raw: bytes) -> bytes:
    """
    Convert JSON payloads to CSV for the C++ anonymization engine.
    Supported input shapes:
    - list[dict]
    - {"records": list[dict]}
    """
    try:
        payload = json.loads(raw.decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {exc}") from exc

    if isinstance(payload, dict) and isinstance(payload.get("records"), list):
        rows = payload["records"]
    elif isinstance(payload, list):
        rows = payload
    else:
        raise HTTPException(
            status_code=400,
            detail="JSON must be a list of objects or an object with a 'records' list.",
        )

    if not rows:
        raise HTTPException(status_code=400, detail="JSON contains no rows.")
    if not all(isinstance(r, dict) for r in rows):
        raise HTTPException(status_code=400, detail="All JSON rows must be objects.")

    # Stable field order based on first appearance across rows.
    fieldnames: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for key in row.keys():
            if key not in seen:
                seen.add(key)
                fieldnames.append(str(key))

    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({k: row.get(k, "") for k in fieldnames})
    return stream.getvalue().encode("utf-8")


def _rows_to_csv_bytes(rows: list[dict[str, Any]]) -> bytes:
    if not rows:
        raise HTTPException(status_code=400, detail="File contains no rows.")
    fieldnames: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for key in row.keys():
            if key not in seen:
                seen.add(key)
                fieldnames.append(str(key))
    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({k: row.get(k, "") for k in fieldnames})
    return stream.getvalue().encode("utf-8")


def _text_to_csv_bytes(raw: bytes) -> bytes:
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    rows = [{"Content": ln} for ln in lines]
    return _rows_to_csv_bytes(rows)


def _tsv_to_csv_bytes(raw: bytes) -> bytes:
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    rows = [dict(r) for r in reader]
    return _rows_to_csv_bytes(rows)


def _xlsx_to_csv_bytes(raw: bytes) -> bytes:
    wb = load_workbook(filename=io.BytesIO(raw), read_only=True, data_only=True)
    ws = wb.active
    it = ws.iter_rows(values_only=True)
    header_row = next(it, None)
    if not header_row:
        raise HTTPException(status_code=400, detail="Spreadsheet is empty.")
    headers = [str(h) if h is not None and str(h).strip() else f"Column{i+1}" for i, h in enumerate(header_row)]
    rows: list[dict[str, Any]] = []
    for values in it:
        row_dict: dict[str, Any] = {}
        has_data = False
        for i, value in enumerate(values):
            val = "" if value is None else str(value)
            if val != "":
                has_data = True
            if i < len(headers):
                row_dict[headers[i]] = val
        if has_data:
            rows.append(row_dict)
    return _rows_to_csv_bytes(rows)


def _docx_to_csv_bytes(raw: bytes) -> bytes:
    doc = Document(io.BytesIO(raw))
    lines = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
    rows = [{"Content": ln} for ln in lines]
    return _rows_to_csv_bytes(rows)


def _pdf_to_csv_bytes(raw: bytes) -> bytes:
    reader = PdfReader(io.BytesIO(raw))
    rows: list[dict[str, Any]] = []
    for idx, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            rows.append({"Page": idx, "Content": text.replace("\n", " ")})
    return _rows_to_csv_bytes(rows)


def _normalize_to_csv(raw: bytes, filename: str) -> bytes:
    lower_name = filename.lower()
    ext = Path(lower_name).suffix

    if ext == ".csv":
        security.assert_csv_magic(raw[:4096])
        return raw
    if ext == ".json":
        return _json_to_csv_bytes(raw)
    if ext == ".tsv":
        return _tsv_to_csv_bytes(raw)
    if ext == ".txt":
        return _text_to_csv_bytes(raw)
    if ext in {".xlsx", ".xlsm", ".xltx", ".xltm", ".xls"}:
        return _xlsx_to_csv_bytes(raw)
    if ext == ".docx":
        return _docx_to_csv_bytes(raw)
    if ext == ".pdf":
        return _pdf_to_csv_bytes(raw)

    raise HTTPException(
        status_code=400,
        detail="Supported formats: .csv, .json, .txt, .tsv, .xlsx, .xls, .docx, .pdf",
    )


@app.get("/api/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "native_cpp": hybrid_engine.native_available(),
    }


@app.get("/api/performance")
def performance() -> dict[str, Any]:
    t0 = time.perf_counter()
    for _ in range(_BENCH_ITER):
        anonymize_csv_string_py(_BENCH_FIXTURE)
    py_ms = (time.perf_counter() - t0) * 1000.0 / _BENCH_ITER

    cpp_ms: float
    backend: str
    if hybrid_engine.native_available():
        t1 = time.perf_counter()
        for _ in range(_BENCH_ITER):
            hybrid_engine.anonymize_csv_bytes(_BENCH_BYTES)
        cpp_ms = (time.perf_counter() - t1) * 1000.0 / _BENCH_ITER
        backend = "pybind11"
    else:
        sub_iter = max(3, _BENCH_ITER // 5)
        t1 = time.perf_counter()
        for _ in range(sub_iter):
            hybrid_engine.anonymize_csv_bytes(_BENCH_BYTES)
        cpp_ms = (time.perf_counter() - t1) * 1000.0 / sub_iter
        backend = "subprocess"

    speedup = py_ms / cpp_ms if cpp_ms > 0 else None

    return {
        "python_ms_per_run": round(py_ms, 3),
        "cpp_ms_per_run": round(cpp_ms, 3),
        "speedup_estimate": None if speedup is None else round(speedup, 2),
        "iterations": _BENCH_ITER,
        "native_available": hybrid_engine.native_available(),
        "cpp_backend": backend,
        "note": "Synthetic CSV micro-benchmark; subprocess path includes per-run process spawn.",
    }


async def _process_payload(file: UploadFile) -> dict[str, Any]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="A file is required.")

    lower_name = file.filename.lower()

    raw = await _read_upload_bytes(file)
    raw = _normalize_to_csv(raw, lower_name)

    try:
        anonymized_data, backend = hybrid_engine.anonymize_csv_bytes(raw)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except subprocess.CalledProcessError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Anonymization engine failed: {exc.stderr or exc.stdout}",
        ) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Engine error: {exc}") from exc

    sample_lines = anonymized_data.splitlines()[:11]
    sample_csv = "\n".join(sample_lines)
    ai_insights = request_ai_insights(sample_csv)

    return {
        "status": "secure",
        "engine": backend,
        "filename": security.sanitize_filename(file.filename),
        "anonymized_data": anonymized_data,
        "ai_insights": ai_insights,
    }


@app.post("/process")
async def process_legacy(file: UploadFile = File(...)):
    """Legacy endpoint (multipart field: file)."""
    return await _process_payload(file)


@app.post("/api/process")
async def process_modern(file: UploadFile = File(...)):
    return await _process_payload(file)
