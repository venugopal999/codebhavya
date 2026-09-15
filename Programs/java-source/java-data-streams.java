import java.io.*;
class Main{public static void main(String[] args)throws Exception{try(DataOutputStream out=new DataOutputStream(new FileOutputStream("score.dat"))){out.writeUTF("Asha");out.writeInt(92);}try(DataInputStream in=new DataInputStream(new FileInputStream("score.dat"))){System.out.println(in.readUTF()+" "+in.readInt());}}}
