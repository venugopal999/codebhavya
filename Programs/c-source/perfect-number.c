#include <stdio.h>

int main(void)
{
    int number, sum = 0;

    printf("Enter a positive integer: ");
    scanf("%d", &number);
    for (int divisor = 1; divisor <= number / 2; divisor++) {
        if (number % divisor == 0) sum += divisor;
    }
    printf(number > 0 && sum == number ? "Perfect number\n" : "Not a perfect number\n");
    return 0;
}
