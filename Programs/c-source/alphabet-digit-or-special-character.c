#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char character;

    printf("Enter a character: ");
    scanf(" %c", &character);
    if (isalpha((unsigned char) character))
        printf("Alphabet\n");
    else if (isdigit((unsigned char) character))
        printf("Digit\n");
    else
        printf("Special character\n");
    return 0;
}
