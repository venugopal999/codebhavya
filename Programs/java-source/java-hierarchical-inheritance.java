class Shape { String type(){return "Shape";} } class Circle extends Shape {} class Square extends Shape {}
class Main { public static void main(String[] args){System.out.println(new Circle().type()+" "+new Square().type());} }
