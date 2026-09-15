#include <stdio.h>

int main(void)
{
    int values[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int current = values[0], best = values[0];
    for (int index = 1; index < 9; index++) {
        current = values[index] > current + values[index] ? values[index] : current + values[index];
        if (current > best) best = current;
    }
    printf("Maximum subarray sum = %d\n", best);
    return 0;
}
