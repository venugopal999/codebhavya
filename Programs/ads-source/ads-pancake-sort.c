#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {23, 10, 20, 11, 12, 6, 7};
    for (int size = 7; size > 1; size--) {
        int maximum = 0;
        for (int i = 1; i < size; i++) if (values[i] > values[maximum]) maximum = i;
        if (maximum == size - 1) continue;
        for (int left = 0, right = maximum; left < right; left++, right--) { int t = values[left]; values[left] = values[right]; values[right] = t; }
        for (int left = 0, right = size - 1; left < right; left++, right--) { int t = values[left]; values[left] = values[right]; values[right] = t; }
    }
    print_values(values, 7); return 0;
}
