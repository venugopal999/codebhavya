import java.util.*;
class Main{public static void main(String[] args){List<Integer> result=List.of(1,2,3,4,5,6).stream().filter(n->n%2==0).map(n->n*n).toList();System.out.println(result);}}
