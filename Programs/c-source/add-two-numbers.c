#include <stdio.h>

int main(void)
{
    int first, second, sum;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    sum = first + second;
    printf("Sum = %d\n", sum);
    return 0;
}
