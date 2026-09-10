#include <stdio.h>

struct Item { int value; int priority; };
void insert(struct Item queue[], int *count, int value, int priority)
{
    int index = *count;
    while (index > 0 && queue[index - 1].priority > priority) {
        queue[index] = queue[index - 1]; index--;
    }
    queue[index] = (struct Item){value, priority};
    (*count)++;
}

int main(void)
{
    struct Item queue[6];
    int count = 0;
    insert(queue, &count, 10, 2);
    insert(queue, &count, 20, 1);
    insert(queue, &count, 30, 3);
    while (count > 0) {
        struct Item item = queue[--count];
        printf("%d(p%d) ", item.value, item.priority);
    }
    putchar('\n');
    return 0;
}
