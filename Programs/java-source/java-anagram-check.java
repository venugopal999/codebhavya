class Main {
    public static void main(String[] args) throws Exception {
        char[] first="listen".toCharArray(),second="silent".toCharArray();
        java.util.Arrays.sort(first);java.util.Arrays.sort(second);
        System.out.println(java.util.Arrays.equals(first,second));
    }
}
