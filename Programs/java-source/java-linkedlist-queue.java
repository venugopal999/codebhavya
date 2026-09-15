import java.util.*;

class Main {
    public static void main(String[] args) throws Exception {
        LinkedList<String> queue=new LinkedList<>();
        queue.offer("A");queue.offer("B");queue.offer("C");
        System.out.println(queue.poll()+" "+queue);
    }
}
