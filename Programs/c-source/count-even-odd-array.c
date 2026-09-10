#include <stdio.h>

int main(void)
{
    int size, values[100], even = 0, odd = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        if (values[index] % 2 == 0) even++; else odd++;
    }
    printf("Even = %d\nOdd = %d\n", even, odd);
    return 0;
}
