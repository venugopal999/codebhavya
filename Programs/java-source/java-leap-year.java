class Main {
    public static void main(String[] args) throws Exception {
        int year = 2024;
        boolean leap = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
        System.out.println(leap);
    }
}
