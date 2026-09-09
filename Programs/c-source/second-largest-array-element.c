#include <stdio.h>

int main(void)
{
    int size, values[100], largest = 0, second = 0;
    int hasLargest = 0, hasSecond = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 2 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        int value = values[index];
        if (!hasLargest || value > largest) {
            if (hasLargest) { second = largest; hasSecond = 1; }
            largest = value; hasLargest = 1;
        } else if (value != largest && (!hasSecond || value > second)) {
            second = value; hasSecond = 1;
        }
    }
    if (hasSecond) printf("Second largest = %d\n", second);
    else printf("No second distinct value.\n");
    return 0;
}
