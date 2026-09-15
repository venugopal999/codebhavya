#include <stdio.h>

int main(void)
{
    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = rows; row >= 1; row--) {
        for (int column = 1; column <= row; column++) printf("* ");
        printf("\n");
    }
    return 0;
}
