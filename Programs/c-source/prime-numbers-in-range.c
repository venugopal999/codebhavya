#include <stdio.h>

int main(void)
{
    int start, end;

    printf("Enter start and end: ");
    scanf("%d %d", &start, &end);
    if (start > end) {
        int temporary = start; start = end; end = temporary;
    }
    for (int number = start < 2 ? 2 : start; number <= end; number++) {
        int isPrime = 1;
        for (int divisor = 2; divisor <= number / divisor; divisor++) {
            if (number % divisor == 0) { isPrime = 0; break; }
        }
        if (isPrime) printf("%d ", number);
    }
    printf("\n");
    return 0;
}
