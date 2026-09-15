class Main {
    static int area(int side) { return side * side; }
    static int area(int length, int width) { return length * width; }
    public static void main(String[] args) {
        System.out.println(area(4));
        System.out.println(area(4, 6));
    }
}
