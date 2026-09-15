#include <stdio.h>

int main(void)
{
    FILE *file = fopen("notes.txt", "w");
    if (file == NULL) return 1;
    fputs("First line\n", file);
    fclose(file);
    file = fopen("notes.txt", "a");
    if (file == NULL) return 1;
    fputs("Appended line\n", file);
    fclose(file);
    file = fopen("notes.txt", "r");
    if (file == NULL) return 1;
    char line[80];
    while (fgets(line, sizeof line, file) != NULL) fputs(line, stdout);
    fclose(file);
    return 0;
}
