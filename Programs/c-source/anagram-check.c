#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char first[300], second[300];
    int frequency[256] = {0};

    fgets(first, sizeof first, stdin);
    fgets(second, sizeof second, stdin);
    for (int index = 0; first[index] != '\0'; index++) {
        unsigned char value = (unsigned char) first[index];
        if (!isspace(value)) frequency[tolower(value)]++;
    }
    for (int index = 0; second[index] != '\0'; index++) {
        unsigned char value = (unsigned char) second[index];
        if (!isspace(value)) frequency[tolower(value)]--;
    }
    for (int value = 0; value < 256; value++) {
        if (frequency[value] != 0) { printf("Not anagrams\n"); return 0; }
    }
    printf("Anagrams\n");
    return 0;
}
