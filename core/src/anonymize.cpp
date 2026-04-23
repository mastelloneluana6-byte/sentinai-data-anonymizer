#include "sentinai/anonymize.hpp"

#include <functional>
#include <iomanip>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

namespace sentinai {
namespace {

std::vector<std::string> split_csv_line(const std::string& line) {
    std::vector<std::string> columns;
    std::string current;
    bool in_quotes = false;

    for (char ch : line) {
        if (ch == '"') {
            in_quotes = !in_quotes;
        } else if (ch == ',' && !in_quotes) {
            columns.push_back(current);
            current.clear();
        } else {
            current.push_back(ch);
        }
    }
    columns.push_back(current);
    return columns;
}

std::string to_hex_64(std::size_t value) {
    std::stringstream ss;
    ss << std::hex << std::setw(16) << std::setfill('0') << value;
    return ss.str();
}

std::string mask_value(const std::string& input) {
    std::hash<std::string> hasher;
    std::size_t h1 = hasher(input);
    std::size_t h2 = hasher("sentinai:" + input);
    std::size_t h3 = hasher(input + ":privacy");
    std::size_t h4 = hasher("engine:" + input + ":v1");
    return "anon_" + to_hex_64(h1) + to_hex_64(h2) + to_hex_64(h3) + to_hex_64(h4);
}

std::string redact_regex_patterns(const std::string& cell) {
    std::string out = cell;
    static const std::regex email_re(
        R"(([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}))",
        std::regex::ECMAScript | std::regex::optimize);
    static const std::regex phone_re(
        R"(\+?\d[\d\s().-]{7,}\d)",
        std::regex::ECMAScript | std::regex::optimize);
    out = std::regex_replace(out, email_re, std::string("[EMAIL]"));
    out = std::regex_replace(out, phone_re, std::string("[PHONE]"));
    return out;
}

}  // namespace

std::string anonymize_csv_string(const std::string& input) {
    std::istringstream input_stream(input);
    std::ostringstream output;
    std::string line;

    if (!std::getline(input_stream, line)) {
        return {};
    }

    std::vector<std::string> header = split_csv_line(line);
    int name_index = -1;
    int email_index = -1;

    for (std::size_t i = 0; i < header.size(); ++i) {
        if (header[i] == "Name") {
            name_index = static_cast<int>(i);
        } else if (header[i] == "Email") {
            email_index = static_cast<int>(i);
        }
    }

    output << line << "\n";

    while (std::getline(input_stream, line)) {
        std::vector<std::string> row = split_csv_line(line);
        for (std::size_t i = 0; i < row.size(); ++i) {
            row[i] = redact_regex_patterns(row[i]);
        }
        if (name_index >= 0 && static_cast<std::size_t>(name_index) < row.size()) {
            row[name_index] = mask_value(row[name_index]);
        }
        if (email_index >= 0 && static_cast<std::size_t>(email_index) < row.size()) {
            row[email_index] = mask_value(row[email_index]);
        }

        for (std::size_t i = 0; i < row.size(); ++i) {
            output << row[i];
            if (i + 1 < row.size()) {
                output << ",";
            }
        }
        output << "\n";
    }

    return output.str();
}

}  // namespace sentinai
