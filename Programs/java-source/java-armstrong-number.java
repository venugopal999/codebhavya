class Main {
    public static void main(String[] args) throws Exception {
        int number = 153, copy = number, sum = 0;
        while (copy != 0) { int digit = copy % 10; sum += digit * digit * digit; copy /= 10; }
        System.out.println(sum == number);
    }
}
