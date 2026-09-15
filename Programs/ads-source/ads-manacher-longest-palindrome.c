#include <stdio.h>

int main(void)
{
    const char text[] = "forgeeksskeegfor";
    char transformed[80] = "^"; int length = 1;
    for (int i = 0; text[i]; i++) { transformed[length++] = '#'; transformed[length++] = text[i]; }
    transformed[length++] = '#'; transformed[length++] = '$'; transformed[length] = '\0';
    int radius[80] = {0}, center = 0, right = 0, best = 0, best_center = 0;
    for (int i = 1; i < length - 1; i++) {
        int mirror = 2 * center - i;
        if (i < right) radius[i] = radius[mirror] < right - i ? radius[mirror] : right - i;
        while (transformed[i + 1 + radius[i]] == transformed[i - 1 - radius[i]]) radius[i]++;
        if (i + radius[i] > right) { center = i; right = i + radius[i]; }
        if (radius[i] > best) { best = radius[i]; best_center = i; }
    }
    int start = (best_center - best) / 2;
    printf("Longest = %.*s\n", best, text + start);
    return 0;
}
