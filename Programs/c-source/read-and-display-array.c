#include <stdio.h>

int main(void)
{
    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    printf("Enter %d integers: ", size);
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Array: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
