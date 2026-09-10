#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[300];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    int length = (int) strlen(text);
    for (int start = 0; start < length - 1; start++) {
        for (int index = start + 1; index < length; index++) {
            if ((unsigned char) text[start] > (unsigned char) text[index]) {
                char temporary = text[start]; text[start] = text[index]; text[index] = temporary;
            }
        }
    }
    printf("Sorted: %s\n", text);
    return 0;
}
