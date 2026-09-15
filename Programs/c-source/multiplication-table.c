#include <stdio.h>

int main(void)
{
    int number, limit;

    printf("Enter number and table limit: ");
    scanf("%d %d", &number, &limit);
    for (int multiplier = 1; multiplier <= limit; multiplier++)
        printf("%d x %d = %d\n", number, multiplier, number * multiplier);
    return 0;
}
