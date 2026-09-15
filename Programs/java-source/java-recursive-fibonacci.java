class Main {
    static int fibonacci(int n) { return n<2?n:fibonacci(n-1)+fibonacci(n-2); }
    public static void main(String[] args) {
        System.out.println(fibonacci(8));
    }
}
