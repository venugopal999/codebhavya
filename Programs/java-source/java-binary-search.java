class Main {
    public static void main(String[] args) throws Exception {
        int[] values={2,5,8,12,16}; int target=12,low=0,high=values.length-1,result=-1;
        while(low<=high){int mid=low+(high-low)/2;if(values[mid]==target){result=mid;break;}if(values[mid]<target)low=mid+1;else high=mid-1;}
        System.out.println(result);
    }
}
