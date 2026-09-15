#include <stdio.h>

int main(void)
{
    int values[] = {2, 0, 2, 1, 1, 0};
    int low = 0, middle = 0, high = 5;
    while (middle <= high) {
        if (values[middle] == 0) {
            int temporary = values[low]; values[low++] = values[middle]; values[middle++] = temporary;
        } else if (values[middle] == 1) middle++;
        else {
            int temporary = values[middle]; values[middle] = values[high]; values[high--] = temporary;
        }
    }
    for (int index = 0; index < 6; index++) printf("%d ", values[index]);
    putchar('\n');
    return 0;
}
