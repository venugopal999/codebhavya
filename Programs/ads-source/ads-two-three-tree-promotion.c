#include <stdio.h>

int main(void)
{
    int keys[] = {30, 10, 20};
    for (int i = 1; i < 3; i++) { int value = keys[i], j = i - 1; while (j >= 0 && keys[j] > value) { keys[j + 1] = keys[j]; j--; } keys[j + 1] = value; }
    printf("Promote = %d Left = %d Right = %d\n", keys[1], keys[0], keys[2]); return 0;
}
