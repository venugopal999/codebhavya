#include <stdio.h>

struct Interval { int start; int end; };

int main(void)
{
    struct Interval intervals[] = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    int count = 4, write = 0;
    for (int index = 1; index < count; index++) {
        if (intervals[index].start <= intervals[write].end) {
            if (intervals[index].end > intervals[write].end) intervals[write].end = intervals[index].end;
        } else intervals[++write] = intervals[index];
    }
    for (int index = 0; index <= write; index++)
        printf("[%d,%d] ", intervals[index].start, intervals[index].end);
    putchar('\n');
    return 0;
}
