#include <stdio.h>
#include <string.h>

int main(void)
{
    const char text[] = "ABABDABACDABABCABAB", pattern[] = "ABABCABAB";
    int n = (int) strlen(text), m = (int) strlen(pattern), prefix[20] = {0};
    for (int i = 1, border = 0; i < m;) {
        if (pattern[i] == pattern[border]) prefix[i++] = ++border;
        else if (border) border = prefix[border - 1]; else prefix[i++] = 0;
    }
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == m) { printf("Index = %d\n", i - j); break; }
        if (i < n && text[i] != pattern[j]) { if (j) j = prefix[j - 1]; else i++; }
    }
    return 0;
}
