#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t rows, columns;
    printf("Enter rows and columns: ");
    scanf("%zu %zu", &rows, &columns);
    int **matrix = malloc(rows * sizeof *matrix);
    if (matrix == NULL) return 1;
    for (size_t row = 0; row < rows; row++) {
        matrix[row] = malloc(columns * sizeof *matrix[row]);
        if (matrix[row] == NULL) {
            while (row > 0) free(matrix[--row]);
            free(matrix);
            return 1;
        }
    }
    int sum = 0;
    printf("Enter matrix elements: ");
    for (size_t row = 0; row < rows; row++)
        for (size_t column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            sum += matrix[row][column];
        }
    printf("Sum = %d\n", sum);
    for (size_t row = 0; row < rows; row++) free(matrix[row]);
    free(matrix);
    return 0;
}
