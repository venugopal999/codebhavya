#include <stdio.h>
#include <string.h>

int main(void)
{
    const unsigned char text[] = "ABAAABCD", pattern[] = "ABC";
    int last[256], n = (int) strlen((const char *) text), m = (int) strlen((const char *) pattern);
    for (int i = 0; i < 256; i++) last[i] = -1;
    for (int i = 0; i < m; i++) last[pattern[i]] = i;
    int shift = 0;
    while (shift <= n - m) {
        int index = m - 1;
        while (index >= 0 && pattern[index] == text[shift + index]) index--;
        if (index < 0) { printf("Index = %d\n", shift); break; }
        int jump = index - last[text[shift + index]]; shift += jump > 1 ? jump : 1;
    }
    return 0;
}
