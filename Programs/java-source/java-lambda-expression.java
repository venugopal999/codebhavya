interface Operation{int apply(int a,int b);}
class Main{public static void main(String[] args){Operation multiply=(a,b)->a*b;System.out.println(multiply.apply(6,7));}}
