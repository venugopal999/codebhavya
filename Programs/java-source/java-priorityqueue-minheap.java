import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        PriorityQueue<Integer> queue=new PriorityQueue<>(List.of(7,2,9,4));
        while(!queue.isEmpty())System.out.print(queue.poll()+" ");
    }
}
