#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char character;
    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    switch (tolower((unsigned char) character)) {
        case 'a': case 'e': case 'i': case 'o': case 'u':
            puts("The character is a vowel.");
            break;
        default:
            puts("The character is not a vowel.");
    }
    return 0;
}
