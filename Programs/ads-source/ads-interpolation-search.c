#include <stdio.h>

int main(void)
{
    int values[] = {10, 20, 30, 40, 50, 60, 70}, target = 50, low = 0, high = 6;
    while (low <= high && target >= values[low] && target <= values[high]) {
        int position = low + (int) (((double) (high - low) * (target - values[low])) / (values[high] - values[low]));
        if (values[position] == target) { printf("Index = %d\n", position); break; }
        if (values[position] < target) low = position + 1; else high = position - 1;
    }
    return 0;
}
