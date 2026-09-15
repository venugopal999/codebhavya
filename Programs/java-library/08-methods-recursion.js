"use strict";
const { clean, makeJava }=require("./helpers");
const T="Level 08 — Methods & Recursion";
const wrap=(members,call)=>clean(`class Main {\n${members}\n    public static void main(String[] args) {\n        ${call}\n    }\n}`);
const e=(slug,title,members,call,out,concepts,extra={})=>makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:wrap(members,call),sampleOutput:out,concepts,...extra});
module.exports=[
 e("simple-method","Define and Call a Method",'    static String message() { return "Practice daily"; }','System.out.println(message());',"Practice daily",["static method","return"]),
 e("method-parameters","Pass Method Parameters",'    static int add(int a, int b) { return a + b; }','System.out.println(add(12, 8));',"20",["Parameters","Arguments"]),
 e("method-overloading","Overload a Method",'    static int area(int side) { return side * side; }\n    static int area(int length, int width) { return length * width; }','System.out.println(area(4));\n        System.out.println(area(4, 6));',"16\n24",["Method overloading","Signature"],{difficulty:"Intermediate"}),
 e("varargs-method","Accept Variable Arguments",'    static int total(int... values) { int sum=0; for(int value:values)sum+=value; return sum; }','System.out.println(total(2,4,6,8));',"20",["varargs","Array"]),
 e("pass-by-value","Demonstrate Pass by Value",'    static void change(int value) { value = 99; }','int number=10;\n        change(number);\n        System.out.println(number);',"10",["Pass by value","Primitive"]),
 e("return-array","Return an Array from a Method",'    static int[] pair() { return new int[]{4,9}; }','System.out.println(java.util.Arrays.toString(pair()));',"[4, 9]",["Array return","Method"]),
 e("recursive-factorial","Calculate Factorial Recursively",'    static long factorial(int n) { return n<=1?1:n*factorial(n-1); }','System.out.println(factorial(5));',"120",["Recursion","Base case"],{difficulty:"Intermediate",time:"O(n)",space:"O(n)"}),
 e("recursive-fibonacci","Find Fibonacci Recursively",'    static int fibonacci(int n) { return n<2?n:fibonacci(n-1)+fibonacci(n-2); }','System.out.println(fibonacci(8));',"21",["Recursion","Fibonacci"],{difficulty:"Intermediate",time:"O(2ⁿ)",space:"O(n)"}),
 e("recursive-sum","Sum Natural Numbers Recursively",'    static int sum(int n) { return n==0?0:n+sum(n-1); }','System.out.println(sum(10));',"55",["Recursion","Reduction"],{difficulty:"Intermediate",time:"O(n)",space:"O(n)"}),
 e("recursive-gcd","Find GCD Recursively",'    static int gcd(int a,int b) { return b==0?a:gcd(b,a%b); }','System.out.println(gcd(48,18));',"6",["Euclid algorithm","Recursion"],{difficulty:"Intermediate",time:"O(log n)",space:"O(log n)"}),
 e("recursive-string-reverse","Reverse a String Recursively",'    static String reverse(String text) { return text.isEmpty()?text:reverse(text.substring(1))+text.charAt(0); }','System.out.println(reverse("Java"));',"avaJ",["String recursion","substring()"],{difficulty:"Intermediate",time:"O(n²)",space:"O(n²)"}),
 e("recursive-binary-search","Perform Recursive Binary Search",'    static int search(int[] a,int target,int low,int high){if(low>high)return -1;int mid=(low+high)/2;if(a[mid]==target)return mid;return a[mid]<target?search(a,target,mid+1,high):search(a,target,low,mid-1);}','int[] values={2,5,8,12,16};\n        System.out.println(search(values,12,0,values.length-1));',"3",["Binary search","Recursion"],{difficulty:"Advanced",time:"O(log n)",space:"O(log n)"})
];
