import java.util.stream.*;
class Main{public static void main(String[] args){int sum=IntStream.rangeClosed(1,10).reduce(0,Integer::sum);System.out.println(sum);}}
