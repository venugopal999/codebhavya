import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        int[] values={3,1,3,2,1};
        java.util.Set<Integer> unique=new java.util.LinkedHashSet<>();
        for(int value:values)unique.add(value);
        System.out.println(unique);
    }
}
