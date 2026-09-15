import java.util.*;import java.util.stream.*;
class Main{public static void main(String[] args){Map<Integer,List<String>> groups=List.of("C","Java","Python","SQL").stream().collect(Collectors.groupingBy(String::length,TreeMap::new,Collectors.toList()));System.out.println(groups);}}
