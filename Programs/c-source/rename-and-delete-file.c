#include <stdio.h>

int main(void)
{
    FILE *file = fopen("old-name.txt", "w");
    if (file == NULL) return 1;
    fputs("temporary file", file);
    fclose(file);
    if (rename("old-name.txt", "new-name.txt") != 0) return 1;
    puts("File renamed.");
    if (remove("new-name.txt") != 0) return 1;
    puts("File deleted.");
    return 0;
}
