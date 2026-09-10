#include <stdio.h>
#include <string.h>

int main(void)
{
    const char pattern[] = "ABABCABAB";
    int length = (int) strlen(pattern), prefix[20] = {0};
    for (int index = 1, border = 0; index < length;) {
        if (pattern[index] == pattern[border]) prefix[index++] = ++border;
        else if (border) border = prefix[border - 1];
        else prefix[index++] = 0;
    }
    for (int index = 0; index < length; index++) printf("%d%c", prefix[index], index == length - 1 ? '\n' : ' ');
    return 0;
}
