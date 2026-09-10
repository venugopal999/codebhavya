#include <stdio.h>

struct Point { int x; int y; };

struct Point create_point(int x, int y)
{
    struct Point result = {x, y};
    return result;
}

int main(void)
{
    struct Point point = create_point(4, 7);
    printf("Point = (%d, %d)\n", point.x, point.y);
    return 0;
}
