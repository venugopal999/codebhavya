#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[300], pattern[100];
    int position = -1;

    fgets(text, sizeof text, stdin);
    fgets(pattern, sizeof pattern, stdin);
    text[strcspn(text, "\n")] = '\0';
    pattern[strcspn(pattern, "\n")] = '\0';
    for (int start = 0; text[start] != '\0'; start++) {
        int offset = 0;
        while (pattern[offset] != '\0' && text[start + offset] == pattern[offset]) offset++;
        if (pattern[offset] == '\0') { position = start; break; }
    }
    if (position >= 0) printf("Found at position %d\n", position + 1);
    else printf("Substring not found\n");
    return 0;
}
