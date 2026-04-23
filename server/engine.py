"""Hybrid engine: prefer Pybind11 in-process C++; fallback to C++ CLI subprocess."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path
from typing import Literal

Backend = Literal["pybind11", "subprocess"]

try:
    import sentinai_native as _native  # type: ignore
except Exception:  # pragma: no cover - optional extension
    _native = None


def resolve_engine_path() -> Path:
    root = Path(__file__).resolve().parents[1]
    candidates = [
        root / "core" / "build" / "sentinai_engine",
        root / "core" / "build" / "sentinai_engine.exe",
        root / "core" / "build" / "Release" / "sentinai_engine.exe",
        root / "core" / "build_mingw" / "sentinai_engine.exe",
        root / "core" / "sentinai_engine",
        root / "core" / "sentinai_engine.exe",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "sentinai_engine binary not found. Run build-engine.ps1 or compile core/."
    )


def anonymize_csv_bytes(raw: bytes) -> tuple[str, Backend]:
    if _native is not None:
        out: bytes = _native.anonymize_csv(raw)
        return out.decode("utf-8"), "pybind11"

    engine_path = resolve_engine_path()
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        input_path = temp_path / "input.csv"
        output_path = temp_path / "output.csv"
        input_path.write_bytes(raw)
        subprocess.run(
            [str(engine_path), str(input_path), str(output_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        return output_path.read_text(encoding="utf-8"), "subprocess"


def native_available() -> bool:
    return _native is not None
