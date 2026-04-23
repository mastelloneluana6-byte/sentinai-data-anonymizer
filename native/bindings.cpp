#include <pybind11/pybind11.h>

#include "sentinai/anonymize.hpp"

namespace py = pybind11;

PYBIND11_MODULE(sentinai_native, m) {
    m.doc() = "SentinAI Hybrid Security Engine — native C++ anonymization";
    m.def(
        "anonymize_csv",
        [](py::bytes data) {
            std::string raw = static_cast<std::string>(data);
            std::string out = sentinai::anonymize_csv_string(raw);
            return py::bytes(out);
        },
        py::arg("data"),
        "Anonymize CSV bytes using the C++ engine (regex + column masking).");
}
