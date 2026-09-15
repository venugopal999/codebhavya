class Account { private double balance; Account(double balance){this.balance=balance;} void deposit(double amount){if(amount>0)balance+=amount;} double getBalance(){return balance;} }
class Main { public static void main(String[] args){Account account=new Account(1000);account.deposit(500);System.out.println(account.getBalance());} }
