class Living { String state(){return "Living";} } class Person extends Living {} class Student extends Person {}
class Main { public static void main(String[] args){System.out.println(new Student().state());} }
