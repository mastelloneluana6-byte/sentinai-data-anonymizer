#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

#include "sentinai/anonymize.hpp"

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " input.csv output.csv\n";
        return 1;
    }

    const std::string input_path = argv[1];
    const std::string output_path = argv[2];

    std::ifstream input_file(input_path, std::ios::binary);
    if (!input_file.is_open()) {
        std::cerr << "Error: Unable to open input file: " << input_path << "\n";
        return 1;
    }

    std::ostringstream buffer;
    buffer << input_file.rdbuf();
    const std::string raw = buffer.str();
    if (raw.empty()) {
        std::cerr << "Error: Input file is empty.\n";
        return 1;
    }

    const std::string anonymized = sentinai::anonymize_csv_string(raw);

    std::ofstream output_file(output_path, std::ios::binary);
    if (!output_file.is_open()) {
        std::cerr << "Error: Unable to open output file: " << output_path << "\n";
        return 1;
    }

    output_file << anonymized;
    std::cout << "Anonymization complete: " << output_path << "\n";
    return 0;
}
