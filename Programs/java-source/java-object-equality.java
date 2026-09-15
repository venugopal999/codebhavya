import java.util.Objects;
class Student { int id; Student(int id){this.id=id;} public boolean equals(Object other){return other instanceof Student s&&id==s.id;} public int hashCode(){return Objects.hash(id);} }
class Main { public static void main(String[] args){System.out.println(new Student(7).equals(new Student(7)));} }
