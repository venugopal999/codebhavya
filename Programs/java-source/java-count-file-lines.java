import java.nio.file.*;
class Main{public static void main(String[] args)throws Exception{Path path=Path.of("data.txt");Files.writeString(path,"A\nB\nC\n");try(var lines=Files.lines(path)){System.out.println(lines.count());}}}
