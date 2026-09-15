class Address { String city; Address(String city){this.city=city;} }
class Student { String name; Address address; Student(String name,Address address){this.name=name;this.address=address;} }
class Main { public static void main(String[] args){Student student=new Student("Asha",new Address("Hyderabad"));System.out.println(student.name+" - "+student.address.city);} }
