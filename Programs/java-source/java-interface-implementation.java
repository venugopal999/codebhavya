interface Printable { void print(); } class Report implements Printable { public void print(){System.out.println("Report ready");} }
class Main { public static void main(String[] args){new Report().print();} }
