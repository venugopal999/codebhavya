"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Trees & Binary Search Trees";

const treeBase = `struct TreeNode { int data; struct TreeNode *left; struct TreeNode *right; };
struct TreeNode *new_node(int value)
{
    struct TreeNode *node = malloc(sizeof *node);
    if (node == NULL) exit(EXIT_FAILURE);
    node->data = value; node->left = NULL; node->right = NULL;
    return node;
}
struct TreeNode *sample_tree(void)
{
    struct TreeNode *root = new_node(1);
    root->left = new_node(2); root->right = new_node(3);
    root->left->left = new_node(4); root->left->right = new_node(5);
    root->right->left = new_node(6); root->right->right = new_node(7);
    return root;
}
void free_tree(struct TreeNode *root)
{
    if (root == NULL) return;
    free_tree(root->left); free_tree(root->right); free(root);
}`;

const bstBase = treeBase + `
struct TreeNode *bst_insert(struct TreeNode *root, int value)
{
    if (root == NULL) return new_node(value);
    if (value < root->data) root->left = bst_insert(root->left, value);
    else if (value > root->data) root->right = bst_insert(root->right, value);
    return root;
}
void inorder(struct TreeNode *root)
{
    if (root == NULL) return;
    inorder(root->left); printf("%d ", root->data); inorder(root->right);
}`;

function treeProgram(options) {
  return makeDsa({
    topic,
    concepts: ["Binary tree", "Nodes", "Recursion"],
    time: "O(n)",
    space: "O(h)",
    ...options
  });
}

module.exports = [
  treeProgram({
    slug: "dsa-tree-inorder-recursive",
    title: "Traverse a Binary Tree Inorder Recursively",
    source: cMain(`    struct TreeNode *root = sample_tree();
    inorder_walk(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
void inorder_walk(struct TreeNode *root)
{
    if (root == NULL) return;
    inorder_walk(root->left); printf("%d ", root->data); inorder_walk(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "4 2 5 1 6 3 7",
    method: "Visit the left subtree, current node and right subtree in that order."
  }),
  treeProgram({
    slug: "dsa-tree-preorder-recursive",
    title: "Traverse a Binary Tree Preorder Recursively",
    source: cMain(`    struct TreeNode *root = sample_tree();
    preorder(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
void preorder(struct TreeNode *root)
{
    if (root == NULL) return;
    printf("%d ", root->data); preorder(root->left); preorder(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "1 2 4 5 3 6 7",
    method: "Process the current node before recursively traversing its two subtrees."
  }),
  treeProgram({
    slug: "dsa-tree-postorder-recursive",
    title: "Traverse a Binary Tree Postorder Recursively",
    source: cMain(`    struct TreeNode *root = sample_tree();
    postorder(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
void postorder(struct TreeNode *root)
{
    if (root == NULL) return;
    postorder(root->left); postorder(root->right); printf("%d ", root->data);
}`),
    sampleInput: "No input required",
    sampleOutput: "4 5 2 6 7 3 1",
    method: "Traverse both children before processing the current node."
  }),
  treeProgram({
    slug: "dsa-tree-inorder-iterative",
    title: "Traverse a Binary Tree Inorder Iteratively",
    difficulty: "Intermediate",
    source: cMain(`    struct TreeNode *root = sample_tree();
    struct TreeNode *stack[20], *current = root;
    int top = -1;
    while (current != NULL || top >= 0) {
        while (current != NULL) { stack[++top] = current; current = current->left; }
        current = stack[top--];
        printf("%d ", current->data);
        current = current->right;
    }
    putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase),
    sampleInput: "No input required",
    sampleOutput: "4 2 5 1 6 3 7",
    method: "Use an explicit stack to remember ancestors while descending left."
  }),
  treeProgram({
    slug: "dsa-tree-level-order",
    title: "Traverse a Binary Tree Level by Level",
    source: cMain(`    struct TreeNode *root = sample_tree();
    struct TreeNode *queue[20];
    int front = 0, rear = 0;
    queue[rear++] = root;
    while (front < rear) {
        struct TreeNode *node = queue[front++];
        printf("%d ", node->data);
        if (node->left != NULL) queue[rear++] = node->left;
        if (node->right != NULL) queue[rear++] = node->right;
    }
    putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase),
    sampleInput: "No input required",
    sampleOutput: "1 2 3 4 5 6 7",
    space: "O(w)",
    method: "Use a queue so nodes leave in the same order their level positions are discovered."
  }),
  treeProgram({
    slug: "dsa-tree-height",
    title: "Find the Height of a Binary Tree",
    source: cMain(`    struct TreeNode *root = sample_tree();
    printf("Height = %d\\n", height(root));
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int height(struct TreeNode *root)
{
    if (root == NULL) return 0;
    int left = height(root->left), right = height(root->right);
    return 1 + (left > right ? left : right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Height = 3",
    method: "The height is one plus the larger height of the two subtrees."
  }),
  treeProgram({
    slug: "dsa-count-tree-nodes",
    title: "Count All Nodes in a Binary Tree",
    source: cMain(`    struct TreeNode *root = sample_tree();
    printf("Nodes = %d\\n", count_nodes(root));
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int count_nodes(struct TreeNode *root)
{
    return root == NULL ? 0 : 1 + count_nodes(root->left) + count_nodes(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Nodes = 7",
    method: "Count the current node plus every node in both subtrees."
  }),
  treeProgram({
    slug: "dsa-count-tree-leaves",
    title: "Count Leaf Nodes in a Binary Tree",
    source: cMain(`    struct TreeNode *root = sample_tree();
    printf("Leaves = %d\\n", count_leaves(root));
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int count_leaves(struct TreeNode *root)
{
    if (root == NULL) return 0;
    if (root->left == NULL && root->right == NULL) return 1;
    return count_leaves(root->left) + count_leaves(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Leaves = 4",
    method: "Count a node only when it has no left or right child."
  }),
  treeProgram({
    slug: "dsa-sum-tree-nodes",
    title: "Find the Sum of All Binary-Tree Nodes",
    source: cMain(`    struct TreeNode *root = sample_tree();
    printf("Sum = %d\\n", tree_sum(root));
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int tree_sum(struct TreeNode *root)
{
    return root == NULL ? 0 : root->data + tree_sum(root->left) + tree_sum(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Sum = 28",
    method: "Combine the current value with the sums returned by both children."
  }),
  treeProgram({
    slug: "dsa-search-binary-tree",
    title: "Search for a Value in a General Binary Tree",
    source: cMain(`    struct TreeNode *root = sample_tree();
    puts(tree_search(root, 6) ? "Value found." : "Value not found.");
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int tree_search(struct TreeNode *root, int key)
{
    if (root == NULL) return 0;
    return root->data == key || tree_search(root->left, key) || tree_search(root->right, key);
}`),
    sampleInput: "No input required",
    sampleOutput: "Value found.",
    method: "Check the current node and recursively search both subtrees when necessary."
  }),
  treeProgram({
    slug: "dsa-tree-diameter",
    title: "Find the Diameter of a Binary Tree",
    difficulty: "Advanced",
    source: cMain(`    struct TreeNode *root = sample_tree();
    int diameter = 0;
    diameter_height(root, &diameter);
    printf("Diameter in nodes = %d\\n", diameter);
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int diameter_height(struct TreeNode *root, int *diameter)
{
    if (root == NULL) return 0;
    int left = diameter_height(root->left, diameter);
    int right = diameter_height(root->right, diameter);
    if (left + right + 1 > *diameter) *diameter = left + right + 1;
    return 1 + (left > right ? left : right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Diameter in nodes = 5",
    method: "At each node, combine both subtree heights while returning one height upward."
  }),
  treeProgram({
    slug: "dsa-check-height-balanced-tree",
    title: "Check Whether a Binary Tree Is Height-Balanced",
    difficulty: "Advanced",
    source: cMain(`    struct TreeNode *root = sample_tree();
    puts(balance_height(root) >= 0 ? "Tree is balanced." : "Tree is not balanced.");
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int balance_height(struct TreeNode *root)
{
    if (root == NULL) return 0;
    int left = balance_height(root->left);
    int right = balance_height(root->right);
    if (left < 0 || right < 0 || abs(left - right) > 1) return -1;
    return 1 + (left > right ? left : right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Tree is balanced.",
    method: "Return a failure marker as soon as any subtree heights differ by more than one."
  }),
  treeProgram({
    slug: "dsa-mirror-binary-tree",
    title: "Create the Mirror of a Binary Tree",
    source: cMain(`    struct TreeNode *root = sample_tree();
    mirror(root);
    preorder(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
void mirror(struct TreeNode *root)
{
    if (root == NULL) return;
    struct TreeNode *temporary = root->left; root->left = root->right; root->right = temporary;
    mirror(root->left); mirror(root->right);
}
void preorder(struct TreeNode *root)
{
    if (root == NULL) return;
    printf("%d ", root->data); preorder(root->left); preorder(root->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "1 3 7 6 2 5 4",
    method: "Exchange left and right children at every node recursively."
  }),
  treeProgram({
    slug: "dsa-identical-binary-trees",
    title: "Check Whether Two Binary Trees Are Identical",
    source: cMain(`    struct TreeNode *first = sample_tree();
    struct TreeNode *second = sample_tree();
    puts(identical(first, second) ? "Trees are identical." : "Trees differ.");
    free_tree(first); free_tree(second);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
int identical(struct TreeNode *first, struct TreeNode *second)
{
    if (first == NULL || second == NULL) return first == second;
    return first->data == second->data &&
           identical(first->left, second->left) &&
           identical(first->right, second->right);
}`),
    sampleInput: "No input required",
    sampleOutput: "Trees are identical.",
    method: "Require equal values and identical left and right subtree structure at every position."
  }),
  treeProgram({
    slug: "dsa-lca-binary-tree",
    title: "Find the Lowest Common Ancestor in a Binary Tree",
    difficulty: "Advanced",
    source: cMain(`    struct TreeNode *root = sample_tree();
    struct TreeNode *ancestor = lca(root, 4, 5);
    printf("LCA = %d\\n", ancestor->data);
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], treeBase + `
struct TreeNode *lca(struct TreeNode *root, int first, int second)
{
    if (root == NULL || root->data == first || root->data == second) return root;
    struct TreeNode *left = lca(root->left, first, second);
    struct TreeNode *right = lca(root->right, first, second);
    if (left != NULL && right != NULL) return root;
    return left != NULL ? left : right;
}`),
    sampleInput: "No input required",
    sampleOutput: "LCA = 2",
    method: "The first node receiving one target from each subtree is their lowest common ancestor."
  }),
  treeProgram({
    slug: "dsa-bst-insert-inorder",
    title: "Insert Values into a Binary Search Tree",
    source: cMain(`    int values[] = {50, 30, 70, 20, 40, 60, 80};
    struct TreeNode *root = NULL;
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    inorder(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], bstBase),
    sampleInput: "No input required",
    sampleOutput: "20 30 40 50 60 70 80",
    time: "Average O(log n) per insertion",
    method: "Recursively choose the left or right subtree according to the BST ordering rule."
  }),
  treeProgram({
    slug: "dsa-bst-search",
    title: "Search a Binary Search Tree",
    source: cMain(`    int values[] = {50, 30, 70, 20, 40, 60, 80};
    struct TreeNode *root = NULL;
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    struct TreeNode *current = root;
    while (current != NULL && current->data != 60)
        current = 60 < current->data ? current->left : current->right;
    puts(current != NULL ? "Value found." : "Value not found.");
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], bstBase),
    sampleInput: "No input required",
    sampleOutput: "Value found.",
    time: "Average O(log n)",
    method: "Discard one ordered subtree after every comparison."
  }),
  treeProgram({
    slug: "dsa-bst-delete",
    title: "Delete a Value from a Binary Search Tree",
    difficulty: "Advanced",
    source: cMain(`    int values[] = {50, 30, 70, 20, 40, 60, 80};
    struct TreeNode *root = NULL;
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    root = bst_delete(root, 50);
    inorder(root); putchar('\\n');
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], bstBase + `
struct TreeNode *bst_delete(struct TreeNode *root, int key)
{
    if (root == NULL) return NULL;
    if (key < root->data) root->left = bst_delete(root->left, key);
    else if (key > root->data) root->right = bst_delete(root->right, key);
    else {
        if (root->left == NULL) { struct TreeNode *right = root->right; free(root); return right; }
        if (root->right == NULL) { struct TreeNode *left = root->left; free(root); return left; }
        struct TreeNode *successor = root->right;
        while (successor->left != NULL) successor = successor->left;
        root->data = successor->data;
        root->right = bst_delete(root->right, successor->data);
    }
    return root;
}`),
    sampleInput: "No input required",
    sampleOutput: "20 30 40 60 70 80",
    time: "Average O(log n)",
    method: "Handle leaf, one-child and two-child cases; replace a two-child node with its inorder successor."
  }),
  treeProgram({
    slug: "dsa-bst-minimum-maximum",
    title: "Find the Minimum and Maximum in a Binary Search Tree",
    source: cMain(`    int values[] = {50, 30, 70, 20, 40, 60, 80};
    struct TreeNode *root = NULL;
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    struct TreeNode *minimum = root, *maximum = root;
    while (minimum->left != NULL) minimum = minimum->left;
    while (maximum->right != NULL) maximum = maximum->right;
    printf("Minimum = %d, Maximum = %d\\n", minimum->data, maximum->data);
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h"], bstBase),
    sampleInput: "No input required",
    sampleOutput: "Minimum = 20, Maximum = 80",
    time: "O(h)",
    method: "Follow only left links for the minimum and only right links for the maximum."
  }),
  treeProgram({
    slug: "dsa-validate-binary-search-tree",
    title: "Validate a Binary Search Tree",
    difficulty: "Advanced",
    source: cMain(`    struct TreeNode *root = NULL;
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    for (int index = 0; index < 7; index++) root = bst_insert(root, values[index]);
    puts(valid_bst(root, LLONG_MIN, LLONG_MAX) ? "Valid BST." : "Invalid BST.");
    free_tree(root);
    return 0;`, ["stdio.h", "stdlib.h", "limits.h"], bstBase + `
int valid_bst(struct TreeNode *root, long long minimum, long long maximum)
{
    if (root == NULL) return 1;
    if (root->data <= minimum || root->data >= maximum) return 0;
    return valid_bst(root->left, minimum, root->data) &&
           valid_bst(root->right, root->data, maximum);
}`),
    sampleInput: "No input required",
    sampleOutput: "Valid BST.",
    method: "Carry the valid value range downward instead of checking only each direct child."
  })
];
