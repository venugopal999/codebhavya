#include <stdio.h>
#include <string.h>

int main(void)
{
    FILE *file = fopen("lesson.txt", "w");
    if (file == NULL) return 1;
    fputs("learn C and practise C every day", file);
    fclose(file);
    file = fopen("lesson.txt", "r");
    if (file == NULL) return 1;
    char word[64];
    int count = 0;
    while (fscanf(file, "%63s", word) == 1)
        if (strcmp(word, "C") == 0) count++;
    fclose(file);
    printf("Occurrences of C = %d\n", count);
    return 0;
}
