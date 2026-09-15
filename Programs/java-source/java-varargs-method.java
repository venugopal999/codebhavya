class Main {
    static int total(int... values) { int sum=0; for(int value:values)sum+=value; return sum; }
    public static void main(String[] args) {
        System.out.println(total(2,4,6,8));
    }
}
