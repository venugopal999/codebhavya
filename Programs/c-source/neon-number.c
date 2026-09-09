#include <stdio.h>

int main(void)
{
    int number, square, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\n");
        return 0;
    }
    square = number * number;
    do {
        sum += square % 10;
        square /= 10;
    } while (square > 0);
    printf(sum == number ? "Neon number\n" : "Not a neon number\n");
    return 0;
}
