class Main {
    public static void main(String[] args) throws Exception {
        int day = 2;
        String name = switch (day) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            default -> "Unknown";
        };
        System.out.println(name);
    }
}
