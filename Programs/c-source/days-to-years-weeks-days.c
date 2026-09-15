#include <stdio.h>

int main(void)
{
    int totalDays, years, weeks, days;

    printf("Enter total days: ");
    scanf("%d", &totalDays);
    years = totalDays / 365;
    totalDays %= 365;
    weeks = totalDays / 7;
    days = totalDays % 7;
    printf("%d year(s), %d week(s), %d day(s)\n", years, weeks, days);
    return 0;
}
