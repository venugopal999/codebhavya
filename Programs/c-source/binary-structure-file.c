#include <stdio.h>

struct Record { int id; char name[20]; double marks; };

int main(void)
{
    struct Record original = {101, "Anu", 92.5};
    struct Record restored = {0};
    FILE *file = fopen("record.bin", "wb");
    if (file == NULL) return 1;
    if (fwrite(&original, sizeof original, 1, file) != 1) { fclose(file); return 1; }
    fclose(file);
    file = fopen("record.bin", "rb");
    if (file == NULL) return 1;
    if (fread(&restored, sizeof restored, 1, file) != 1) { fclose(file); return 1; }
    fclose(file);
    printf("%d %s %.1f\n", restored.id, restored.name, restored.marks);
    return 0;
}
