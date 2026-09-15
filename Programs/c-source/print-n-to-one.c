#include <stdio.h>

int main(void)
{
    int limit;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = limit; number >= 1; number--)
        printf("%d%c", number, number == 1 ? '\n' : ' ');
    return 0;
}
