import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        TreeMap<Integer,String> marks=new TreeMap<>();marks.put(80,"B");marks.put(95,"A+");marks.put(70,"C");
        System.out.println(marks.firstKey()+" "+marks.lastKey()+" "+marks.ceilingKey(82));
    }
}
