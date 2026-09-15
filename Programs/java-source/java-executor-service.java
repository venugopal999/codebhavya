import java.util.concurrent.*;
class Main{public static void main(String[] args)throws Exception{ExecutorService pool=Executors.newSingleThreadExecutor();Future<Integer> result=pool.submit(()->21*2);System.out.println(result.get());pool.shutdown();}}
