#include <stdio.h>

int main(void)
{
    int capacity = 1, size = 0, copies = 0;
    for (int value = 0; value < 16; value++) {
        if (size == capacity) { copies += size; capacity *= 2; }
        size++;
    }
    printf("Writes = %d Copies = %d Total = %d\n", size, copies, size + copies);
    return 0;
}
