#include <stdio.h>

int main(void)
{
    int size, values[100], position, value;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size >= 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter position (1 to %d) and value: ", size + 1);
    scanf("%d %d", &position, &value);
    if (position < 1 || position > size + 1) return 1;
    for (int index = size; index >= position; index--) values[index] = values[index - 1];
    values[position - 1] = value;
    size++;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
