class Main {
    public static void main(String[] args) throws Exception {
        int first = 0, second = 1;
        for (int i = 0; i < 8; i++) {
            System.out.print(first + " ");
            int next = first + second; first = second; second = next;
        }
    }
}
