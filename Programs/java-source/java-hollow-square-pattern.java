class Main {
    public static void main(String[] args) throws Exception {
        int n=4;
        for(int row=1;row<=n;row++){ for(int col=1;col<=n;col++) System.out.print(row==1||row==n||col==1||col==n?"* ":"  "); System.out.println(); }
    }
}
