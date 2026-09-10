#include <stdio.h>

int main(void)
{
    int number, reversed;

    printf("Enter a three-digit positive integer: ");
    scanf("%d", &number);
    reversed = (number % 10) * 100 + ((number / 10) % 10) * 10 + number / 100;
    printf("Reversed number = %d\n", reversed);
    return 0;
}
