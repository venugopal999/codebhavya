#include <stdio.h>

int main(void)
{
    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 1; index < size; index++) {
        int key = values[index], position = index - 1;
        while (position >= 0 && values[position] > key) {
            values[position + 1] = values[position];
            position--;
        }
        values[position + 1] = key;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
