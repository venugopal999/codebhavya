class Outer { int value=42; class Inner { int read(){return value;} } }
class Main { public static void main(String[] args){Outer outer=new Outer();System.out.println(outer.new Inner().read());} }
