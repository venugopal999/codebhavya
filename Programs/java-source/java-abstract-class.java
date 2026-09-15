abstract class Shape { abstract double area(); } class Circle extends Shape { double r; Circle(double r){this.r=r;} double area(){return Math.PI*r*r;} }
class Main { public static void main(String[] args){System.out.printf("%.2f%n",new Circle(2).area());} }
