class Person { String role(){return "Person";} } class Student extends Person { @Override String role(){return "Student";} }
class Main { public static void main(String[] args){System.out.println(new Student().role());} }
