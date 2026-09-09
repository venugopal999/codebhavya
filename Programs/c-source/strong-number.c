#include <stdio.h>

int main(void)
{
    int number, value, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\n");
        return 0;
    }
    value = number;
    do {
        int digit = value % 10;
        int factorial = 1;
        for (int item = 2; item <= digit; item++) factorial *= item;
        sum += factorial;
        value /= 10;
    } while (value > 0);
    printf(sum == number ? "Strong number\n" : "Not a strong number\n");
    return 0;
}
