#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    printf("Last digit = %d\n", abs(number % 10));
    return 0;
}
