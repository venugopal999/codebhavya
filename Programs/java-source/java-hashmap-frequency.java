import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        String text="banana";Map<Character,Integer> count=new TreeMap<>();
        for(char ch:text.toCharArray())count.merge(ch,1,Integer::sum);
        System.out.println(count);
    }
}
