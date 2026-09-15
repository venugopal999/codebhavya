#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {12, 34, 54, 2, 3};
    for (int gap = 5 / 2; gap > 0; gap /= 2)
        for (int i = gap; i < 5; i++) {
            int value = values[i], j = i;
            while (j >= gap && values[j - gap] > value) { values[j] = values[j - gap]; j -= gap; }
            values[j] = value;
        }
    print_values(values, 5); return 0;
}
