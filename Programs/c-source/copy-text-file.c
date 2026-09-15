#include <stdio.h>

int main(void)
{
    FILE *source = fopen("source.txt", "w");
    if (source == NULL) return 1;
    fputs("CodeBhavya file-copy example.\n", source);
    fclose(source);

    source = fopen("source.txt", "rb");
    FILE *destination = fopen("destination.txt", "wb");
    if (source == NULL || destination == NULL) {
        if (source != NULL) fclose(source);
        if (destination != NULL) fclose(destination);
        return 1;
    }
    int byte;
    while ((byte = fgetc(source)) != EOF) fputc(byte, destination);
    fclose(source);
    fclose(destination);
    printf("File copied to destination.txt\n");
    return 0;
}
