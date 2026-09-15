#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[200];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    int left = 0, right = (int) strlen(text) - 1;
    while (left < right) {
        char temporary = text[left]; text[left] = text[right]; text[right] = temporary;
        left++; right--;
    }
    printf("Reversed: %s\n", text);
    return 0;
}
