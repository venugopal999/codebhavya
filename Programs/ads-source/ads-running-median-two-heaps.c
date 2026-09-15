#include <stdio.h>

void push_max(int heap[], int *count, int value) { int i = (*count)++; heap[i] = value; while (i && heap[(i-1)/2] < heap[i]) { int t=heap[i]; heap[i]=heap[(i-1)/2]; heap[(i-1)/2]=t; i=(i-1)/2; } }
void push_min(int heap[], int *count, int value) { int i = (*count)++; heap[i] = value; while (i && heap[(i-1)/2] > heap[i]) { int t=heap[i]; heap[i]=heap[(i-1)/2]; heap[(i-1)/2]=t; i=(i-1)/2; } }
int pop_max(int heap[], int *count) { int answer=heap[0]; heap[0]=heap[--(*count)]; for(int i=0;;){int l=2*i+1,r=l+1,b=i;if(l<*count&&heap[l]>heap[b])b=l;if(r<*count&&heap[r]>heap[b])b=r;if(b==i)break;int t=heap[i];heap[i]=heap[b];heap[b]=t;i=b;}return answer; }
int pop_min(int heap[], int *count) { int answer=heap[0]; heap[0]=heap[--(*count)]; for(int i=0;;){int l=2*i+1,r=l+1,b=i;if(l<*count&&heap[l]<heap[b])b=l;if(r<*count&&heap[r]<heap[b])b=r;if(b==i)break;int t=heap[i];heap[i]=heap[b];heap[b]=t;i=b;}return answer; }
void add_value(int value,int lower[],int *lc,int upper[],int *uc){if(!*lc||value<=lower[0])push_max(lower,lc,value);else push_min(upper,uc,value);if(*lc>*uc+1)push_min(upper,uc,pop_max(lower,lc));else if(*uc>*lc)push_max(lower,lc,pop_min(upper,uc));}

int main(void)
{
    int stream[] = {5, 15, 1, 3}, lower[10], upper[10], lower_count = 0, upper_count = 0;
    for (int i = 0; i < 4; i++) { add_value(stream[i], lower, &lower_count, upper, &upper_count); if (lower_count == upper_count) printf("%.1f", (lower[0] + upper[0]) / 2.0); else printf("%.1f", lower[0] * 1.0); printf("%c", i == 3 ? '\n' : ' '); }
    return 0;
}
