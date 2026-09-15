class Account { protected int balance=1000; } class Savings extends Account { void addInterest(){balance+=100;} }
class Main { public static void main(String[] args){Savings savings=new Savings();savings.addInterest();System.out.println(savings.balance);} }
