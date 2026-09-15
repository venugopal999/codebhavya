#include <stdio.h>

int main(void)
{
    int rows, columns;
    printf("Enter rows and columns: ");
    scanf("%d %d", &rows, &columns);
    for (int row = 1; row <= rows; row++) {
        for (int column = 1; column <= columns; column++)
            printf("(%d,%d) ", row, column);
        putchar('\n');
    }
    return 0;
}
