#include <stdio.h>

int main(void)
{
    int firstRows, firstColumns, secondRows, secondColumns;
    int first[10][10], second[10][10], product[10][10] = {0};

    scanf("%d %d", &firstRows, &firstColumns);
    scanf("%d %d", &secondRows, &secondColumns);
    if (firstRows < 1 || firstRows > 10 || firstColumns < 1 || firstColumns > 10 ||
        secondRows < 1 || secondRows > 10 || secondColumns < 1 || secondColumns > 10 ||
        firstColumns != secondRows) {
        printf("Matrices cannot be multiplied.\n");
        return 0;
    }
    for (int row = 0; row < firstRows; row++)
        for (int column = 0; column < firstColumns; column++) scanf("%d", &first[row][column]);
    for (int row = 0; row < secondRows; row++)
        for (int column = 0; column < secondColumns; column++) scanf("%d", &second[row][column]);
    for (int row = 0; row < firstRows; row++)
        for (int column = 0; column < secondColumns; column++)
            for (int index = 0; index < firstColumns; index++)
                product[row][column] += first[row][index] * second[index][column];
    for (int row = 0; row < firstRows; row++) {
        for (int column = 0; column < secondColumns; column++) printf("%d ", product[row][column]);
        printf("\n");
    }
    return 0;
}
