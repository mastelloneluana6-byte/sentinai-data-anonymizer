"""Optional in-process extension (Pybind11). Install from repo root: pip install ./native"""

from pathlib import Path

from setuptools import setup

try:
    from pybind11.setup_helpers import Pybind11Extension, build_ext
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Install pybind11 first: pip install pybind11") from exc

ROOT = Path(__file__).resolve().parent
CORE = ROOT.parent / "core"

ext_modules = [
    Pybind11Extension(
        "sentinai_native",
        [
            str(ROOT / "bindings.cpp"),
            str(CORE / "src" / "anonymize.cpp"),
        ],
        include_dirs=[str(CORE / "include")],
        cxx_std=17,
    ),
]

setup(
    name="sentinai_native",
    version="0.1.0",
    ext_modules=ext_modules,
    cmdclass={"build_ext": build_ext},
    zip_safe=False,
)
