class Main {
    public static void main(String[] args) throws Exception {
        int mark = 84;
        char grade;
        if (mark >= 90) grade = 'A';
        else if (mark >= 75) grade = 'B';
        else if (mark >= 60) grade = 'C';
        else grade = 'D';
        System.out.println(grade);
    }
}
