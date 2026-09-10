#include <stdio.h>

int main(void)
{
    int distance[4][4] = {
        {0,5,999,10}, {999,0,3,999}, {999,999,0,1}, {999,999,999,0}
    };
    for (int through = 0; through < 4; through++)
        for (int from = 0; from < 4; from++)
            for (int to = 0; to < 4; to++)
                if (distance[from][through] + distance[through][to] < distance[from][to])
                    distance[from][to] = distance[from][through] + distance[through][to];
    printf("0 to 3 = %d\n", distance[0][3]);
    printf("1 to 3 = %d\n", distance[1][3]);
    return 0;
}
