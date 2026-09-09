#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[300];
    int write = 0;

    fgets(text, sizeof text, stdin);
    for (int read = 0; text[read] != '\0'; read++) {
        if (!isspace((unsigned char) text[read])) text[write++] = text[read];
    }
    text[write] = '\0';
    printf("Without spaces: %s\n", text);
    return 0;
}
