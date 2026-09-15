#include <stdio.h>
#include <ctype.h>

int main(void)
{
    const char *sample = "C programming is powerful.\nPractice builds confidence.\n";
    FILE *file = fopen("sample.txt", "w");
    if (file == NULL) return 1;
    fputs(sample, file);
    fclose(file);

    file = fopen("sample.txt", "r");
    if (file == NULL) return 1;
    long characters = 0, words = 0, lines = 0;
    int character, insideWord = 0, last = '\0';
    while ((character = fgetc(file)) != EOF) {
        characters++;
        if (character == '\n') lines++;
        if (isspace((unsigned char) character)) insideWord = 0;
        else if (!insideWord) { words++; insideWord = 1; }
        last = character;
    }
    if (characters > 0 && last != '\n') lines++;
    fclose(file);
    printf("Characters = %ld\nWords = %ld\nLines = %ld\n", characters, words, lines);
    return 0;
}
