class Main {
    public static void main(String[] args) throws Exception {
        int value=1;
        for(int row=1;row<=4;row++){ for(int col=1;col<=row;col++) System.out.print(value+++" "); System.out.println(); }
    }
}
