class Main {
    public static void main(String[] args) throws Exception {
        int number = 1221, copy = number, reversed = 0;
        while (copy != 0) { reversed = reversed * 10 + copy % 10; copy /= 10; }
        System.out.println(number == reversed);
    }
}
