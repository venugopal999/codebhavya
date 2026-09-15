#include <stdio.h>

int main(void)
{
    int values[] = {1, 2, 4, 6, 10, 14};
    int target = 16, left = 0, right = 5;
    while (left < right) {
        int sum = values[left] + values[right];
        if (sum == target) {
            printf("Pair = %d, %d\n", values[left], values[right]);
            return 0;
        }
        if (sum < target) left++;
        else right--;
    }
    puts("No pair found.");
    return 0;
}
