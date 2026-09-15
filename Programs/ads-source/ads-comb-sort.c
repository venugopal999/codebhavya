#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {8, 4, 1, 56, 3, -44, 23, -6}, gap = 8, swapped = 1;
    while (gap > 1 || swapped) {
        gap = gap * 10 / 13; if (gap < 1) gap = 1; swapped = 0;
        for (int i = 0; i + gap < 8; i++) if (values[i] > values[i + gap]) { int t = values[i]; values[i] = values[i + gap]; values[i + gap] = t; swapped = 1; }
    }
    print_values(values, 8); return 0;
}
