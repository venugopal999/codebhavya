#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[100];
    printf("Enter text: ");
    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\n")] = '\0';
    char *left = text;
    char *right = text + strlen(text);
    if (right != left) right--;
    while (left < right) {
        char temporary = *left;
        *left++ = *right;
        *right-- = temporary;
    }
    printf("Reversed = %s\n", text);
    return 0;
}
