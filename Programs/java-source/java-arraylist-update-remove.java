import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        List<Integer> values=new ArrayList<>(List.of(10,20,30));
        values.set(1,25);values.remove(Integer.valueOf(10));
        System.out.println(values);
    }
}
