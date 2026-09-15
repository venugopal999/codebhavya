class Main {
    public static void main(String[] args) throws Exception {
        int[] values={9,2,7,9,5}; int largest=Integer.MIN_VALUE,second=Integer.MIN_VALUE;
        for(int value:values){if(value>largest){second=largest;largest=value;}else if(value>second&&value!=largest)second=value;}
        System.out.println(second);
    }
}
