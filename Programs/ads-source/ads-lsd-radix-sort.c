#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {170, 45, 75, 90, 802, 24, 2, 66};
    for (int exponent = 1; 802 / exponent > 0; exponent *= 10) {
        int count[10] = {0}, output[8];
        for (int i = 0; i < 8; i++) count[(values[i] / exponent) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = 7; i >= 0; i--) output[--count[(values[i] / exponent) % 10]] = values[i];
        for (int i = 0; i < 8; i++) values[i] = output[i];
    }
    print_values(values, 8); return 0;
}
