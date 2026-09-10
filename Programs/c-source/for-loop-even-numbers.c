#include <stdio.h>

int main(void)
{
    int limit;
    printf("Enter limit: ");
    scanf("%d", &limit);
    for (int number = 2; number <= limit; number += 2) printf("%d ", number);
    putchar('\n');
    return 0;
}
