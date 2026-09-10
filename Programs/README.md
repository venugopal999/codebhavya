# CodeBhavya Program Library

Upload the complete `Programs` folder to the repository root. Its main URL is:

`https://codebhavya.com/Programs/`

The catalog contains **698 unique, compiler-ready programs** across five
courses: 200 C Programming examples, 106 Data Structures examples, 112
Advanced Data Structures examples, 150 Python examples and 130 AI & Machine
Learning examples. Programs are grouped into 78 compact topic accordions on a
single catalog page, so a topic is never split by pagination. Only the selected
accordion needs to be expanded. Search, course, topic and difficulty filters
work across the full catalog.

## Course coverage

| Course | Topics | Programs |
| --- | ---: | ---: |
| C Programming | 15 | 200 |
| Data Structures | 8 | 106 |
| Advanced Data Structures | 14 | 112 |
| Python | 15 | 150 |
| AI & Machine Learning | 26 | 130 |
| **Total** | **78** | **698** |

The C library includes dedicated `switch`, nested decision, menu, loop-control,
preprocessor, function-pointer, command-line, dynamic-memory, user-defined-type
and file-handling examples. See `C-CONCEPT-COVERAGE.md` for the audited checklist.

The Data Structures library covers array techniques; singly, doubly and circular
linked lists; stacks and expressions; queues and deques; binary trees and BSTs;
heaps, hashing and disjoint sets; and graph algorithms. See
`DSA-CONCEPT-COVERAGE.md` for the complete map.

The Advanced Data Structures library follows CodeBhavya Levels 8–21, from
performance analysis and disjoint sets through sparse matrices, pattern
matching, advanced sorting/searching, balanced and digital trees, B-trees,
advanced heaps/hashing/file organization/graphs and placement structures. See
`ADS-CONCEPT-COVERAGE.md` for the audited level map.

The Python library covers syntax and I/O; variables and types; operators;
decisions; loops; patterns and number problems; strings; lists; tuples, sets
and dictionaries; functions and recursion; object-oriented programming;
exceptions and files; standard modules, dates and regular expressions;
functional and advanced Python; and JSON, CSV and collection utilities. See
`PYTHON-CONCEPT-COVERAGE.md` for the audited concept map.

The AI & Machine Learning library follows all 26 CodeBhavya course levels,
with five executable examples per level. It progresses from foundations,
Python data work, linear algebra and statistics through supervised and
unsupervised learning, neural networks, computer vision, time series, NLP,
transformers/LLMs, generative AI/RAG/agents, classical search, reinforcement
learning, MLOps/responsible AI, and placement projects. See
`AI-ML-CONCEPT-COVERAGE.md` for the complete level map.

Every program has its own indexable page with a canonical URL, complete source,
sample input/output, program-specific algorithm and explanation, audited time
and space complexity, program-specific common mistakes, copy/download actions
and one-click compiler loading. The first six C pages
retain their advanced visual debuggers. Other pages provide an explicitly
labelled guided code tour and do not claim to execute code in the browser.

## Required compiler integration

`Open in compiler` transfers the selected source through `localStorage` using
the key `codebhavya-compiler:incoming-program`. This package intentionally does
not replace the working online compiler. Upload only the `Programs/` folder;
the compiler-side transfer fix that is already working on the site remains
unchanged.

The compiler consumes the staged program once, replaces the previously saved
source and removes the transfer record.

## Integration links

Add this link to a page located one folder below the repository root:

```html
<a href="../Programs/index.html">💻 Program Library</a>
```

Add the supplied program sitemap to the main sitemap or submit it separately:

`https://codebhavya.com/Programs/sitemap-programs.xml`

## Maintenance and validation

- C definitions: `c-library/`
- Data Structures definitions: `dsa-library/`
- Advanced Data Structures definitions: `ads-library/`
- Python definitions: `python-library/`
- AI & Machine Learning definitions: `ai-ml-library/`
- C coverage checklist: `C-CONCEPT-COVERAGE.md`
- DSA coverage checklist: `DSA-CONCEPT-COVERAGE.md`
- ADS coverage checklist: `ADS-CONCEPT-COVERAGE.md`
- Python coverage checklist: `PYTHON-CONCEPT-COVERAGE.md`
- AI & Machine Learning coverage checklist: `AI-ML-CONCEPT-COVERAGE.md`
- Generated C sources: `c-source/`
- Generated Data Structures sources: `dsa-source/`
- Generated Advanced Data Structures sources: `ads-source/`
- Generated Python sources: `python-source/`
- Generated AI & Machine Learning sources: `ai-ml-source/`
- Catalog data: `programs-data.js`
- Shared standard page behavior: `program-page.js`
- Regenerate: `node generate-complete-program-library.js`
- Compile and execute every sample: `node validate-program-library.js`

The validation command compiles all 418 C sources with GCC C11, `-Wall`,
`-Wextra`, `-Werror` and `-pedantic`; syntax-checks all 280 Python-language
sources with Python 3; then executes every sample with a timeout and confirms
its expected output.
