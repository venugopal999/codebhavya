#include <stdio.h>

int main(void)
{
    int first, second, third, smallest;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    smallest = first;
    if (second < smallest) smallest = second;
    if (third < smallest) smallest = third;
    printf("Smallest = %d\n", smallest);
    return 0;
}
