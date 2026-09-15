#include <stdio.h>

int main(void)
{
    int source[][3] = {{0, 2, 4}, {1, 0, 5}, {2, 1, 6}, {2, 2, 7}};
    int count[3] = {0}, position[3] = {0}, result[4][3];
    for (int index = 0; index < 4; index++) count[source[index][1]]++;
    for (int column = 1; column < 3; column++) position[column] = position[column - 1] + count[column - 1];
    for (int index = 0; index < 4; index++) {
        int slot = position[source[index][1]]++;
        result[slot][0] = source[index][1]; result[slot][1] = source[index][0]; result[slot][2] = source[index][2];
    }
    for (int index = 0; index < 4; index++) printf("%d %d %d\n", result[index][0], result[index][1], result[index][2]);
    return 0;
}
