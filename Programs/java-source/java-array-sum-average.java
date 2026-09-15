class Main {
    public static void main(String[] args) throws Exception {
        int[] values={10,20,30,40}; int sum=0;
        for(int value:values) sum+=value;
        System.out.println(sum+" "+(sum/(double)values.length));
    }
}
