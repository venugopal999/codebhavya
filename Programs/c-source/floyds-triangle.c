#include <stdio.h>

int main(void)
{
    int rows, value = 1;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int column = 1; column <= row; column++) printf("%d ", value++);
        printf("\n");
    }
    return 0;
}
