import java.util.*;
class Main{public static void main(String[] args){Optional<String> course=Optional.of("Java");System.out.println(course.map(String::toUpperCase).orElse("NONE"));}}
