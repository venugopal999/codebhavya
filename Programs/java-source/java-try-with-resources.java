class Resource implements AutoCloseable { public void close(){System.out.println("Closed");} void use(){System.out.println("Used");} }
class Main { public static void main(String[] args){try(Resource resource=new Resource()){resource.use();}} }
