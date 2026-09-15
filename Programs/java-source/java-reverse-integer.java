class Main {
    public static void main(String[] args) throws Exception {
        int number = 1234, reversed = 0;
        while (number != 0) { reversed = reversed * 10 + number % 10; number /= 10; }
        System.out.println(reversed);
    }
}
