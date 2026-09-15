#include <stdio.h>

int main(void)
{
    int values[] = {3, 0, 1};
    int missing = 3;
    for (int index = 0; index < 3; index++) missing ^= index ^ values[index];
    printf("Missing number = %d\n", missing);
    return 0;
}
