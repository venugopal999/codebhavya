interface Readable { String read(); } interface Writable { String write(); } class Document implements Readable,Writable { public String read(){return "Read";} public String write(){return "Write";} }
class Main { public static void main(String[] args){Document d=new Document();System.out.println(d.read()+" "+d.write());} }
