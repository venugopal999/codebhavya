class Student { static String college="CodeBhavya"; String name; Student(String name){this.name=name;} }
class Main { public static void main(String[] args){Student first=new Student("Asha");Student second=new Student("Ravi");System.out.println(first.name+" "+second.name+" "+Student.college);} }
