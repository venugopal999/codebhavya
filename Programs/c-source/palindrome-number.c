#include <stdio.h>

int main(void)
{
    long long number, value, reversed = 0;

    printf("Enter a non-negative integer: ");
    scanf("%lld", &number);
    if (number < 0) {
        printf("Negative numbers are not considered palindromes here.\n");
        return 0;
    }
    value = number;
    do {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    } while (value > 0);
    printf(number == reversed ? "Palindrome\n" : "Not a palindrome\n");
    return 0;
}
