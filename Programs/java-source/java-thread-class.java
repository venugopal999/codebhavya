class Worker extends Thread{public void run(){System.out.println("Worker running");}}
class Main{public static void main(String[] args)throws Exception{Worker worker=new Worker();worker.start();worker.join();}}
