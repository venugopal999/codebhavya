import java.util.*;
class Main{static double sum(List<? extends Number> values){double total=0;for(Number value:values)total+=value.doubleValue();return total;}public static void main(String[] args){System.out.println(sum(List.of(2,4,6)));}}
