import java.nio.file.*;import java.util.*;
class Main{public static void main(String[] args)throws Exception{Path dir=Path.of("demo");Files.createDirectories(dir);Files.writeString(dir.resolve("a.txt"),"A");Files.writeString(dir.resolve("b.txt"),"B");try(var paths=Files.list(dir)){paths.map(p->p.getFileName().toString()).sorted().forEach(System.out::println);}}}
