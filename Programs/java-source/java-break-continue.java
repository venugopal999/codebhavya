class Main {
    public static void main(String[] args) throws Exception {
        for (int i = 1; i <= 10; i++) {
            if (i == 3) continue;
            if (i == 7) break;
            System.out.print(i + " ");
        }
    }
}
