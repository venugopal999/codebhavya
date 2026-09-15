#include <stdio.h>

int main(void)
{
    int number;

    printf("Enter a positive integer: ");
    scanf("%d", &number);
    if (number <= 0) {
        printf("Use a positive integer.\n");
        return 0;
    }
    printf("Factors: ");
    for (int divisor = 1; divisor <= number; divisor++) {
        if (number % divisor == 0) printf("%d ", divisor);
    }
    printf("\n");
    return 0;
}
