#include <stdio.h>

int main(void)
{
    int limit;
    printf("Enter limit: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++) {
        if (number % 3 == 0) continue;
        printf("%d ", number);
    }
    putchar('\n');
    return 0;
}
