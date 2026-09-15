interface Message { String text(); }
class Main { public static void main(String[] args){Message message=new Message(){public String text(){return "Anonymous implementation";}};System.out.println(message.text());} }
