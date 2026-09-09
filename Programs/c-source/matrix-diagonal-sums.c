#include <stdio.h>

int main(void)
{
    int size, matrix[10][10], primary = 0, secondary = 0;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int index = 0; index < size; index++) {
        primary += matrix[index][index];
        secondary += matrix[index][size - index - 1];
    }
    printf("Primary diagonal sum = %d\nSecondary diagonal sum = %d\n", primary, secondary);
    return 0;
}
