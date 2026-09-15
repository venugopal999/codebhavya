interface Greeting { default String greet(){return "Hello";} } class Student implements Greeting {}
class Main { public static void main(String[] args){System.out.println(new Student().greet());} }
