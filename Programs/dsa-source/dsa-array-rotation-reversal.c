#include <stdio.h>

void reverse(int values[], int left, int right)
{
    while (left < right) {
        int temporary = values[left];
        values[left++] = values[right];
        values[right--] = temporary;
    }
}

int main(void)
{
    int values[] = {1, 2, 3, 4, 5, 6, 7};
    int length = 7, positions = 2;
    reverse(values, 0, positions - 1);
    reverse(values, positions, length - 1);
    reverse(values, 0, length - 1);
    for (int index = 0; index < length; index++) printf("%d ", values[index]);
    putchar('\n');
    return 0;
}
