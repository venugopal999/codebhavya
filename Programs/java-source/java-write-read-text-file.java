import java.nio.file.*;
class Main{public static void main(String[] args)throws Exception{Path path=Path.of("lesson.txt");Files.writeString(path,"Learn Java");System.out.println(Files.readString(path));}}
