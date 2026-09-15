#include <stdio.h>

int main(void)
{
    int number;
    printf("Enter starting number: ");
    scanf("%d", &number);
    while (number >= 1) {
        printf("%d ", number);
        number--;
    }
    puts("Go!");
    return 0;
}
