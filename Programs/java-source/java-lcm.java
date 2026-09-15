class Main {
    public static void main(String[] args) throws Exception {
        int a = 12, b = 18, x = a, y = b;
        while (y != 0) { int r = x % y; x = y; y = r; }
        System.out.println(Math.abs(a * b) / x);
    }
}
