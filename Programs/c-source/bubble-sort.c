#include <stdio.h>

int main(void)
{
    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int pass = 0; pass < size - 1; pass++) {
        int swapped = 0;
        for (int index = 0; index < size - pass - 1; index++) {
            if (values[index] > values[index + 1]) {
                int temporary = values[index]; values[index] = values[index + 1]; values[index + 1] = temporary;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
