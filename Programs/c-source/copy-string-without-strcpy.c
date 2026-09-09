#include <stdio.h>

int main(void)
{
    char source[200], destination[200];
    int index = 0;

    printf("Enter text: ");
    fgets(source, sizeof source, stdin);
    while (source[index] != '\0') {
        destination[index] = source[index];
        index++;
    }
    destination[index] = '\0';
    printf("Copied text: %s", destination);
    return 0;
}
