class Person { String name; Person(String name){this.name=name;} } class Student extends Person { int mark; Student(String name,int mark){super(name);this.mark=mark;} }
class Main { public static void main(String[] args){Student s=new Student("Asha",90);System.out.println(s.name+" "+s.mark);} }
