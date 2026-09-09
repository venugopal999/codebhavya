#include <stdio.h>

int main(void)
{
    int number;
    unsigned long long factorial = 1;

    printf("Enter a non-negative integer up to 20: ");
    scanf("%d", &number);
    if (number < 0 || number > 20) {
        printf("Input must be between 0 and 20.\n");
        return 0;
    }
    for (int value = 2; value <= number; value++)
        factorial *= (unsigned long long) value;
    printf("%d! = %llu\n", number, factorial);
    return 0;
}
