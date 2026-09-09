#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[300];
    int vowels = 0, consonants = 0, digits = 0, spaces = 0;

    fgets(text, sizeof text, stdin);
    for (int index = 0; text[index] != '\0'; index++) {
        unsigned char value = (unsigned char) text[index];
        if (isdigit(value)) digits++;
        else if (isspace(value)) { if (value != '\n') spaces++; }
        else if (isalpha(value)) {
            char lower = (char) tolower(value);
            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') vowels++;
            else consonants++;
        }
    }
    printf("Vowels = %d\nConsonants = %d\nDigits = %d\nSpaces = %d\n", vowels, consonants, digits, spaces);
    return 0;
}
