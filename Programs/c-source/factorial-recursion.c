#include <stdio.h>

unsigned long long factorial(int number)
{
    if (number <= 1) return 1;
    return (unsigned long long) number * factorial(number - 1);
}

int main(void)
{
    int number;

    printf("Enter a non-negative integer up to 20: ");
    scanf("%d", &number);
    if (number < 0 || number > 20) return 1;
    printf("%d! = %llu\n", number, factorial(number));
    return 0;
}
