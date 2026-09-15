#include <stdio.h>

int main(void)
{
    long long number, value;
    int frequency[10] = {0};

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    do {
        frequency[value % 10]++;
        value /= 10;
    } while (value > 0);
    for (int digit = 0; digit <= 9; digit++) {
        if (frequency[digit] > 0)
            printf("%d occurs %d time(s)\n", digit, frequency[digit]);
    }
    return 0;
}
