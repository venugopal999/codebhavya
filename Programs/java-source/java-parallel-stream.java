import java.util.stream.*;
class Main{public static void main(String[] args){int sum=IntStream.rangeClosed(1,100).parallel().sum();System.out.println(sum);}}
