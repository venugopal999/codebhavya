"use strict";
const { main, makeJava } = require("./helpers");
const T="Level 04 — Loops & Number Problems";
const e=(slug,title,body,out,concepts,extra={})=>makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:main(body),sampleOutput:out,concepts,...extra});
module.exports=[
 e("for-loop-range","Print a Range with for",'for (int i = 1; i <= 5; i++) System.out.print(i + " ");',"1 2 3 4 5",["for loop","Counter"]),
 e("while-countdown","Create a while Countdown",'int value = 5;\nwhile (value > 0) System.out.print(value-- + " ");',"5 4 3 2 1",["while loop","Decrement"]),
 e("do-while-menu","Run a do-while Loop Once",'int choice = 0;\ndo {\n    System.out.println("Menu displayed");\n    choice++;\n} while (choice < 1);',"Menu displayed",["do-while","Post-test loop"]),
 e("sum-natural-numbers","Sum Natural Numbers",'int total = 0;\nfor (int i = 1; i <= 10; i++) total += i;\nSystem.out.println(total);',"55",["Accumulator","for loop"]),
 e("multiplication-table","Print a Multiplication Table",'int n = 5;\nfor (int i = 1; i <= 5; i++) System.out.println(n + " x " + i + " = " + n * i);',"5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25",["for loop","Multiplication"]),
 e("factorial-loop","Calculate Factorial Iteratively",'int number = 5;\nlong result = 1;\nfor (int i = 2; i <= number; i++) result *= i;\nSystem.out.println(result);',"120",["Factorial","long"],{time:"O(n)"}),
 e("fibonacci-series","Generate a Fibonacci Series",'int first = 0, second = 1;\nfor (int i = 0; i < 8; i++) {\n    System.out.print(first + " ");\n    int next = first + second; first = second; second = next;\n}',"0 1 1 2 3 5 8 13",["Fibonacci","State update"]),
 e("prime-check","Check a Prime Number",'int number = 29;\nboolean prime = number > 1;\nfor (int divisor = 2; divisor * divisor <= number; divisor++)\n    if (number % divisor == 0) { prime = false; break; }\nSystem.out.println(prime);',"true",["Prime test","Square-root bound"],{time:"O(√n)"}),
 e("reverse-integer","Reverse an Integer",'int number = 1234, reversed = 0;\nwhile (number != 0) { reversed = reversed * 10 + number % 10; number /= 10; }\nSystem.out.println(reversed);',"4321",["Digit extraction","while loop"]),
 e("palindrome-number","Check a Palindrome Number",'int number = 1221, copy = number, reversed = 0;\nwhile (copy != 0) { reversed = reversed * 10 + copy % 10; copy /= 10; }\nSystem.out.println(number == reversed);',"true",["Palindrome","Digit reversal"]),
 e("armstrong-number","Check an Armstrong Number",'int number = 153, copy = number, sum = 0;\nwhile (copy != 0) { int digit = copy % 10; sum += digit * digit * digit; copy /= 10; }\nSystem.out.println(sum == number);',"true",["Armstrong number","Digits"]),
 e("gcd-euclid","Find GCD with Euclid's Algorithm",'int a = 48, b = 18;\nwhile (b != 0) { int remainder = a % b; a = b; b = remainder; }\nSystem.out.println(a);',"6",["Euclid algorithm","Remainder"]),
 e("lcm","Find the LCM",'int a = 12, b = 18, x = a, y = b;\nwhile (y != 0) { int r = x % y; x = y; y = r; }\nSystem.out.println(Math.abs(a * b) / x);',"36",["LCM","GCD"]),
 e("break-continue","Use break and continue",'for (int i = 1; i <= 10; i++) {\n    if (i == 3) continue;\n    if (i == 7) break;\n    System.out.print(i + " ");\n}',"1 2 4 5 6",["break","continue"]),
 e("nested-coordinate-pairs","Generate Coordinate Pairs",'for (int row = 0; row < 2; row++)\n    for (int column = 0; column < 3; column++)\n        System.out.print("(" + row + "," + column + ") ");',"(0,0) (0,1) (0,2) (1,0) (1,1) (1,2)",["Nested loops","Coordinates"],{time:"O(n²)"})
];
