#include <stdio.h>
#include <string.h>

int main(void)
{
    const char text[] = "AABAACAADAABAABA", pattern[] = "AABA";
    int m = (int) strlen(pattern), transition[5][2] = {{1,0},{2,0},{2,3},{4,0},{2,0}}, state = 0;
    printf("Matches:");
    for (int index = 0; text[index]; index++) {
        state = transition[state][text[index] == 'B'];
        if (state == m) printf(" %d", index - m + 1);
    }
    putchar('\n'); return 0;
}
