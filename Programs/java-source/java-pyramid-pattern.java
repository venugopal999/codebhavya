class Main {
    public static void main(String[] args) throws Exception {
        int n=4;
        for(int row=1;row<=n;row++){ for(int s=0;s<n-row;s++) System.out.print(" "); for(int c=0;c<2*row-1;c++) System.out.print("*"); System.out.println(); }
    }
}
