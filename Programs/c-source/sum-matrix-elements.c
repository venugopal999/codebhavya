#include <stdio.h>

int main(void)
{
    int rows, columns, matrix[10][10];
    long long sum = 0;

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            sum += matrix[row][column];
        }
    printf("Sum = %lld\n", sum);
    return 0;
}
