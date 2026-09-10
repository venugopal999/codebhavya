#include <stdio.h>

void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\n' : ' '); }
void compare(int values[], int first, int second, int ascending) { if (ascending == (values[first] > values[second])) { int t = values[first]; values[first] = values[second]; values[second] = t; } }
void merge_bitonic(int values[], int low, int count, int ascending) { if (count > 1) { int half = count / 2; for (int i = low; i < low + half; i++) compare(values, i, i + half, ascending); merge_bitonic(values, low, half, ascending); merge_bitonic(values, low + half, half, ascending); } }
void bitonic_sort(int values[], int low, int count, int ascending) { if (count > 1) { int half = count / 2; bitonic_sort(values, low, half, 1); bitonic_sort(values, low + half, half, 0); merge_bitonic(values, low, count, ascending); } }

int main(void)
{
    int values[] = {3, 7, 4, 8, 6, 2, 1, 5};
    bitonic_sort(values, 0, 8, 1);
    print_values(values, 8); return 0;
}
