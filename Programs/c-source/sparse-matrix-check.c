#include <stdio.h>

int main(void)
{
    int rows, columns, matrix[10][10], zeroCount = 0;

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            if (matrix[row][column] == 0) zeroCount++;
        }
    printf(zeroCount > rows * columns / 2 ? "Sparse matrix\n" : "Not a sparse matrix\n");
    return 0;
}
