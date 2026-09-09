#include <stdio.h>

int main(void)
{
    int first, second, third, largest;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    largest = first;
    if (second > largest) largest = second;
    if (third > largest) largest = third;
    printf("Largest = %d\n", largest);
    return 0;
}
