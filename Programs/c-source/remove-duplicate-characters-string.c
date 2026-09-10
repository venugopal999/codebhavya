#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[300];
    int seen[256] = {0}, write = 0;

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    for (int read = 0; text[read] != '\0'; read++) {
        unsigned char value = (unsigned char) text[read];
        if (!seen[value]) {
            seen[value] = 1;
            text[write++] = text[read];
        }
    }
    text[write] = '\0';
    printf("Unique characters: %s\n", text);
    return 0;
}
