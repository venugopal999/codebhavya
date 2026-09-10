#include <stdio.h>

int main(int argc, char *argv[])
{
    if (argc == 1) {
        puts("No command-line arguments supplied.");
        return 0;
    }
    printf("Argument count = %d\n", argc - 1);
    for (int index = 1; index < argc; index++)
        printf("Argument %d = %s\n", index, argv[index]);
    return 0;
}
