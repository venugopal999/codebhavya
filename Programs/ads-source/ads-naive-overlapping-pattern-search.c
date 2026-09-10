#include <stdio.h>
#include <string.h>

int main(void)
{
    const char text[] = "ABABABA", pattern[] = "ABA";
    int text_length = (int) strlen(text), pattern_length = (int) strlen(pattern);
    printf("Matches:");
    for (int start = 0; start <= text_length - pattern_length; start++) {
        int offset = 0;
        while (offset < pattern_length && text[start + offset] == pattern[offset]) offset++;
        if (offset == pattern_length) printf(" %d", start);
    }
    putchar('\n'); return 0;
}
