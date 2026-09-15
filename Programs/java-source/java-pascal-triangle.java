class Main {
    public static void main(String[] args) throws Exception {
        for(int row=0;row<5;row++){ int value=1; for(int col=0;col<=row;col++){ System.out.print(value+" "); value=value*(row-col)/(col+1); } System.out.println(); }
    }
}
