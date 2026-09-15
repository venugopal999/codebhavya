"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Graphs";

function graphProgram(options) {
  return makeDsa({
    topic,
    concepts: ["Graph", "Vertices", "Edges"],
    difficulty: options.difficulty || "Intermediate",
    time: "O(V + E)",
    space: "O(V + E)",
    ...options
  });
}

module.exports = [
  graphProgram({
    slug: "dsa-graph-adjacency-matrix",
    title: "Represent an Undirected Graph with an Adjacency Matrix",
    concepts: ["Adjacency matrix", "Undirected graph", "Representation"],
    source: cMain(`    int matrix[4][4] = {{0}};
    int edges[][2] = {{0, 1}, {0, 2}, {1, 3}, {2, 3}};
    for (int index = 0; index < 4; index++) {
        int first = edges[index][0], second = edges[index][1];
        matrix[first][second] = matrix[second][first] = 1;
    }
    for (int row = 0; row < 4; row++) {
        for (int column = 0; column < 4; column++) printf("%d ", matrix[row][column]);
        putchar('\\n');
    }
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0",
    time: "O(V²) display",
    space: "O(V²)",
    method: "Mark both matrix directions for every undirected edge."
  }),
  graphProgram({
    slug: "dsa-graph-adjacency-list",
    title: "Represent an Undirected Graph with Adjacency Lists",
    concepts: ["Adjacency list", "Linked list", "Undirected graph"],
    source: cMain(`    struct Node *graph[4] = {NULL};
    add_edge(graph, 0, 1); add_edge(graph, 0, 2); add_edge(graph, 1, 3);
    for (int vertex = 0; vertex < 4; vertex++) {
        printf("%d:", vertex);
        for (struct Node *node = graph[vertex]; node != NULL; node = node->next)
            printf(" %d", node->vertex);
        putchar('\\n');
    }
    clear_graph(graph, 4);
    return 0;`, ["stdio.h", "stdlib.h"], `struct Node { int vertex; struct Node *next; };
void add_one(struct Node *graph[], int from, int to)
{
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->vertex = to; node->next = graph[from]; graph[from] = node;
}
void add_edge(struct Node *graph[], int first, int second)
{
    add_one(graph, first, second); add_one(graph, second, first);
}
void clear_graph(struct Node *graph[], int vertices)
{
    for (int vertex = 0; vertex < vertices; vertex++)
        while (graph[vertex] != NULL) {
            struct Node *removed = graph[vertex];
            graph[vertex] = removed->next; free(removed);
        }
}`),
    sampleInput: "No input required",
    sampleOutput: "0: 2 1\n1: 3 0\n2: 0\n3: 1",
    method: "Store each neighbour in the linked list owned by its source vertex."
  }),
  graphProgram({
    slug: "dsa-graph-breadth-first-search",
    title: "Traverse a Graph with Breadth-First Search",
    concepts: ["BFS", "Queue", "Visited"],
    source: cMain(`    int graph[5][5] = {
        {0,1,1,0,0}, {1,0,0,1,0}, {1,0,0,1,1}, {0,1,1,0,0}, {0,0,1,0,0}
    };
    int visited[5] = {0}, queue[5], front = 0, rear = 0;
    visited[0] = 1; queue[rear++] = 0;
    while (front < rear) {
        int vertex = queue[front++];
        printf("%d ", vertex);
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && !visited[neighbour]) {
                visited[neighbour] = 1; queue[rear++] = neighbour;
            }
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0 1 2 3 4",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Mark vertices when they enter the queue so each vertex is processed once."
  }),
  graphProgram({
    slug: "dsa-graph-depth-first-search",
    title: "Traverse a Graph with Depth-First Search",
    concepts: ["DFS", "Recursion", "Visited"],
    source: cMain(`    int graph[5][5] = {
        {0,1,1,0,0}, {1,0,0,1,0}, {1,0,0,1,1}, {0,1,1,0,0}, {0,0,1,0,0}
    };
    int visited[5] = {0};
    dfs(0, graph, visited);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void dfs(int vertex, int graph[5][5], int visited[5])
{
    visited[vertex] = 1; printf("%d ", vertex);
    for (int neighbour = 0; neighbour < 5; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) dfs(neighbour, graph, visited);
}`),
    sampleInput: "No input required",
    sampleOutput: "0 1 3 2 4",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Recursively finish each unvisited neighbour branch before trying the next one."
  }),
  graphProgram({
    slug: "dsa-graph-connected-components",
    title: "Count Connected Components in an Undirected Graph",
    concepts: ["Connected components", "DFS forest", "Undirected graph"],
    source: cMain(`    int graph[6][6] = {
        {0,1,0,0,0,0}, {1,0,1,0,0,0}, {0,1,0,0,0,0},
        {0,0,0,0,1,0}, {0,0,0,1,0,1}, {0,0,0,0,1,0}
    };
    int visited[6] = {0}, components = 0;
    for (int vertex = 0; vertex < 6; vertex++)
        if (!visited[vertex]) { mark(vertex, graph, visited); components++; }
    printf("Components = %d\\n", components);
    return 0;`, ["stdio.h"], `void mark(int vertex, int graph[6][6], int visited[6])
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 6; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) mark(neighbour, graph, visited);
}`),
    sampleInput: "No input required",
    sampleOutput: "Components = 2",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Start a new DFS whenever the vertex loop finds an unvisited component."
  }),
  graphProgram({
    slug: "dsa-undirected-cycle-dfs",
    title: "Detect an Undirected Graph Cycle with DFS",
    concepts: ["Cycle detection", "Parent vertex", "DFS"],
    source: cMain(`    int graph[4][4] = {
        {0,1,1,0}, {1,0,1,0}, {1,1,0,1}, {0,0,1,0}
    };
    int visited[4] = {0};
    puts(has_cycle(0, -1, graph, visited) ? "Cycle detected." : "No cycle.");
    return 0;`, ["stdio.h"], `int has_cycle(int vertex, int parent, int graph[4][4], int visited[4])
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 4; neighbour++) if (graph[vertex][neighbour]) {
        if (!visited[neighbour]) {
            if (has_cycle(neighbour, vertex, graph, visited)) return 1;
        } else if (neighbour != parent) return 1;
    }
    return 0;
}`),
    sampleInput: "No input required",
    sampleOutput: "Cycle detected.",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "A visited neighbour other than the DFS parent closes an undirected cycle."
  }),
  graphProgram({
    slug: "dsa-directed-cycle-colors",
    title: "Detect a Directed Graph Cycle with DFS Colors",
    concepts: ["Directed cycle", "DFS colors", "Recursion stack"],
    source: cMain(`    int graph[4][4] = {
        {0,1,0,0}, {0,0,1,0}, {1,0,0,1}, {0,0,0,0}
    };
    int color[4] = {0}, cycle = 0;
    for (int vertex = 0; vertex < 4 && !cycle; vertex++)
        if (color[vertex] == 0) cycle = directed_cycle(vertex, graph, color);
    puts(cycle ? "Cycle detected." : "No cycle.");
    return 0;`, ["stdio.h"], `int directed_cycle(int vertex, int graph[4][4], int color[4])
{
    color[vertex] = 1;
    for (int neighbour = 0; neighbour < 4; neighbour++) if (graph[vertex][neighbour]) {
        if (color[neighbour] == 1) return 1;
        if (color[neighbour] == 0 && directed_cycle(neighbour, graph, color)) return 1;
    }
    color[vertex] = 2;
    return 0;
}`),
    sampleInput: "No input required",
    sampleOutput: "Cycle detected.",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "An edge to a currently active gray vertex is a directed back edge."
  }),
  graphProgram({
    slug: "dsa-topological-sort-kahn",
    title: "Topologically Sort a DAG with Kahn's Algorithm",
    concepts: ["Topological sort", "Indegree", "Queue"],
    source: cMain(`    int graph[6][6] = {{0}};
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    int indegree[6] = {0};
    for (int index = 0; index < 6; index++) {
        graph[edges[index][0]][edges[index][1]] = 1;
        indegree[edges[index][1]]++;
    }
    int queue[6], front = 0, rear = 0;
    for (int vertex = 0; vertex < 6; vertex++) if (indegree[vertex] == 0) queue[rear++] = vertex;
    while (front < rear) {
        int vertex = queue[front++]; printf("%d ", vertex);
        for (int neighbour = 0; neighbour < 6; neighbour++)
            if (graph[vertex][neighbour] && --indegree[neighbour] == 0) queue[rear++] = neighbour;
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "4 5 0 2 3 1",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Repeatedly remove zero-indegree vertices and reduce the indegrees of their outgoing neighbours."
  }),
  graphProgram({
    slug: "dsa-topological-sort-dfs",
    title: "Topologically Sort a DAG with DFS",
    concepts: ["Topological sort", "DFS", "Finish time"],
    source: cMain(`    int graph[6][6] = {{0}};
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    for (int index = 0; index < 6; index++) graph[edges[index][0]][edges[index][1]] = 1;
    int visited[6] = {0}, stack[6], top = 0;
    for (int vertex = 0; vertex < 6; vertex++)
        if (!visited[vertex]) topo(vertex, graph, visited, stack, &top);
    while (top > 0) printf("%d ", stack[--top]);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void topo(int vertex, int graph[6][6], int visited[6], int stack[6], int *top)
{
    visited[vertex] = 1;
    for (int neighbour = 0; neighbour < 6; neighbour++)
        if (graph[vertex][neighbour] && !visited[neighbour]) topo(neighbour, graph, visited, stack, top);
    stack[(*top)++] = vertex;
}`),
    sampleInput: "No input required",
    sampleOutput: "5 4 2 3 1 0",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Push each vertex after all descendants finish, then reverse the finish order."
  }),
  graphProgram({
    slug: "dsa-bipartite-graph-bfs",
    title: "Check Whether a Graph Is Bipartite",
    concepts: ["Bipartite", "Two-coloring", "BFS"],
    source: cMain(`    int graph[4][4] = {
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
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Graph is bipartite.",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Assign opposite colors across every edge and reject any same-color adjacency."
  }),
  graphProgram({
    slug: "dsa-unweighted-shortest-path-bfs",
    title: "Find Unweighted Shortest-Path Distances with BFS",
    concepts: ["Shortest path", "Unweighted graph", "BFS"],
    source: cMain(`    int graph[6][6] = {
        {0,1,1,0,0,0}, {1,0,0,1,0,0}, {1,0,0,1,1,0},
        {0,1,1,0,0,1}, {0,0,1,0,0,1}, {0,0,0,1,1,0}
    };
    int distance[6] = {-1,-1,-1,-1,-1,-1}, queue[6], front = 0, rear = 0;
    distance[0] = 0; queue[rear++] = 0;
    while (front < rear) {
        int vertex = queue[front++];
        for (int neighbour = 0; neighbour < 6; neighbour++)
            if (graph[vertex][neighbour] && distance[neighbour] < 0) {
                distance[neighbour] = distance[vertex] + 1; queue[rear++] = neighbour;
            }
    }
    for (int vertex = 0; vertex < 6; vertex++) printf("%d ", distance[vertex]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0 1 1 2 2 3",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "The first BFS discovery gives the minimum edge count from the source."
  }),
  graphProgram({
    slug: "dsa-dijkstra-shortest-path",
    title: "Find Weighted Shortest Paths with Dijkstra's Algorithm",
    concepts: ["Dijkstra", "Greedy", "Weighted graph"],
    difficulty: "Advanced",
    source: cMain(`    int graph[5][5] = {
        {0,10,0,5,0}, {0,0,1,2,0}, {0,0,0,0,4},
        {0,3,9,0,2}, {7,0,6,0,0}
    };
    int distance[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    int used[5] = {0};
    for (int step = 0; step < 5; step++) {
        int vertex = -1;
        for (int candidate = 0; candidate < 5; candidate++)
            if (!used[candidate] && (vertex < 0 || distance[candidate] < distance[vertex])) vertex = candidate;
        used[vertex] = 1;
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && distance[vertex] != INT_MAX &&
                distance[vertex] + graph[vertex][neighbour] < distance[neighbour])
                distance[neighbour] = distance[vertex] + graph[vertex][neighbour];
    }
    for (int vertex = 0; vertex < 5; vertex++) printf("%d ", distance[vertex]);
    putchar('\\n');
    return 0;`, ["stdio.h", "limits.h"]),
    sampleInput: "No input required",
    sampleOutput: "0 8 9 5 7",
    time: "O(V²)",
    space: "O(V)",
    method: "Finalize the nearest unused vertex and relax all of its outgoing non-negative edges."
  }),
  graphProgram({
    slug: "dsa-bellman-ford-shortest-path",
    title: "Find Shortest Paths with Bellman-Ford",
    concepts: ["Bellman-Ford", "Negative edges", "Relaxation"],
    difficulty: "Advanced",
    source: cMain(`    struct Edge edges[] = {
        {0,1,-1},{0,2,4},{1,2,3},{1,3,2},{1,4,2},{3,2,5},{3,1,1},{4,3,-3}
    };
    int distance[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    for (int pass = 1; pass < 5; pass++)
        for (int index = 0; index < 8; index++) {
            int from = edges[index].from, to = edges[index].to, weight = edges[index].weight;
            if (distance[from] != INT_MAX && distance[from] + weight < distance[to])
                distance[to] = distance[from] + weight;
        }
    for (int vertex = 0; vertex < 5; vertex++) printf("%d ", distance[vertex]);
    putchar('\\n');
    return 0;`, ["stdio.h", "limits.h"], `struct Edge { int from; int to; int weight; };`),
    sampleInput: "No input required",
    sampleOutput: "0 -1 2 -2 1",
    time: "O(VE)",
    space: "O(V)",
    method: "Relax every edge V-1 times so shortest paths with negative edges can propagate."
  }),
  graphProgram({
    slug: "dsa-floyd-warshall-all-pairs",
    title: "Find All-Pairs Shortest Paths with Floyd-Warshall",
    concepts: ["Floyd-Warshall", "Dynamic programming", "All pairs"],
    difficulty: "Advanced",
    source: cMain(`    int distance[4][4] = {
        {0,5,999,10}, {999,0,3,999}, {999,999,0,1}, {999,999,999,0}
    };
    for (int through = 0; through < 4; through++)
        for (int from = 0; from < 4; from++)
            for (int to = 0; to < 4; to++)
                if (distance[from][through] + distance[through][to] < distance[from][to])
                    distance[from][to] = distance[from][through] + distance[through][to];
    printf("0 to 3 = %d\\n", distance[0][3]);
    printf("1 to 3 = %d\\n", distance[1][3]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0 to 3 = 9\n1 to 3 = 4",
    time: "O(V³)",
    space: "O(V²)",
    method: "Allow each vertex in turn as an intermediate point for every source-destination pair."
  }),
  graphProgram({
    slug: "dsa-prim-minimum-spanning-tree",
    title: "Find a Minimum Spanning Tree with Prim's Algorithm",
    concepts: ["Prim", "Minimum spanning tree", "Greedy"],
    difficulty: "Advanced",
    source: cMain(`    int graph[5][5] = {
        {0,2,0,6,0}, {2,0,3,8,5}, {0,3,0,0,7}, {6,8,0,0,9}, {0,5,7,9,0}
    };
    int key[5] = {0, INT_MAX, INT_MAX, INT_MAX, INT_MAX};
    int parent[5] = {-1,-1,-1,-1,-1}, used[5] = {0};
    for (int step = 0; step < 5; step++) {
        int vertex = -1;
        for (int candidate = 0; candidate < 5; candidate++)
            if (!used[candidate] && (vertex < 0 || key[candidate] < key[vertex])) vertex = candidate;
        used[vertex] = 1;
        for (int neighbour = 0; neighbour < 5; neighbour++)
            if (graph[vertex][neighbour] && !used[neighbour] && graph[vertex][neighbour] < key[neighbour]) {
                key[neighbour] = graph[vertex][neighbour]; parent[neighbour] = vertex;
            }
    }
    int cost = 0;
    for (int vertex = 1; vertex < 5; vertex++) {
        printf("%d-%d(%d) ", parent[vertex], vertex, graph[parent[vertex]][vertex]);
        cost += graph[parent[vertex]][vertex];
    }
    printf("\\nCost = %d\\n", cost);
    return 0;`, ["stdio.h", "limits.h"]),
    sampleInput: "No input required",
    sampleOutput: "0-1(2) 1-2(3) 0-3(6) 1-4(5)\nCost = 16",
    time: "O(V²)",
    space: "O(V)",
    method: "Repeatedly attach the unused vertex with the cheapest edge into the growing tree."
  }),
  graphProgram({
    slug: "dsa-transitive-closure",
    title: "Compute Graph Transitive Closure",
    concepts: ["Reachability", "Warshall", "Transitive closure"],
    difficulty: "Advanced",
    source: cMain(`    int reach[4][4] = {
        {1,1,0,0}, {0,1,1,0}, {0,0,1,1}, {0,0,0,1}
    };
    for (int through = 0; through < 4; through++)
        for (int from = 0; from < 4; from++)
            for (int to = 0; to < 4; to++)
                reach[from][to] = reach[from][to] || (reach[from][through] && reach[through][to]);
    for (int row = 0; row < 4; row++) {
        for (int column = 0; column < 4; column++) printf("%d ", reach[row][column]);
        putchar('\\n');
    }
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "1 1 1 1\n0 1 1 1\n0 0 1 1\n0 0 0 1",
    time: "O(V³)",
    space: "O(V²)",
    method: "Mark a pair reachable when both halves of a path through an intermediate vertex exist."
  }),
  graphProgram({
    slug: "dsa-articulation-points",
    title: "Find Articulation Points with Tarjan's DFS",
    concepts: ["Articulation point", "Discovery time", "Low link"],
    difficulty: "Advanced",
    source: cMain(`    int graph[5][5] = {
        {0,1,1,1,0}, {1,0,1,0,0}, {1,1,0,0,0}, {1,0,0,0,1}, {0,0,0,1,0}
    };
    int visited[5] = {0}, discovery[5], low[5], parent[5] = {-1,-1,-1,-1,-1};
    int articulation[5] = {0}, time = 0;
    ap_dfs(0, graph, visited, discovery, low, parent, articulation, &time);
    printf("Articulation points: ");
    for (int vertex = 0; vertex < 5; vertex++) if (articulation[vertex]) printf("%d ", vertex);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void ap_dfs(int vertex, int graph[5][5], int visited[5], int discovery[5],
            int low[5], int parent[5], int articulation[5], int *time)
{
    visited[vertex] = 1; discovery[vertex] = low[vertex] = ++(*time);
    int children = 0;
    for (int neighbour = 0; neighbour < 5; neighbour++) if (graph[vertex][neighbour]) {
        if (!visited[neighbour]) {
            children++; parent[neighbour] = vertex;
            ap_dfs(neighbour, graph, visited, discovery, low, parent, articulation, time);
            if (low[neighbour] < low[vertex]) low[vertex] = low[neighbour];
            if (parent[vertex] == -1 && children > 1) articulation[vertex] = 1;
            if (parent[vertex] != -1 && low[neighbour] >= discovery[vertex]) articulation[vertex] = 1;
        } else if (neighbour != parent[vertex] && discovery[neighbour] < low[vertex])
            low[vertex] = discovery[neighbour];
    }
}`),
    sampleInput: "No input required",
    sampleOutput: "Articulation points: 0 3",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Use low-link values to detect vertices whose DFS child cannot reach an ancestor."
  }),
  graphProgram({
    slug: "dsa-strongly-connected-components",
    title: "Count Strongly Connected Components with Kosaraju's Algorithm",
    concepts: ["Kosaraju", "Transpose graph", "SCC"],
    difficulty: "Advanced",
    source: cMain(`    int graph[5][5] = {{0}}, transpose[5][5] = {{0}};
    int edges[][2] = {{1,0},{0,2},{2,1},{0,3},{3,4}};
    for (int index = 0; index < 5; index++) {
        graph[edges[index][0]][edges[index][1]] = 1;
        transpose[edges[index][1]][edges[index][0]] = 1;
    }
    int visited[5] = {0}, order[5], top = 0;
    for (int vertex = 0; vertex < 5; vertex++)
        if (!visited[vertex]) finish(vertex, graph, visited, order, &top);
    for (int vertex = 0; vertex < 5; vertex++) visited[vertex] = 0;
    int components = 0;
    while (top > 0) {
        int vertex = order[--top];
        if (!visited[vertex]) { mark(vertex, transpose, visited); components++; }
    }
    printf("Strongly connected components = %d\\n", components);
    return 0;`, ["stdio.h"], `void finish(int vertex, int graph[5][5], int visited[5], int order[5], int *top)
{
    visited[vertex] = 1;
    for (int next = 0; next < 5; next++)
        if (graph[vertex][next] && !visited[next]) finish(next, graph, visited, order, top);
    order[(*top)++] = vertex;
}
void mark(int vertex, int graph[5][5], int visited[5])
{
    visited[vertex] = 1;
    for (int next = 0; next < 5; next++)
        if (graph[vertex][next] && !visited[next]) mark(next, graph, visited);
}`),
    sampleInput: "No input required",
    sampleOutput: "Strongly connected components = 3",
    time: "O(V²) with matrix",
    space: "O(V)",
    method: "Process the transposed graph in reverse finish order from the original DFS."
  })
];
