class Main {
    public static void main(String[] args) throws Exception {
        int[][] a={{1,2},{3,4}},b={{2,0},{1,2}},result=new int[2][2];
        for(int i=0;i<2;i++)for(int j=0;j<2;j++)for(int k=0;k<2;k++)result[i][j]+=a[i][k]*b[k][j];
        for(int[] row:result)System.out.println(java.util.Arrays.toString(row));
    }
}
