class Main {
    public static void main(String[] args) throws Exception {
        Integer boxed = 25;
        int primitive = boxed;
        System.out.println(boxed.getClass().getSimpleName() + " " + primitive);
    }
}
