#include <stdio.h>

int maximum(int first, int second)
{
    return first > second ? first : second;
}

int main(void)
{
    int first, second, third;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    printf("Maximum = %d\n", maximum(maximum(first, second), third));
    return 0;
}
