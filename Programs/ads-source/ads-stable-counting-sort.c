#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }

int main(void)
{
    int values[] = {4, 2, 2, 8, 3, 3, 1}, count[9] = {0}, output[7];
    for (int i = 0; i < 7; i++) count[values[i]]++;
    for (int i = 1; i < 9; i++) count[i] += count[i - 1];
    for (int i = 6; i >= 0; i--) output[--count[values[i]]] = values[i];
    print_values(output, 7); return 0;
}
