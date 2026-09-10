#include <stdio.h>

int main(void)
{
    int size, source[100], destination[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &source[index]);
    for (int index = 0; index < size; index++) destination[index] = source[index];
    printf("Copied array: ");
    for (int index = 0; index < size; index++) printf("%d%c", destination[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
