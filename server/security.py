"""Upload validation and safe file handling."""

from __future__ import annotations

import os
import re
from pathlib import Path

MAX_UPLOAD_BYTES = int(os.getenv("SENTINAI_MAX_CSV_MB", "10")) * 1024 * 1024
# Backward-compatible alias used in older code paths.
MAX_CSV_BYTES = MAX_UPLOAD_BYTES
ALLOWED_SUFFIX = ".csv"
_SAFE_NAME = re.compile(r"^[a-zA-Z0-9._()\- ]+$")


def sanitize_filename(name: str | None) -> str:
    if not name or not name.strip():
        return "upload.csv"
    base = Path(name).name
    if len(base) > 200:
        base = base[:200]
    if not _SAFE_NAME.match(base):
        return "upload.csv"
    if not base.lower().endswith(ALLOWED_SUFFIX):
        base = base.rsplit(".", 1)[0] + ALLOWED_SUFFIX
    return base


def assert_csv_magic(header: bytes) -> None:
    """Reject obvious non-text uploads (very small heuristic)."""
    if not header:
        raise ValueError("Empty upload")
    if b"\x00" in header[:4096]:
        raise ValueError("Binary CSV uploads are not supported")
