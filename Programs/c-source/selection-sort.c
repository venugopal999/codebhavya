#include <stdio.h>

int main(void)
{
    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int start = 0; start < size - 1; start++) {
        int minimum = start;
        for (int index = start + 1; index < size; index++)
            if (values[index] < values[minimum]) minimum = index;
        int temporary = values[start]; values[start] = values[minimum]; values[minimum] = temporary;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
