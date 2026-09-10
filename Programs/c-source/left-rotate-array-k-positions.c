#include <stdio.h>

int main(void)
{
    int size, values[100], rotated[100], positions;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter left-rotation count: ");
    scanf("%d", &positions);
    positions = ((positions % size) + size) % size;
    for (int index = 0; index < size; index++) rotated[index] = values[(index + positions) % size];
    for (int index = 0; index < size; index++) printf("%d%c", rotated[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
