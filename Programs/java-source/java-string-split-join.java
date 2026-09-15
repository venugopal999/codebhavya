class Main {
    public static void main(String[] args) throws Exception {
        String text="learn build share";
        String[] words=text.split(" ");
        System.out.println(String.join("-",words));
    }
}
