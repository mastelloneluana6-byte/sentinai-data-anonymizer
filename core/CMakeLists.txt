cmake_minimum_required(VERSION 3.16)
project(sentinai_engine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_library(sentinai_anonymize STATIC
    src/anonymize.cpp
)
target_include_directories(sentinai_anonymize PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

add_executable(sentinai_engine encryptor.cpp)
target_link_libraries(sentinai_engine PRIVATE sentinai_anonymize)
