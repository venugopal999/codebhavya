#include <stdio.h>

int main(void)
{
    char binary[65];
    unsigned long long decimal = 0;

    printf("Enter a binary number up to 64 bits: ");
    scanf("%64s", binary);
    for (int index = 0; binary[index] != '\0'; index++) {
        if (binary[index] != '0' && binary[index] != '1') {
            printf("Invalid binary number.\n");
            return 0;
        }
        decimal = decimal * 2 + (unsigned long long) (binary[index] - '0');
    }
    printf("Decimal = %llu\n", decimal);
    return 0;
}
