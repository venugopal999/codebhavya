#include <stdio.h>

int main(void)
{
    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 0; row < rows; row++) {
        unsigned long long value = 1;
        for (int space = 0; space < rows - row - 1; space++) printf(" ");
        for (int column = 0; column <= row; column++) {
            printf("%llu ", value);
            value = value * (unsigned long long) (row - column) / (unsigned long long) (column + 1);
        }
        printf("\n");
    }
    return 0;
}
