#include <stdio.h>
#include <string.h>

void reverse(char text[], int left, int right)
{
    if (left >= right) return;
    char temporary = text[left]; text[left] = text[right]; text[right] = temporary;
    reverse(text, left + 1, right - 1);
}

int main(void)
{
    char text[200];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    reverse(text, 0, (int) strlen(text) - 1);
    printf("Reversed: %s\n", text);
    return 0;
}
