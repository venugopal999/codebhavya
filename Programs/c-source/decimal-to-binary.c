#include <stdio.h>

int main(void)
{
    unsigned int number, value;
    int bits[32], count = 0;

    printf("Enter a non-negative decimal integer: ");
    scanf("%u", &number);
    value = number;
    do {
        bits[count++] = (int) (value % 2);
        value /= 2;
    } while (value > 0);
    printf("Binary = ");
    for (int index = count - 1; index >= 0; index--) printf("%d", bits[index]);
    printf("\n");
    return 0;
}
