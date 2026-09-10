#include <stdio.h>

int main(void)
{
    int values[] = {3, 1, 4, 1, 5, 9};
    int prefix[7] = {0};
    for (int index = 0; index < 6; index++) prefix[index + 1] = prefix[index] + values[index];
    int left = 1, right = 4;
    printf("Range sum [%d,%d] = %d\n", left, right, prefix[right + 1] - prefix[left]);
    return 0;
}
