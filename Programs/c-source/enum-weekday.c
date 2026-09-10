#include <stdio.h>

enum Weekday { MONDAY = 1, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };

int main(void)
{
    enum Weekday today = FRIDAY;
    switch (today) {
        case MONDAY: case TUESDAY: case WEDNESDAY: case THURSDAY: case FRIDAY:
            printf("Weekday number = %d\n", today); break;
        case SATURDAY: case SUNDAY: puts("It is the weekend."); break;
    }
    return 0;
}
