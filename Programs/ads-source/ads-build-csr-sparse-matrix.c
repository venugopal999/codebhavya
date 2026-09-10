#include <stdio.h>

int main(void)
{
    int matrix[3][4] = {{0, 5, 0, 0}, {2, 0, 0, 7}, {0, 0, 3, 0}};
    int values[12], columns[12], row_start[4], count = 0;
    for (int row = 0; row < 3; row++) {
        row_start[row] = count;
        for (int column = 0; column < 4; column++) if (matrix[row][column]) { values[count] = matrix[row][column]; columns[count++] = column; }
    }
    row_start[3] = count;
    printf("Values:"); for (int i = 0; i < count; i++) printf(" %d", values[i]);
    printf("\nColumns:"); for (int i = 0; i < count; i++) printf(" %d", columns[i]);
    printf("\nRowStart:"); for (int i = 0; i < 4; i++) printf(" %d", row_start[i]);
    putchar('\n'); return 0;
}
