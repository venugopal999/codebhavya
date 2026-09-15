#include <stdio.h>

int main(void)
{
    int size, matrix[10][10], identity = 1;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size && identity; row++) {
        for (int column = 0; column < size; column++) {
            int expected = row == column ? 1 : 0;
            if (matrix[row][column] != expected) { identity = 0; break; }
        }
    }
    printf(identity ? "Identity matrix\n" : "Not an identity matrix\n");
    return 0;
}
