#include <stdio.h>
#include <string.h>

int main(void)
{
    char first[200], second[200];
    int index = 0;

    fgets(first, sizeof first, stdin);
    fgets(second, sizeof second, stdin);
    first[strcspn(first, "\n")] = '\0';
    second[strcspn(second, "\n")] = '\0';
    while (first[index] != '\0' && first[index] == second[index]) index++;
    if (first[index] == second[index]) printf("Strings are equal\n");
    else if ((unsigned char) first[index] < (unsigned char) second[index]) printf("First string comes before second\n");
    else printf("First string comes after second\n");
    return 0;
}
