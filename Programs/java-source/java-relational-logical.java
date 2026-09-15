class Main {
    public static void main(String[] args) throws Exception {
        int age = 20;
        boolean hasId = true;
        System.out.println(age >= 18 && hasId);
        System.out.println(age < 18 || !hasId);
    }
}
