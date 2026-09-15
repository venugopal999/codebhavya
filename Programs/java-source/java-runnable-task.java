class Main{public static void main(String[] args)throws Exception{Thread worker=new Thread(()->System.out.println("Task running"));worker.start();worker.join();}}
