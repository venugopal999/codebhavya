#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[300];

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\0'; index++) {
        unsigned char value = (unsigned char) text[index];
        if (isupper(value)) text[index] = (char) tolower(value);
        else if (islower(value)) text[index] = (char) toupper(value);
    }
    printf("Toggled: %s", text);
    return 0;
}
