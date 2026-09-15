#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[300];

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\0'; index++)
        text[index] = (char) tolower((unsigned char) text[index]);
    printf("Lowercase: %s", text);
    return 0;
}
