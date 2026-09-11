#include <limits.h>
#include <stdio.h>

#define MAX_LOCATIONS 8
#define INF (INT_MAX / 4)

typedef struct {
    const char *name;
    int distance[MAX_LOCATIONS][MAX_LOCATIONS];
    int locationCount;
} CampusGraph;

static void initializeGraph(CampusGraph *graph) {
    graph->name = "CodeBhavya Engineering Campus";
    graph->locationCount = 7;

    for (int i = 0; i < graph->locationCount; ++i) {
        for (int j = 0; j < graph->locationCount; ++j) {
            graph->distance[i][j] = i == j ? 0 : INF;
        }
    }
}

static void connect(CampusGraph *graph, int from, int to, int metres) {
    graph->distance[from][to] = metres;
    graph->distance[to][from] = metres;
}

static void loadCampusRoads(CampusGraph *graph) {
    connect(graph, 0, 1, 120);
    connect(graph, 0, 2, 260);
    connect(graph, 1, 2, 100);
    connect(graph, 1, 3, 180);
    connect(graph, 2, 4, 140);
    connect(graph, 3, 4, 90);
    connect(graph, 3, 5, 210);
    connect(graph, 4, 5, 130);
    connect(graph, 4, 6, 170);
    connect(graph, 5, 6, 80);
}

static const char *locationName(int index) {
    static const char *names[MAX_LOCATIONS] = {
        "Main Gate", "Admin Block", "Library", "CSE Block",
        "Innovation Lab", "Hostel", "Sports Complex", "Unused"
    };
    return names[index];
}

static void showLocations(const CampusGraph *graph) {
    puts("\nCampus locations:");
    for (int i = 0; i < graph->locationCount; ++i) {
        printf("%d. %s\n", i + 1, locationName(i));
    }
}

static int nearestUnvisited(const int distance[], const int visited[], int count) {
    int bestVertex = -1;
    int bestDistance = INF;

    for (int vertex = 0; vertex < count; ++vertex) {
        if (!visited[vertex] && distance[vertex] < bestDistance) {
            bestDistance = distance[vertex];
            bestVertex = vertex;
        }
    }
    return bestVertex;
}

static void printPath(const int previous[], int destination) {
    int reversed[MAX_LOCATIONS];
    int length = 0;

    for (int current = destination; current != -1; current = previous[current]) {
        reversed[length++] = current;
    }

    for (int i = length - 1; i >= 0; --i) {
        printf("%s", locationName(reversed[i]));
        if (i > 0) {
            printf(" -> ");
        }
    }
}

static void shortestRoute(const CampusGraph *graph, int source, int destination) {
    int best[MAX_LOCATIONS];
    int previous[MAX_LOCATIONS];
    int visited[MAX_LOCATIONS] = {0};

    for (int i = 0; i < graph->locationCount; ++i) {
        best[i] = INF;
        previous[i] = -1;
    }
    best[source] = 0;

    for (int step = 0; step < graph->locationCount; ++step) {
        int current = nearestUnvisited(best, visited, graph->locationCount);
        if (current == -1) {
            break;
        }
        visited[current] = 1;
        if (current == destination) {
            break;
        }

        for (int neighbour = 0; neighbour < graph->locationCount; ++neighbour) {
            int edge = graph->distance[current][neighbour];
            if (!visited[neighbour] && edge < INF &&
                best[current] + edge < best[neighbour]) {
                best[neighbour] = best[current] + edge;
                previous[neighbour] = current;
            }
        }
    }

    if (best[destination] == INF) {
        puts("No route is currently available.");
        return;
    }

    printf("Shortest route: ");
    printPath(previous, destination);
    printf("\nTotal walking distance: %d metres\n", best[destination]);
}

static int readNumber(const char *prompt) {
    char line[32];
    printf("%s", prompt);
    if (fgets(line, sizeof(line), stdin) == NULL) {
        return -1;
    }
    int value;
    return sscanf(line, "%d", &value) == 1 ? value : -1;
}

static int readLocation(const CampusGraph *graph, const char *prompt) {
    int value = readNumber(prompt);
    return value >= 1 && value <= graph->locationCount ? value - 1 : -1;
}

static void updateRoad(CampusGraph *graph, int closeRoad) {
    showLocations(graph);
    int from = readLocation(graph, "First location: ");
    int to = readLocation(graph, "Second location: ");

    if (from < 0 || to < 0 || from == to) {
        puts("Choose two different valid locations.");
        return;
    }

    if (closeRoad) {
        if (graph->distance[from][to] == INF) {
            puts("Those locations do not have an open direct road.");
        } else {
            graph->distance[from][to] = INF;
            graph->distance[to][from] = INF;
            puts("Road closed in both directions.");
        }
        return;
    }

    int metres = readNumber("Road distance in metres: ");
    if (metres <= 0 || metres >= INF) {
        puts("Distance must be a positive practical value.");
        return;
    }
    connect(graph, from, to, metres);
    puts("Road opened or updated in both directions.");
}

static void showRoads(const CampusGraph *graph) {
    puts("\nOpen campus roads:");
    for (int from = 0; from < graph->locationCount; ++from) {
        for (int to = from + 1; to < graph->locationCount; ++to) {
            if (graph->distance[from][to] < INF) {
                printf("%-16s <-> %-16s %4d m\n", locationName(from),
                       locationName(to), graph->distance[from][to]);
            }
        }
    }
}

int main(void) {
    CampusGraph campus;
    initializeGraph(&campus);
    loadCampusRoads(&campus);

    printf("%s Route Planner\n", campus.name);
    for (;;) {
        puts("\n1. Find shortest route");
        puts("2. Close a road");
        puts("3. Open or update a road");
        puts("4. Display road network");
        puts("5. Exit");

        int choice = readNumber("Choose: ");
        if (choice == 1) {
            showLocations(&campus);
            int source = readLocation(&campus, "Starting location: ");
            int destination = readLocation(&campus, "Destination: ");
            if (source < 0 || destination < 0) {
                puts("Invalid location number.");
            } else {
                shortestRoute(&campus, source, destination);
            }
        } else if (choice == 2) {
            updateRoad(&campus, 1);
        } else if (choice == 3) {
            updateRoad(&campus, 0);
        } else if (choice == 4) {
            showRoads(&campus);
        } else if (choice == 5) {
            puts("Route planner closed.");
            break;
        } else {
            puts("Choose a number from 1 to 5.");
        }
    }
    return 0;
}
