class Main {
    public static void main(String[] args) throws Exception {
        String text="level";
        String reversed=new StringBuilder(text).reverse().toString();
        System.out.println(text.equals(reversed));
    }
}
