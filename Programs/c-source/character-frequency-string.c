#include <stdio.h>

int main(void)
{
    char text[300], target;
    int count = 0;

    fgets(text, sizeof text, stdin);
    printf("Enter character to count: ");
    scanf("%c", &target);
    for (int index = 0; text[index] != '\0'; index++)
        if (text[index] == target) count++;
    printf("'%c' occurs %d time(s)\n", target, count);
    return 0;
}
