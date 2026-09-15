class Animal { String sound(){return "?";} } class Dog extends Animal { String sound(){return "Bark";} }
class Main { public static void main(String[] args){Animal animal=new Dog();System.out.println(animal.sound());} }
