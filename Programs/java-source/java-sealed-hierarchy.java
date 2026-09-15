sealed interface Result permits Success,Failure {} record Success(String value) implements Result {} record Failure(String reason) implements Result {}
class Main { public static void main(String[] args){Result result=new Success("Saved");System.out.println(result instanceof Success s?s.value():"Failed");} }
