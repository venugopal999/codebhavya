final class Point { private final int x,y; Point(int x,int y){this.x=x;this.y=y;} int x(){return x;} int y(){return y;} }
class Main { public static void main(String[] args){Point point=new Point(3,4);System.out.println(point.x()+" "+point.y());} }
