#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char character, lower;

    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    if (!isalpha((unsigned char) character)) {
        printf("The input is not an alphabet.\n");
        return 0;
    }
    lower = (char) tolower((unsigned char) character);
    if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u')
        printf("Vowel\n");
    else
        printf("Consonant\n");
    return 0;
}
