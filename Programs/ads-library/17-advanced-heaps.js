"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 17 — Advanced Heaps";

function program(options) {
  return makeAds({ topic, concepts: ["Heap variants", "Priority queue"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-dary-max-heap",
    title: "Implement a D-Ary Max Heap",
    source: cMain(`    int heap[20], size = 0, values[] = {10, 40, 15, 30, 50, 20};
    for (int i = 0; i < 6; i++) insert(heap, &size, values[i], 3);
    printf("Extracted:"); while (size) printf(" %d", extract_max(heap, &size, 3)); putchar('\\n'); return 0;`, ["stdio.h"], `void insert(int heap[], int *size, int value, int degree) { int index = (*size)++; heap[index] = value; while (index > 0) { int parent = (index - 1) / degree; if (heap[parent] >= heap[index]) break; int t = heap[parent]; heap[parent] = heap[index]; heap[index] = t; index = parent; } }
int extract_max(int heap[], int *size, int degree) { int answer = heap[0]; heap[0] = heap[--(*size)]; int index = 0; for (;;) { int best = index; for (int child = degree * index + 1; child <= degree * index + degree && child < *size; child++) if (heap[child] > heap[best]) best = child; if (best == index) break; int t = heap[index]; heap[index] = heap[best]; heap[best] = t; index = best; } return answer; }`),
    sampleOutput: "Extracted: 50 40 30 20 15 10",
    time: "O(log_d n) per operation",
    space: "O(n)",
    method: "Give every node d children and restore max-heap order along parent or best-child paths."
  }),
  program({
    slug: "ads-indexed-min-priority-queue",
    title: "Update Priorities in an Indexed Min Heap",
    source: cMain(`    int heap[] = {1, 3, 2, 4}, key[] = {0, 40, 30, 20, 50}, position[] = {0,0,2,1,3}, size = 4;
    decrease(heap, position, key, 4, 10);
    while (size) { int id = pop_min(heap, position, key, &size); printf("%d:%d%c", id, key[id], size ? ' ' : '\\n'); }
    return 0;`, ["stdio.h"], `void swap_ids(int heap[], int position[], int a, int b) { int t = heap[a]; heap[a] = heap[b]; heap[b] = t; position[heap[a]] = a; position[heap[b]] = b; }
void decrease(int heap[], int position[], int key[], int id, int value) { key[id] = value; int index = position[id]; while (index && key[heap[(index - 1) / 2]] > key[heap[index]]) { swap_ids(heap, position, index, (index - 1) / 2); index = (index - 1) / 2; } }
int pop_min(int heap[], int position[], const int key[], int *size) { int answer = heap[0]; swap_ids(heap, position, 0, *size - 1); (*size)--; int index = 0; for (;;) { int left = 2 * index + 1, right = left + 1, best = index; if (left < *size && key[heap[left]] < key[heap[best]]) best = left; if (right < *size && key[heap[right]] < key[heap[best]]) best = right; if (best == index) break; swap_ids(heap, position, index, best); index = best; } return answer; }`),
    sampleOutput: "4:10 3:20 2:30 1:40",
    time: "O(log n) update and removal",
    space: "O(n)",
    method: "Maintain an inverse position array so a named item can move upward after its key decreases."
  }),
  program({
    slug: "ads-running-median-two-heaps",
    title: "Maintain a Running Median with Two Heaps",
    source: cMain(`    int stream[] = {5, 15, 1, 3}, lower[10], upper[10], lower_count = 0, upper_count = 0;
    for (int i = 0; i < 4; i++) { add_value(stream[i], lower, &lower_count, upper, &upper_count); if (lower_count == upper_count) printf("%.1f", (lower[0] + upper[0]) / 2.0); else printf("%.1f", lower[0] * 1.0); printf("%c", i == 3 ? '\\n' : ' '); }
    return 0;`, ["stdio.h"], `void push_max(int heap[], int *count, int value) { int i = (*count)++; heap[i] = value; while (i && heap[(i-1)/2] < heap[i]) { int t=heap[i]; heap[i]=heap[(i-1)/2]; heap[(i-1)/2]=t; i=(i-1)/2; } }
void push_min(int heap[], int *count, int value) { int i = (*count)++; heap[i] = value; while (i && heap[(i-1)/2] > heap[i]) { int t=heap[i]; heap[i]=heap[(i-1)/2]; heap[(i-1)/2]=t; i=(i-1)/2; } }
int pop_max(int heap[], int *count) { int answer=heap[0]; heap[0]=heap[--(*count)]; for(int i=0;;){int l=2*i+1,r=l+1,b=i;if(l<*count&&heap[l]>heap[b])b=l;if(r<*count&&heap[r]>heap[b])b=r;if(b==i)break;int t=heap[i];heap[i]=heap[b];heap[b]=t;i=b;}return answer; }
int pop_min(int heap[], int *count) { int answer=heap[0]; heap[0]=heap[--(*count)]; for(int i=0;;){int l=2*i+1,r=l+1,b=i;if(l<*count&&heap[l]<heap[b])b=l;if(r<*count&&heap[r]<heap[b])b=r;if(b==i)break;int t=heap[i];heap[i]=heap[b];heap[b]=t;i=b;}return answer; }
void add_value(int value,int lower[],int *lc,int upper[],int *uc){if(!*lc||value<=lower[0])push_max(lower,lc,value);else push_min(upper,uc,value);if(*lc>*uc+1)push_min(upper,uc,pop_max(lower,lc));else if(*uc>*lc)push_max(lower,lc,pop_min(upper,uc));}`),
    sampleOutput: "5.0 10.0 5.0 4.0",
    time: "O(log n) per value",
    space: "O(n)",
    method: "Balance a max heap for the lower half with a min heap for the upper half."
  }),
  program({
    slug: "ads-merge-k-linked-lists-heap",
    title: "Merge K Sorted Linked Lists with a Heap",
    source: cMain(`    struct Node a3={7,NULL},a2={4,&a3},a1={1,&a2},b3={8,NULL},b2={5,&b3},b1={2,&b2},c3={9,NULL},c2={6,&c3},c1={3,&c2};
    struct Node *heads[] = {&a1,&b1,&c1};
    for (int out = 0; out < 9; out++) { int best = -1; for (int i = 0; i < 3; i++) if (heads[i] && (best < 0 || heads[i]->value < heads[best]->value)) best = i; printf("%d%c", heads[best]->value, out == 8 ? '\\n' : ' '); heads[best] = heads[best]->next; }
    return 0;`, ["stdio.h", "stddef.h"], `struct Node { int value; struct Node *next; };`),
    sampleOutput: "1 2 3 4 5 6 7 8 9",
    time: "O(total * k) demonstration",
    space: "O(k)",
    method: "Keep one candidate from each list and repeatedly advance the list containing the smallest head."
  }),
  program({
    slug: "ads-binomial-heap-link",
    title: "Link Equal-Degree Binomial Trees",
    source: cMain(`    struct Node first={10,0,NULL,NULL}, second={20,0,NULL,NULL};
    struct Node *root = link_trees(&first, &second);
    printf("Root = %d Degree = %d Child = %d\\n", root->key, root->degree, root->child->key); return 0;`, ["stdio.h", "stddef.h"], `struct Node { int key, degree; struct Node *child, *sibling; };
struct Node *link_trees(struct Node *first, struct Node *second) { if (first->key > second->key) { struct Node *t=first; first=second; second=t; } second->sibling=first->child; first->child=second; first->degree++; return first; }`),
    sampleOutput: "Root = 10 Degree = 1 Child = 20",
    time: "O(1) link",
    space: "O(1)",
    method: "Make the larger-key root a child of the smaller-key root and increase the resulting degree."
  }),
  program({
    slug: "ads-leftist-heap-merge",
    title: "Meld Two Leftist Heaps",
    source: cMain(`    struct Node *first=NULL,*second=NULL; int a[]={10,30,50},b[]={5,20,40};
    for(int i=0;i<3;i++){first=merge(first,new_node(a[i]));}
    for(int i=0;i<3;i++){second=merge(second,new_node(b[i]));}
    struct Node *root=merge(first,second); while(root){printf("%d%c",root->key,root->left||root->right?' ':'\\n');struct Node *old=root;root=merge(root->left,root->right);free(old);}return 0;`, ["stdio.h", "stdlib.h"], `struct Node{int key,npl;struct Node*left,*right;};int rank_node(struct Node*n){return n?n->npl:-1;}struct Node*new_node(int key){struct Node*n=calloc(1,sizeof*n);if(!n)exit(EXIT_FAILURE);n->key=key;return n;}struct Node*merge(struct Node*a,struct Node*b){if(!a)return b;if(!b)return a;if(a->key>b->key){struct Node*t=a;a=b;b=t;}a->right=merge(a->right,b);if(rank_node(a->left)<rank_node(a->right)){struct Node*t=a->left;a->left=a->right;a->right=t;}a->npl=rank_node(a->right)+1;return a;}`),
    sampleOutput: "5 10 20 30 40 50",
    time: "O(log n) meld",
    space: "O(log n)",
    method: "Recursively meld right paths and swap children to preserve the leftist null-path-length rule."
  }),
  program({
    slug: "ads-pairing-heap-meld",
    title: "Insert by Melding a Pairing Heap",
    source: cMain(`    int values[]={30,10,40,5,20};struct Node*root=NULL;for(int i=0;i<5;i++)root=meld(root,new_node(values[i]));printf("Minimum = %d\\n",root->key);free_heap(root);return 0;`, ["stdio.h", "stdlib.h"], `struct Node{int key;struct Node*child,*sibling;};struct Node*new_node(int key){struct Node*n=calloc(1,sizeof*n);if(!n)exit(EXIT_FAILURE);n->key=key;return n;}struct Node*meld(struct Node*a,struct Node*b){if(!a)return b;if(!b)return a;if(a->key>b->key){struct Node*t=a;a=b;b=t;}b->sibling=a->child;a->child=b;return a;}void free_heap(struct Node*n){if(n){free_heap(n->child);free_heap(n->sibling);free(n);}}`),
    sampleOutput: "Minimum = 5",
    time: "O(1) amortized insertion",
    space: "O(n)",
    method: "Attach the larger root beneath the smaller root; pairing during deletion restores structure."
  }),
  program({
    slug: "ads-fibonacci-heap-decrease-key-cut",
    title: "Demonstrate a Fibonacci Heap Cut",
    source: cMain(`    struct Node parent={10,NULL,NULL,NULL}, child={30,&parent,NULL,NULL};parent.child=&child;
    child.key=5;if(child.key<parent.key){parent.child=NULL;child.parent=NULL;child.next=&parent;}
    printf("New root = %d Cut = %s\\n",child.key,child.parent?"No":"Yes");return 0;`, ["stdio.h", "stddef.h"], `struct Node{int key;struct Node*parent,*child,*next;};`),
    sampleOutput: "New root = 5 Cut = Yes",
    time: "O(1) amortized decrease-key",
    space: "O(1)",
    method: "Cut a node whose decreased key violates heap order and move it to the root list."
  })
];
