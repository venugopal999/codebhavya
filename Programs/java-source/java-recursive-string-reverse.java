class Main {
    static String reverse(String text) { return text.isEmpty()?text:reverse(text.substring(1))+text.charAt(0); }
    public static void main(String[] args) {
        System.out.println(reverse("Java"));
    }
}
