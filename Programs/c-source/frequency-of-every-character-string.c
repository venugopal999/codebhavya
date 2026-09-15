#include <stdio.h>

int main(void)
{
    char text[300];
    int frequency[256] = {0};

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\0' && text[index] != '\n'; index++)
        frequency[(unsigned char) text[index]]++;
    for (int value = 0; value < 256; value++)
        if (frequency[value] > 0) printf("%c : %d\n", value, frequency[value]);
    return 0;
}
