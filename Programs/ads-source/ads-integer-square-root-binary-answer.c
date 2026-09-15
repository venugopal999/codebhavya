#include <stdio.h>

int main(void)
{
    long long number = 50, low = 0, high = number, answer = 0;
    while (low <= high) { long long middle = low + (high - low) / 2; if (middle <= number / (middle ? middle : 1)) { answer = middle; low = middle + 1; } else high = middle - 1; }
    printf("Floor square root = %lld\n", answer); return 0;
}
