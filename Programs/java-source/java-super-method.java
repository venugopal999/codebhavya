class Message { String text(){return "Learn";} } class ExtendedMessage extends Message { String text(){return super.text()+" Java";} }
class Main { public static void main(String[] args){System.out.println(new ExtendedMessage().text());} }
