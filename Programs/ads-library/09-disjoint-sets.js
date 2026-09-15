"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 9 — Disjoint Sets";
const dsu = `int parent[10], rank_value[10], set_size[10];
void initialize(int count) { for (int i = 0; i < count; i++) { parent[i] = i; rank_value[i] = 0; set_size[i] = 1; } }
int find_root(int value) { return parent[value] == value ? value : (parent[value] = find_root(parent[value])); }
void unite_rank(int first, int second)
{
    first = find_root(first); second = find_root(second);
    if (first == second) return;
    if (rank_value[first] < rank_value[second]) { int temp = first; first = second; second = temp; }
    parent[second] = first; set_size[first] += set_size[second];
    if (rank_value[first] == rank_value[second]) rank_value[first]++;
}`;

function program(options) {
  return makeAds({ topic, concepts: ["Union-find", "Connectivity"], difficulty: "Intermediate", ...options });
}

module.exports = [
  program({
    slug: "ads-dsu-quick-find",
    title: "Implement Quick-Find Disjoint Sets",
    source: cMain(`    int id[] = {0, 1, 2, 3, 4};
    int pairs[][2] = {{0, 1}, {1, 2}};
    for (int edge = 0; edge < 2; edge++) {
        int from = id[pairs[edge][1]], to = id[pairs[edge][0]];
        for (int index = 0; index < 5; index++) if (id[index] == from) id[index] = to;
    }
    for (int index = 0; index < 5; index++) printf("%d%c", id[index], index == 4 ? '\\n' : ' ');
    return 0;`),
    sampleOutput: "0 0 0 3 4",
    time: "O(n) union",
    space: "O(n)",
    method: "Relabel every member of one component during union so find remains constant time."
  }),
  program({
    slug: "ads-dsu-quick-union",
    title: "Implement Quick-Union Disjoint Sets",
    source: cMain(`    int parent[] = {0, 1, 2, 3, 4};
    parent[1] = 0; parent[2] = 1;
    int root0 = 0, root2 = 2;
    while (parent[root0] != root0) root0 = parent[root0];
    while (parent[root2] != root2) root2 = parent[root2];
    printf("Connected = %s\\n", root0 == root2 ? "Yes" : "No");
    return 0;`),
    sampleOutput: "Connected = Yes",
    time: "O(h)",
    space: "O(n)",
    method: "Represent each component as a parent tree and compare its roots."
  }),
  program({
    slug: "ads-dsu-union-by-rank",
    title: "Apply Union by Rank",
    source: cMain(`    initialize(6);
    unite_rank(0, 1); unite_rank(2, 3); unite_rank(0, 2);
    printf("Root = %d Rank = %d\\n", find_root(3), rank_value[find_root(3)]);
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Root = 0 Rank = 2",
    time: "O(alpha(n)) amortized",
    space: "O(n)",
    method: "Attach the shallower component beneath the deeper component."
  }),
  program({
    slug: "ads-dsu-path-compression",
    title: "Compress Paths During Find",
    source: cMain(`    initialize(5);
    parent[4] = 3; parent[3] = 2; parent[2] = 1; parent[1] = 0;
    printf("Before = %d ", parent[4]);
    find_root(4);
    printf("After = %d\\n", parent[4]);
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Before = 3 After = 0",
    time: "O(alpha(n)) amortized",
    space: "O(n)",
    method: "Rewrite every visited parent to point directly to the representative."
  }),
  program({
    slug: "ads-dsu-union-by-size",
    title: "Apply Union by Component Size",
    source: cMain(`    initialize(6);
    unite_rank(0, 1); unite_rank(2, 3); unite_rank(1, 3);
    printf("Component size = %d\\n", set_size[find_root(2)]);
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Component size = 4",
    time: "O(alpha(n)) amortized",
    space: "O(n)",
    method: "Track component sizes and report the size stored at the representative."
  }),
  program({
    slug: "ads-dsu-count-components",
    title: "Count Dynamic Connected Components",
    source: cMain(`    initialize(6);
    int components = 6, edges[][2] = {{0, 1}, {1, 2}, {3, 4}, {2, 4}};
    for (int edge = 0; edge < 4; edge++) {
        int first = find_root(edges[edge][0]), second = find_root(edges[edge][1]);
        if (first != second) { unite_rank(first, second); components--; }
    }
    printf("Components = %d\\n", components);
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Components = 2",
    time: "O((n + m) alpha(n))",
    space: "O(n)",
    method: "Decrease the component counter only when an edge joins two different roots."
  }),
  program({
    slug: "ads-dsu-connectivity-queries",
    title: "Answer Offline Connectivity Queries",
    source: cMain(`    initialize(6);
    unite_rank(0, 1); unite_rank(1, 2); unite_rank(4, 5);
    int queries[][2] = {{0, 2}, {0, 5}, {4, 5}};
    for (int index = 0; index < 3; index++)
        printf("%s%c", find_root(queries[index][0]) == find_root(queries[index][1]) ? "Yes" : "No", index == 2 ? '\\n' : ' ');
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Yes No Yes",
    time: "O(q alpha(n))",
    space: "O(n)",
    method: "Compare compressed representatives for each pair after processing all unions."
  }),
  program({
    slug: "ads-dsu-redundant-edge",
    title: "Find the First Redundant Edge",
    source: cMain(`    initialize(4);
    int edges[][2] = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};
    for (int edge = 0; edge < 4; edge++) {
        int first = edges[edge][0], second = edges[edge][1];
        if (find_root(first) == find_root(second)) { printf("Redundant = %d-%d\\n", first, second); break; }
        unite_rank(first, second);
    }
    return 0;`, ["stdio.h"], dsu),
    sampleOutput: "Redundant = 2-0",
    time: "O(m alpha(n))",
    space: "O(n)",
    method: "An edge is redundant when both endpoints already have the same representative."
  })
];
