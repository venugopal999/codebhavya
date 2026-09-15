#include <stdio.h>

int main(void)
{
    const char *languages[] = {"C", "Python", "Java"};
    size_t count = sizeof languages / sizeof languages[0];
    for (size_t index = 0; index < count; index++) puts(languages[index]);
    return 0;
}
