#include <stdio.h>

int main(void)
{
    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    int first = values[0];
    for (int index = 0; index < size - 1; index++) values[index] = values[index + 1];
    values[size - 1] = first;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
