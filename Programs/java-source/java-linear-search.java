class Main {
    public static void main(String[] args) throws Exception {
        int[] values={8,3,11,6}; int target=11,index=-1;
        for(int i=0;i<values.length;i++) if(values[i]==target){index=i;break;}
        System.out.println(index);
    }
}
