import java.io.*;import java.nio.file.*;
class Main{public static void main(String[] args)throws Exception{Path path=Path.of("topics.txt");Files.writeString(path,"Basics\nLoops\nMethods\n");try(BufferedReader reader=Files.newBufferedReader(path)){String line;while((line=reader.readLine())!=null)System.out.println(line);}}}
