#include <stdio.h>

int main(void)
{
    int size;

    printf("Enter size: ");
    scanf("%d", &size);
    for (int row = 1; row <= size; row++) {
        for (int column = 1; column <= size; column++) {
            if (row == 1 || row == size || column == 1 || column == size)
                printf("* ");
            else
                printf("  ");
        }
        printf("\n");
    }
    return 0;
}
