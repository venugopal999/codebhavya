#include <stdio.h>

int main(void)
{
    int reach[4][4] = {
        {1,1,0,0}, {0,1,1,0}, {0,0,1,1}, {0,0,0,1}
    };
    for (int through = 0; through < 4; through++)
        for (int from = 0; from < 4; from++)
            for (int to = 0; to < 4; to++)
                reach[from][to] = reach[from][to] || (reach[from][through] && reach[through][to]);
    for (int row = 0; row < 4; row++) {
        for (int column = 0; column < 4; column++) printf("%d ", reach[row][column]);
        putchar('\n');
    }
    return 0;
}
