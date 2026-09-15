class Main {
    public static void main(String[] args) throws Exception {
        String text="Artificial Intelligence".toLowerCase(); int count=0;
        for(char ch:text.toCharArray())if("aeiou".indexOf(ch)>=0)count++;
        System.out.println(count);
    }
}
