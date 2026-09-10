#include <stdio.h>

int main(void)
{
    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        for (int next = index + 1; next < size;) {
            if (values[next] == values[index]) {
                for (int shift = next; shift < size - 1; shift++) values[shift] = values[shift + 1];
                size--;
            } else {
                next++;
            }
        }
    }
    printf("Unique array: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
