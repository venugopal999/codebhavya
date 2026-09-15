#include <stdio.h>
#include <string.h>

int main(void)
{
    const char text[] = "AABAACAADAABAABA", pattern[] = "AABA";
    int n = (int) strlen(text), m = (int) strlen(pattern), base = 256, prime = 101;
    int high = 1, pattern_hash = 0, window_hash = 0;
    for (int i = 0; i < m - 1; i++) high = (high * base) % prime;
    for (int i = 0; i < m; i++) { pattern_hash = (base * pattern_hash + pattern[i]) % prime; window_hash = (base * window_hash + text[i]) % prime; }
    printf("Matches:");
    for (int start = 0; start <= n - m; start++) {
        if (pattern_hash == window_hash && strncmp(text + start, pattern, (size_t) m) == 0) printf(" %d", start);
        if (start < n - m) { window_hash = (base * (window_hash - text[start] * high) + text[start + m]) % prime; if (window_hash < 0) window_hash += prime; }
    }
    putchar('\n'); return 0;
}
