#include <stdio.h>

int main(void)
{
    int prices[] = {100, 80, 60, 70, 60, 75, 85};
    int stack[7], top = -1, spans[7];
    for (int day = 0; day < 7; day++) {
        while (top >= 0 && prices[stack[top]] <= prices[day]) top--;
        spans[day] = top < 0 ? day + 1 : day - stack[top];
        stack[++top] = day;
    }
    for (int day = 0; day < 7; day++) printf("%d ", spans[day]);
    putchar('\n');
    return 0;
}
