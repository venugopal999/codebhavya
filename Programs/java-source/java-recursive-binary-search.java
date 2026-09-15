class Main {
    static int search(int[] a,int target,int low,int high){if(low>high)return -1;int mid=(low+high)/2;if(a[mid]==target)return mid;return a[mid]<target?search(a,target,mid+1,high):search(a,target,low,mid-1);}
    public static void main(String[] args) {
        int[] values={2,5,8,12,16};
        System.out.println(search(values,12,0,values.length-1));
    }
}
