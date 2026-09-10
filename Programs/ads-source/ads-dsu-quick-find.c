#include <stdio.h>

int main(void)
{
    int id[] = {0, 1, 2, 3, 4};
    int pairs[][2] = {{0, 1}, {1, 2}};
    for (int edge = 0; edge < 2; edge++) {
        int from = id[pairs[edge][1]], to = id[pairs[edge][0]];
        for (int index = 0; index < 5; index++) if (id[index] == from) id[index] = to;
    }
    for (int index = 0; index < 5; index++) printf("%d%c", id[index], index == 4 ? '\n' : ' ');
    return 0;
}
