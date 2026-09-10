#include <stdio.h>

#define SQUARE(value) ((value) * (value))

int main(void)
{
    int number;
    printf("Enter an integer: ");
    scanf("%d", &number);
    printf("Square = %d\n", SQUARE(number));
    return 0;
}
