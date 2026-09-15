class Main {
    public static void main(String[] args) throws Exception {
        int n=3;
        for(int row=1;row<=n;row++){ System.out.print(" ".repeat(n-row)); System.out.println("*".repeat(2*row-1)); }
        for(int row=n-1;row>=1;row--){ System.out.print(" ".repeat(n-row)); System.out.println("*".repeat(2*row-1)); }
    }
}
