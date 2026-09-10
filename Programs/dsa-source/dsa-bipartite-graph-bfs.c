#include <stdio.h>

int main(void)
{
    int graph[4][4] = {
        {0,1,0,1}, {1,0,1,0}, {0,1,0,1}, {1,0,1,0}
    };
    int color[4] = {-1,-1,-1,-1}, queue[4], front = 0, rear = 0, valid = 1;
    color[0] = 0; queue[rear++] = 0;
    while (front < rear && valid) {
        int vertex = queue[front++];
        for (int neighbour = 0; neighbour < 4; neighbour++) if (graph[vertex][neighbour]) {
            if (color[neighbour] == -1) {
                color[neighbour] = 1 - color[vertex]; queue[rear++] = neighbour;
            } else if (color[neighbour] == color[vertex]) { valid = 0; break; }
        }
    }
    puts(valid ? "Graph is bipartite." : "Graph is not bipartite.");
    return 0;
}
