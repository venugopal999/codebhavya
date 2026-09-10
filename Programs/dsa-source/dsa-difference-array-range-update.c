#include <stdio.h>

int main(void)
{
    int values[] = {10, 10, 10, 10, 10};
    int difference[6] = {values[0], 0, 0, 0, 0, 0};
    for (int index = 1; index < 5; index++) difference[index] = values[index] - values[index - 1];
    int left = 1, right = 3, amount = 5;
    difference[left] += amount;
    difference[right + 1] -= amount;
    int current = 0;
    for (int index = 0; index < 5; index++) {
        current += difference[index];
        printf("%d ", current);
    }
    putchar('\n');
    return 0;
}
