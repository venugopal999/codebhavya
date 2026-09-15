class AttendanceException extends Exception { AttendanceException(String message){super(message);} }
class Main { static void check(int attendance)throws AttendanceException{if(attendance<75)throw new AttendanceException("Attendance below 75%");} public static void main(String[] args){try{check(60);}catch(AttendanceException error){System.out.println(error.getMessage());}} }
