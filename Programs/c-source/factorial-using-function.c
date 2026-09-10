#include <stdio.h>

unsigned long long factorial(int number)
{
    unsigned long long result = 1;
    for (int value = 2; value <= number; value++) result *= (unsigned long long) value;
    return result;
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
