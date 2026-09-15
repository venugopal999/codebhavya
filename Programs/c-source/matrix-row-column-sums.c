#include <stdio.h>

int main(void)
{
    int rows, columns, matrix[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < rows; row++) {
        int sum = 0;
        for (int column = 0; column < columns; column++) sum += matrix[row][column];
        printf("Row %d sum = %d\n", row + 1, sum);
    }
    for (int column = 0; column < columns; column++) {
        int sum = 0;
        for (int row = 0; row < rows; row++) sum += matrix[row][column];
        printf("Column %d sum = %d\n", column + 1, sum);
    }
    return 0;
}
