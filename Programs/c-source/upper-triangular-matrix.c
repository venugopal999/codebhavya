#include <stdio.h>

int main(void)
{
    int size, matrix[10][10];

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size; row++) {
        for (int column = 0; column < size; column++)
            printf("%d ", column >= row ? matrix[row][column] : 0);
        printf("\n");
    }
    return 0;
}
