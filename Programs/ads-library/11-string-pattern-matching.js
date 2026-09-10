"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 11 — String Pattern Matching";

function program(options) {
  return makeAds({ topic, concepts: ["Pattern matching", "String preprocessing"], difficulty: "Advanced", space: "O(pattern length)", ...options });
}

module.exports = [
  program({
    slug: "ads-naive-overlapping-pattern-search",
    title: "Find Overlapping Matches with Naive Search",
    difficulty: "Beginner",
    source: cMain(`    const char text[] = "ABABABA", pattern[] = "ABA";
    int text_length = (int) strlen(text), pattern_length = (int) strlen(pattern);
    printf("Matches:");
    for (int start = 0; start <= text_length - pattern_length; start++) {
        int offset = 0;
        while (offset < pattern_length && text[start + offset] == pattern[offset]) offset++;
        if (offset == pattern_length) printf(" %d", start);
    }
    putchar('\\n'); return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Matches: 0 2 4",
    time: "O(nm)",
    method: "Try the pattern at every valid start, including positions that overlap a previous match."
  }),
  program({
    slug: "ads-kmp-prefix-function",
    title: "Build the KMP Prefix Table",
    source: cMain(`    const char pattern[] = "ABABCABAB";
    int length = (int) strlen(pattern), prefix[20] = {0};
    for (int index = 1, border = 0; index < length;) {
        if (pattern[index] == pattern[border]) prefix[index++] = ++border;
        else if (border) border = prefix[border - 1];
        else prefix[index++] = 0;
    }
    for (int index = 0; index < length; index++) printf("%d%c", prefix[index], index == length - 1 ? '\\n' : ' ');
    return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "0 0 1 2 0 1 2 3 4",
    time: "O(m)",
    method: "Reuse the longest proper prefix that is also a suffix after each mismatch."
  }),
  program({
    slug: "ads-kmp-pattern-search",
    title: "Search Text with the KMP Algorithm",
    source: cMain(`    const char text[] = "ABABDABACDABABCABAB", pattern[] = "ABABCABAB";
    int n = (int) strlen(text), m = (int) strlen(pattern), prefix[20] = {0};
    for (int i = 1, border = 0; i < m;) {
        if (pattern[i] == pattern[border]) prefix[i++] = ++border;
        else if (border) border = prefix[border - 1]; else prefix[i++] = 0;
    }
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == m) { printf("Index = %d\\n", i - j); break; }
        if (i < n && text[i] != pattern[j]) { if (j) j = prefix[j - 1]; else i++; }
    }
    return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Index = 10",
    time: "O(n + m)",
    method: "Use the prefix table to shift the pattern without rechecking confirmed characters."
  }),
  program({
    slug: "ads-rabin-karp-search",
    title: "Search with Rabin–Karp Rolling Hash",
    source: cMain(`    const char text[] = "AABAACAADAABAABA", pattern[] = "AABA";
    int n = (int) strlen(text), m = (int) strlen(pattern), base = 256, prime = 101;
    int high = 1, pattern_hash = 0, window_hash = 0;
    for (int i = 0; i < m - 1; i++) high = (high * base) % prime;
    for (int i = 0; i < m; i++) { pattern_hash = (base * pattern_hash + pattern[i]) % prime; window_hash = (base * window_hash + text[i]) % prime; }
    printf("Matches:");
    for (int start = 0; start <= n - m; start++) {
        if (pattern_hash == window_hash && strncmp(text + start, pattern, (size_t) m) == 0) printf(" %d", start);
        if (start < n - m) { window_hash = (base * (window_hash - text[start] * high) + text[start + m]) % prime; if (window_hash < 0) window_hash += prime; }
    }
    putchar('\\n'); return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Matches: 0 9 12",
    time: "Average O(n + m)",
    method: "Update a fixed-size window hash in constant time and verify only hash matches."
  }),
  program({
    slug: "ads-z-algorithm-pattern-search",
    title: "Search with the Z Algorithm",
    source: cMain(`    const char combined[] = "ABA$ABABABA";
    int length = (int) strlen(combined), z[30] = {0}, left = 0, right = 0;
    for (int index = 1; index < length; index++) {
        if (index <= right) z[index] = right - index + 1 < z[index - left] ? right - index + 1 : z[index - left];
        while (index + z[index] < length && combined[z[index]] == combined[index + z[index]]) z[index]++;
        if (index + z[index] - 1 > right) { left = index; right = index + z[index] - 1; }
    }
    printf("Matches:");
    for (int index = 4; index < length; index++) if (z[index] == 3) printf(" %d", index - 4);
    putchar('\\n'); return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Matches: 0 2 4",
    time: "O(n + m)",
    method: "Build Z values for pattern, separator and text; a full pattern-length value marks a match."
  }),
  program({
    slug: "ads-boyer-moore-bad-character",
    title: "Apply Boyer–Moore Bad-Character Search",
    source: cMain(`    const unsigned char text[] = "ABAAABCD", pattern[] = "ABC";
    int last[256], n = (int) strlen((const char *) text), m = (int) strlen((const char *) pattern);
    for (int i = 0; i < 256; i++) last[i] = -1;
    for (int i = 0; i < m; i++) last[pattern[i]] = i;
    int shift = 0;
    while (shift <= n - m) {
        int index = m - 1;
        while (index >= 0 && pattern[index] == text[shift + index]) index--;
        if (index < 0) { printf("Index = %d\\n", shift); break; }
        int jump = index - last[text[shift + index]]; shift += jump > 1 ? jump : 1;
    }
    return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Index = 4",
    time: "Average sublinear",
    space: "O(alphabet)",
    method: "Compare from the pattern end and jump past a mismatched character's last occurrence."
  }),
  program({
    slug: "ads-finite-automaton-pattern-search",
    title: "Search with a Pattern Finite Automaton",
    source: cMain(`    const char text[] = "AABAACAADAABAABA", pattern[] = "AABA";
    int m = (int) strlen(pattern), transition[5][2] = {{1,0},{2,0},{2,3},{4,0},{2,0}}, state = 0;
    printf("Matches:");
    for (int index = 0; text[index]; index++) {
        state = transition[state][text[index] == 'B'];
        if (state == m) printf(" %d", index - m + 1);
    }
    putchar('\\n'); return 0;`, ["stdio.h", "string.h"]),
    sampleOutput: "Matches: 0 9 12",
    time: "O(n) after preprocessing",
    space: "O(m * alphabet)",
    method: "Treat the matched-prefix length as an automaton state and consume each text character once."
  }),
  program({
    slug: "ads-manacher-longest-palindrome",
    title: "Find the Longest Palindrome with Manacher's Algorithm",
    source: cMain(`    const char text[] = "forgeeksskeegfor";
    char transformed[80] = "^"; int length = 1;
    for (int i = 0; text[i]; i++) { transformed[length++] = '#'; transformed[length++] = text[i]; }
    transformed[length++] = '#'; transformed[length++] = '$'; transformed[length] = '\\0';
    int radius[80] = {0}, center = 0, right = 0, best = 0, best_center = 0;
    for (int i = 1; i < length - 1; i++) {
        int mirror = 2 * center - i;
        if (i < right) radius[i] = radius[mirror] < right - i ? radius[mirror] : right - i;
        while (transformed[i + 1 + radius[i]] == transformed[i - 1 - radius[i]]) radius[i]++;
        if (i + radius[i] > right) { center = i; right = i + radius[i]; }
        if (radius[i] > best) { best = radius[i]; best_center = i; }
    }
    int start = (best_center - best) / 2;
    printf("Longest = %.*s\\n", best, text + start);
    return 0;`, ["stdio.h"]),
    sampleOutput: "Longest = geeksskeeg",
    time: "O(n)",
    space: "O(n)",
    method: "Reuse palindrome radii mirrored around the current rightmost palindrome."
  })
];
