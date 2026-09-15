#include <stdio.h>

int main(void)
{
    int triplets[][3] = {{0, 2, 4}, {1, 0, 5}, {2, 1, 6}};
    for (int column = 0; column < 3; column++)
        for (int index = 0; index < 3; index++)
            if (triplets[index][1] == column) printf("%d %d %d\n", column, triplets[index][0], triplets[index][2]);
    return 0;
}
