#include <stdio.h>

int main(void)
{
    int size, matrix[10][10], symmetric = 1;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size && symmetric; row++)
        for (int column = row + 1; column < size; column++)
            if (matrix[row][column] != matrix[column][row]) { symmetric = 0; break; }
    printf(symmetric ? "Symmetric matrix\n" : "Not a symmetric matrix\n");
    return 0;
}
