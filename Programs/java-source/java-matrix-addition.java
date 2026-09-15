class Main {
    public static void main(String[] args) throws Exception {
        int[][] a={{1,2},{3,4}},b={{5,6},{7,8}},sum=new int[2][2];
        for(int i=0;i<2;i++)for(int j=0;j<2;j++)sum[i][j]=a[i][j]+b[i][j];
        for(int[] row:sum)System.out.println(java.util.Arrays.toString(row));
    }
}
