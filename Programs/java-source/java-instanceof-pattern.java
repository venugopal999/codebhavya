class Person {} class Student extends Person { String course="Java"; }
class Main { public static void main(String[] args){Person person=new Student();if(person instanceof Student student)System.out.println(student.course);} }
