class Rule { final String policy(){return "Fixed";} } class Child extends Rule {}
class Main { public static void main(String[] args){System.out.println(new Child().policy());} }
