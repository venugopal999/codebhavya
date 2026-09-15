#include <stdio.h>

int main(void)
{
    int values[] = {2, 1, 5, 1, 3, 2};
    int window_size = 3, window_sum = 0;
    for (int index = 0; index < window_size; index++) window_sum += values[index];
    int best = window_sum;
    for (int index = window_size; index < 6; index++) {
        window_sum += values[index] - values[index - window_size];
        if (window_sum > best) best = window_sum;
    }
    printf("Maximum window sum = %d\n", best);
    return 0;
}
