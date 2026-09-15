#include <stdio.h>

void swap(int *first, int *second)
{
    int temporary = *first;
    *first = *second;
    *second = temporary;
}

int main(void)
{
    int first, second;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    swap(&first, &second);
    printf("After swapping: %d %d\n", first, second);
    return 0;
}
