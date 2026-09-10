#include <stdio.h>

int main(void)
{
    FILE *file = fopen("letters.txt", "wb");
    if (file == NULL) return 1;
    fputs("ABCDE", file);
    fclose(file);
    file = fopen("letters.txt", "rb");
    if (file == NULL) return 1;
    if (fseek(file, -1L, SEEK_END) != 0) { fclose(file); return 1; }
    int character = fgetc(file);
    fclose(file);
    if (character == EOF) return 1;
    printf("Last character = %c\n", character);
    return 0;
}
