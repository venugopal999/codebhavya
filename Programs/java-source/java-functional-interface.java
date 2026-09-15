@FunctionalInterface interface Operation { int apply(int a,int b); }
class Main { public static void main(String[] args){Operation add=(a,b)->a+b;System.out.println(add.apply(7,8));} }
