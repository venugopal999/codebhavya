enum Status { NEW,IN_PROGRESS,DONE }
class Main { public static void main(String[] args){Status status=Status.DONE;String text=switch(status){case NEW->"Start";case IN_PROGRESS->"Continue";case DONE->"Complete";};System.out.println(text);} }
