class Main {
    public static void main(String[] args) throws Exception {
        int[] values={7,2,9,4}; int min=values[0],max=values[0];
        for(int value:values){ if(value<min)min=value; if(value>max)max=value; }
        System.out.println(min+" "+max);
    }
}
