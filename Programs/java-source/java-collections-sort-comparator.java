import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        record Student(String name,int mark){}
        List<Student> students=new ArrayList<>(List.of(new Student("Asha",82),new Student("Ravi",91)));
        students.sort(Comparator.comparingInt(Student::mark).reversed());
        for(Student student:students)System.out.println(student.name()+" "+student.mark());
    }
}
