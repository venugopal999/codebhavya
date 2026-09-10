#include <stdio.h>

int main(void)
{
    int table[11];
    for (int index = 0; index < 11; index++) table[index] = -1;
    int keys[] = {22, 1, 13, 11, 24, 33};
    for (int index = 0; index < 6; index++) {
        int position = keys[index] % 11;
        while (table[position] != -1) position = (position + 1) % 11;
        table[position] = keys[index];
    }
    for (int index = 0; index < 11; index++) if (table[index] != -1) printf("%d:%d ", index, table[index]);
    putchar('\n');
    return 0;
}
