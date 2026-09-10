#include <stdio.h>

int main(void)
{
    int size, values[100], minimum, maximum;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    minimum = maximum = values[0];
    for (int index = 1; index < size; index++) {
        if (values[index] < minimum) minimum = values[index];
        if (values[index] > maximum) maximum = values[index];
    }
    printf("Minimum = %d\nMaximum = %d\n", minimum, maximum);
    return 0;
}
