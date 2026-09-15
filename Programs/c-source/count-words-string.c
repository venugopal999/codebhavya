#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[500];
    int words = 0, insideWord = 0;

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\0'; index++) {
        if (isspace((unsigned char) text[index])) {
            insideWord = 0;
        } else if (!insideWord) {
            words++;
            insideWord = 1;
        }
    }
    printf("Word count = %d\n", words);
    return 0;
}
