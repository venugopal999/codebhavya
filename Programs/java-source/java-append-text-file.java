import java.nio.file.*;
class Main{public static void main(String[] args)throws Exception{Path path=Path.of("notes.txt");Files.writeString(path,"C\n");Files.writeString(path,"Java\n",StandardOpenOption.APPEND);System.out.print(Files.readString(path));}}
