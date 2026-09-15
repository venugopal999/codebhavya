class Main {
    public static void main(String[] args) throws Exception {
        int a = 48, b = 18;
        while (b != 0) { int remainder = a % b; a = b; b = remainder; }
        System.out.println(a);
    }
}
