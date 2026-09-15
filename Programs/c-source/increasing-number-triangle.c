#include <stdio.h>

int main(void)
{
    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int value = 1; value <= row; value++) printf("%d ", value);
        printf("\n");
    }
    return 0;
}
