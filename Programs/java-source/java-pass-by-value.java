class Main {
    static void change(int value) { value = 99; }
    public static void main(String[] args) {
        int number=10;
        change(number);
        System.out.println(number);
    }
}
