#include <stdio.h>

int main(void)
{
    FILE *first = fopen("first.txt", "w");
    FILE *second = fopen("second.txt", "w");
    if (first == NULL || second == NULL) return 1;
    fputs("Alpha\n", first); fputs("Beta\n", second);
    fclose(first); fclose(second);
    first = fopen("first.txt", "r"); second = fopen("second.txt", "r");
    FILE *merged = fopen("merged.txt", "w");
    if (first == NULL || second == NULL || merged == NULL) return 1;
    int character;
    while ((character = fgetc(first)) != EOF) fputc(character, merged);
    while ((character = fgetc(second)) != EOF) fputc(character, merged);
    fclose(first); fclose(second); fclose(merged);
    merged = fopen("merged.txt", "r");
    if (merged == NULL) return 1;
    while ((character = fgetc(merged)) != EOF) putchar(character);
    fclose(merged);
    return 0;
}
