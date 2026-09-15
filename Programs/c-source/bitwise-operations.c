#include <stdio.h>

int main(void)
{
    unsigned int first, second;

    printf("Enter two non-negative integers: ");
    scanf("%u %u", &first, &second);
    printf("AND = %u\n", first & second);
    printf("OR = %u\n", first | second);
    printf("XOR = %u\n", first ^ second);
    printf("First shifted left = %u\n", first << 1);
    printf("First shifted right = %u\n", first >> 1);
    return 0;
}
