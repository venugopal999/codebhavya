#include <stdio.h>

int main(void)
{
    int first, second, temporary;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    temporary = first;
    first = second;
    second = temporary;
    printf("After swapping: %d %d\n", first, second);
    return 0;
}
