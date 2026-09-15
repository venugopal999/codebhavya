#include <stdio.h>

int main(void)
{
    int size, values[100], target, position = -1;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    for (int index = 0; index < size; index++) {
        if (values[index] == target) { position = index; break; }
    }
    if (position >= 0) printf("Found at position %d\n", position + 1);
    else printf("Not found\n");
    return 0;
}
