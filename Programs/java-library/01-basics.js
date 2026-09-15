"use strict";
const { main, makeJava } = require("./helpers");
const T = "Level 01 — Basics & Input/Output";
const e = (slug,title,body,out,concepts,extra={}) => makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:main(body,extra.imports||""),sampleOutput:out,concepts,...extra});
module.exports = [
 e("hello-world","Display Hello World",'System.out.println("Hello, World!");',"Hello, World!",["main()","System.out.println()"],{featured:true}),
 e("print-multiple-lines","Print Multiple Lines",'System.out.println("Learn");\nSystem.out.println("Practice");\nSystem.out.println("Grow");',"Learn\nPractice\nGrow",["println()","Output"]),
 e("formatted-output","Format Output with printf",'String course = "Java";\nint level = 1;\nSystem.out.printf("%s Level %d%n", course, level);',"Java Level 1",["printf()","Format specifiers"]),
 e("read-integer","Read an Integer",'java.util.Scanner input = new java.util.Scanner(System.in);\nint value = input.nextInt();\nSystem.out.println("Value = " + value);',"Value = 42",["Scanner","nextInt()"],{sampleInput:"42"}),
 e("read-two-numbers","Read and Add Two Integers",'java.util.Scanner input = new java.util.Scanner(System.in);\nint first = input.nextInt();\nint second = input.nextInt();\nSystem.out.println("Sum = " + (first + second));',"Sum = 25",["Scanner","Addition"],{sampleInput:"10 15"}),
 e("read-text-line","Read a Complete Text Line",'java.util.Scanner input = new java.util.Scanner(System.in);\nString name = input.nextLine();\nSystem.out.println("Welcome, " + name + "!");',"Welcome, Bhavya!",["nextLine()","String input"],{sampleInput:"Bhavya"}),
 e("command-line-arguments","Read Command-line Style Arguments",'String[] values = {"Java", "17"};\nSystem.out.println(values[0] + " " + values[1]);',"Java 17",["String[]","Arguments"]),
 e("escape-sequences","Display Escape Sequences",'System.out.println("Name:\\tBhavya\\nCourse:\\tJava");',"Name: Bhavya\nCourse: Java",["Escape sequences","String literal"]),
 e("unicode-output","Display a Unicode Character",'char symbol = \'\\u2605\';\nSystem.out.println("Java " + symbol);',"Java ★",["Unicode","char"]),
 e("buffered-reader-input","Read Input with BufferedReader",'java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));\nint number = Integer.parseInt(reader.readLine());\nSystem.out.println(number * number);',"49",["BufferedReader","Integer.parseInt()"],{sampleInput:"7"})
];
