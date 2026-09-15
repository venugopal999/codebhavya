class Box<T>{private final T value;Box(T value){this.value=value;}T get(){return value;}}
class Main{public static void main(String[] args){Box<Integer> box=new Box<>(42);System.out.println(box.get());}}
