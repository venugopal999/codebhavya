import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        Set<Integer> unique=new HashSet<>(List.of(3,1,3,2,1));
        List<Integer> sorted=new ArrayList<>(unique);Collections.sort(sorted);
        System.out.println(sorted);
    }
}
