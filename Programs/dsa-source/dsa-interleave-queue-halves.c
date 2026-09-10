#include <stdio.h>

int main(void)
{
    int queue[] = {1, 2, 3, 4, 5, 6};
    int first_half[] = {1, 2, 3};
    for (int index = 0; index < 3; index++) {
        printf("%d %d ", first_half[index], queue[index + 3]);
    }
    putchar('\n');
    return 0;
}
