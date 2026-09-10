#include <stdio.h>

int main(void)
{
    int matrix[3][4] = {{0, 5, 0, 0}, {2, 0, 0, 7}, {0, 0, 3, 0}};
    for (int row = 0; row < 3; row++)
        for (int column = 0; column < 4; column++)
            if (matrix[row][column] != 0) printf("%d %d %d\n", row, column, matrix[row][column]);
    return 0;
}
