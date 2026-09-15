class Main {
    public static void main(String[] args) throws Exception {
        int[] values={1,2,3,4,5}; int first=values[0];
        for(int i=0;i<values.length-1;i++)values[i]=values[i+1];
        values[values.length-1]=first;
        System.out.println(java.util.Arrays.toString(values));
    }
}
