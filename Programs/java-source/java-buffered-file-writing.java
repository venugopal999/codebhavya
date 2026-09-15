import java.io.*;import java.nio.file.*;
class Main{public static void main(String[] args)throws Exception{Path path=Path.of("marks.txt");try(BufferedWriter writer=Files.newBufferedWriter(path)){writer.write("Asha 92");writer.newLine();}System.out.print(Files.readString(path));}}
