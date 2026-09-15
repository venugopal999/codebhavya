#include <stdio.h>
#include <string.h>

int main(void)
{
    char first[400], second[200];
    int firstLength = 0, secondIndex = 0;

    printf("Enter first text: ");
    fgets(first, 200, stdin);
    first[strcspn(first, "\n")] = '\0';
    printf("Enter second text: ");
    fgets(second, sizeof second, stdin);
    while (first[firstLength] != '\0') firstLength++;
    while (second[secondIndex] != '\0') first[firstLength++] = second[secondIndex++];
    first[firstLength] = '\0';
    printf("Combined: %s", first);
    return 0;
}
