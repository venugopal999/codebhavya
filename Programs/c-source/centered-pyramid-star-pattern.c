#include <stdio.h>

int main(void)
{
    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int space = 1; space <= rows - row; space++) printf("  ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("* ");
        printf("\n");
    }
    return 0;
}
