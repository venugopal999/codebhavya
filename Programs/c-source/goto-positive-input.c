#include <stdio.h>

int main(void)
{
    int number;
read_again:
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    if (number <= 0) {
        puts("Invalid input. Try again.");
        goto read_again;
    }
    printf("Accepted = %d\n", number);
    return 0;
}
