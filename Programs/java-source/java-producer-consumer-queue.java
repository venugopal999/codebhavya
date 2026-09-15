import java.util.concurrent.*;
class Main{public static void main(String[] args)throws Exception{BlockingQueue<String> queue=new ArrayBlockingQueue<>(2);Thread producer=new Thread(()->{try{queue.put("Java");}catch(InterruptedException e){Thread.currentThread().interrupt();}});producer.start();System.out.println(queue.take());producer.join();}}
