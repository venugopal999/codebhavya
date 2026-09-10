#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char character;

    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    if (isupper((unsigned char) character))
        printf("Uppercase alphabet\n");
    else if (islower((unsigned char) character))
        printf("Lowercase alphabet\n");
    else
        printf("Not an alphabet\n");
    return 0;
}
