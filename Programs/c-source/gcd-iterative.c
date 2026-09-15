#include <stdio.h>

int main(void)
{
    int first, second;

    printf("Enter two positive integers: ");
    scanf("%d %d", &first, &second);
    if (first < 0) first = -first;
    if (second < 0) second = -second;
    while (second != 0) {
        int remainder = first % second;
        first = second;
        second = remainder;
    }
    printf("GCD = %d\n", first);
    return 0;
}
