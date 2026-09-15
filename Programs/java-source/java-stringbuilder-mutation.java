class Main {
    public static void main(String[] args) throws Exception {
        StringBuilder result=new StringBuilder();
        for(int i=1;i<=4;i++)result.append(i).append(i<4?"-":"");
        System.out.println(result);
    }
}
