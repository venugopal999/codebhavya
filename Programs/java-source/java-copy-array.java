class Main {
    public static void main(String[] args) throws Exception {
        int[] original={3,6,9};
        int[] copy=java.util.Arrays.copyOf(original,original.length);
        copy[0]=30;
        System.out.println(java.util.Arrays.toString(original));
        System.out.println(java.util.Arrays.toString(copy));
    }
}
