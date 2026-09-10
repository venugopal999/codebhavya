#include <stdio.h>

int main(void)
{
    int limit;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++)
        printf("%d%c", number, number == limit ? '\n' : ' ');
    return 0;
}
