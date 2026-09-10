#include <stdio.h>

int main(void)
{
    int matrix[4][4] = {{0}};
    int edges[][2] = {{0, 1}, {0, 2}, {1, 3}, {2, 3}};
    for (int index = 0; index < 4; index++) {
        int first = edges[index][0], second = edges[index][1];
        matrix[first][second] = matrix[second][first] = 1;
    }
    for (int row = 0; row < 4; row++) {
        for (int column = 0; column < 4; column++) printf("%d ", matrix[row][column]);
        putchar('\n');
    }
    return 0;
}
