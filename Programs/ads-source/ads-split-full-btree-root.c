#include <stdio.h>

int main(void)
{
    int full[] = {10, 20, 30}; int promoted = full[1], left = full[0], right = full[2];
    printf("Root = %d Left = %d Right = %d\n", promoted, left, right); return 0;
}
