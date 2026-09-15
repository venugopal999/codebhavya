class Student { String name; int mark; Student(String n,int m){name=n;mark=m;} }
class Main { public static void main(String[] args){Student[] students={new Student("Asha",82),new Student("Ravi",91)};for(Student s:students)System.out.println(s.name+" "+s.mark);} }
