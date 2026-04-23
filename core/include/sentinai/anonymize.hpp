#pragma once

#include <string>

namespace sentinai {

// High-speed CSV anonymization with regex-based PII redaction on cell text,
// then deterministic masking for Name / Email columns when present.
std::string anonymize_csv_string(const std::string& input);

}  // namespace sentinai
