#include <stdio.h>

int main(void)
{
    int size, values[100], positive = 0, negative = 0, zero = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        if (values[index] > 0) positive++;
        else if (values[index] < 0) negative++;
        else zero++;
    }
    printf("Positive = %d\nNegative = %d\nZero = %d\n", positive, negative, zero);
    return 0;
}
