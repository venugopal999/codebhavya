import java.util.concurrent.atomic.*;
class Main{public static void main(String[] args)throws Exception{AtomicInteger count=new AtomicInteger();Thread a=new Thread(()->{for(int i=0;i<500;i++)count.incrementAndGet();});Thread b=new Thread(()->{for(int i=0;i<500;i++)count.incrementAndGet();});a.start();b.start();a.join();b.join();System.out.println(count.get());}}
