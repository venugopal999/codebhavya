#include <stdio.h>

int main(void)
{
    long long first, second, a, b;

    printf("Enter two positive integers: ");
    scanf("%lld %lld", &first, &second);
    if (first == 0 || second == 0) {
        printf("LCM = 0\n");
        return 0;
    }
    a = first < 0 ? -first : first;
    b = second < 0 ? -second : second;
    while (b != 0) {
        long long remainder = a % b;
        a = b;
        b = remainder;
    }
    printf("LCM = %lld\n", (first < 0 ? -first : first) / a * (second < 0 ? -second : second));
    return 0;
}
