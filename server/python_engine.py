"""Reference Python implementation for benchmarking (not used in production hot path)."""

from __future__ import annotations

import hashlib
import re
from typing import List

_EMAIL = re.compile(r"([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})")
_PHONE = re.compile(r"\+?\d[\d\s().-]{7,}\d")


def _split_csv_line(line: str) -> List[str]:
    columns: List[str] = []
    current: List[str] = []
    in_quotes = False
    for ch in line:
        if ch == '"':
            in_quotes = not in_quotes
        elif ch == "," and not in_quotes:
            columns.append("".join(current))
            current = []
        else:
            current.append(ch)
    columns.append("".join(current))
    return columns


def _mask_value(value: str) -> str:
    parts = [
        hashlib.sha256(value.encode("utf-8")).hexdigest(),
        hashlib.sha256(f"sentinai:{value}".encode("utf-8")).hexdigest(),
        hashlib.sha256(f"{value}:privacy".encode("utf-8")).hexdigest(),
        hashlib.sha256(f"engine:{value}:v1".encode("utf-8")).hexdigest(),
    ]
    return "anon_" + "".join(parts)


def _redact(cell: str) -> str:
    out = _EMAIL.sub("[EMAIL]", cell)
    out = _PHONE.sub("[PHONE]", out)
    return out


def anonymize_csv_string_py(csv: str) -> str:
    lines = csv.splitlines()
    if not lines:
        return ""
    header = _split_csv_line(lines[0])
    name_index = next((i for i, h in enumerate(header) if h == "Name"), -1)
    email_index = next((i for i, h in enumerate(header) if h == "Email"), -1)
    out_lines: List[str] = [lines[0]]
    for line in lines[1:]:
        row = _split_csv_line(line)
        row = [_redact(c) for c in row]
        if name_index >= 0 and name_index < len(row):
            row[name_index] = _mask_value(row[name_index])
        if email_index >= 0 and email_index < len(row):
            row[email_index] = _mask_value(row[email_index])
        out_lines.append(",".join(row))
    body = "\n".join(out_lines)
    if csv.endswith("\n"):
        return body + "\n"
    return body
