#include <stdio.h>

int main(void)
{
    int size, values[100], position;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter position to delete (1 to %d): ", size);
    scanf("%d", &position);
    if (position < 1 || position > size) return 1;
    for (int index = position - 1; index < size - 1; index++) values[index] = values[index + 1];
    size--;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
