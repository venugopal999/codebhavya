#include <stdio.h>

int main(void)
{
    int rows, columns, first[10][10], second[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &first[row][column]);
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &second[row][column]);
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) printf("%d ", first[row][column] - second[row][column]);
        printf("\n");
    }
    return 0;
}
