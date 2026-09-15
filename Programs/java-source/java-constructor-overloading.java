class Box { int length,width; Box(){this(1,1);} Box(int length,int width){this.length=length;this.width=width;} int area(){return length*width;} }
class Main { public static void main(String[] args){System.out.println(new Box().area()+" "+new Box(4,5).area());} }
