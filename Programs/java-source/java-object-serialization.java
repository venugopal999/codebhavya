import java.io.*;
record Student(String name,int mark) implements Serializable{}
class Main{public static void main(String[] args)throws Exception{try(ObjectOutputStream out=new ObjectOutputStream(new FileOutputStream("student.dat"))){out.writeObject(new Student("Ravi",91));}try(ObjectInputStream in=new ObjectInputStream(new FileInputStream("student.dat"))){Student student=(Student)in.readObject();System.out.println(student.name()+" "+student.mark());}}}
