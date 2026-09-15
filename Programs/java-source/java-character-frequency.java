import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        String text="banana";
        java.util.Map<Character,Integer> count=new java.util.TreeMap<>();
        for(char ch:text.toCharArray())count.merge(ch,1,Integer::sum);
        System.out.println(count);
    }
}
