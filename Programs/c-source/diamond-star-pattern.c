#include <stdio.h>

int main(void)
{
    int rows;

    printf("Enter half-height: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int space = row; space < rows; space++) printf(" ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("*");
        printf("\n");
    }
    for (int row = rows - 1; row >= 1; row--) {
        for (int space = rows; space > row; space--) printf(" ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("*");
        printf("\n");
    }
    return 0;
}
