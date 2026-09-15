#include <stdio.h>

int main(void)
{
    int arrays[3][4] = {{1, 4, 7, 10}, {2, 5, 8, 11}, {3, 6, 9, 12}};
    int position[3] = {0};
    for (int output = 0; output < 12; output++) {
        int selected = -1;
        for (int array = 0; array < 3; array++) if (position[array] < 4 && (selected < 0 || arrays[array][position[array]] < arrays[selected][position[selected]])) selected = array;
        printf("%d%c", arrays[selected][position[selected]++], output == 11 ? '\n' : ' ');
    }
    return 0;
}
