#include <stdio.h>
#include <string.h>

int main(void)
{
    const char combined[] = "ABA$ABABABA";
    int length = (int) strlen(combined), z[30] = {0}, left = 0, right = 0;
    for (int index = 1; index < length; index++) {
        if (index <= right) z[index] = right - index + 1 < z[index - left] ? right - index + 1 : z[index - left];
        while (index + z[index] < length && combined[z[index]] == combined[index + z[index]]) z[index]++;
        if (index + z[index] - 1 > right) { left = index; right = index + z[index] - 1; }
    }
    printf("Matches:");
    for (int index = 4; index < length; index++) if (z[index] == 3) printf(" %d", index - 4);
    putchar('\n'); return 0;
}
