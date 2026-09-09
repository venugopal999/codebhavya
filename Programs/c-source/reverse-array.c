#include <stdio.h>

int main(void)
{
    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int left = 0, right = size - 1; left < right; left++, right--) {
        int temporary = values[left];
        values[left] = values[right];
        values[right] = temporary;
    }
    printf("Reversed: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\n' : ' ');
    return 0;
}
