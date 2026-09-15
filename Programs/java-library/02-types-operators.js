"use strict";
const { main, makeJava } = require("./helpers");
const make = (topic) => (slug,title,body,out,concepts,extra={}) => makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic,source:main(body,extra.imports||""),sampleOutput:out,concepts,...extra});
const t = make("Level 02 — Variables, Data Types & Casting");
const o = make("Level 03 — Operators & Decision Making");
module.exports = [
 t("primitive-types","Display Primitive Values",'byte age = 18;\nshort year = 2026;\nint score = 95;\nlong population = 8000000000L;\nfloat rate = 2.5F;\ndouble pi = 3.14159;\nboolean ready = true;\nchar grade = \'A\';\nSystem.out.println(age + " " + year + " " + score + " " + population);\nSystem.out.println(rate + " " + pi + " " + ready + " " + grade);',"18 2026 95 8000000000\n2.5 3.14159 true A",["Primitive types","Literals"]),
 t("variable-update","Declare and Update a Variable",'int score = 70;\nscore += 5;\nSystem.out.println(score);',"75",["Variables","Compound assignment"]),
 t("constant-final","Create a Constant with final",'final double PI = 3.14159;\ndouble radius = 2;\nSystem.out.printf("%.2f%n", PI * radius * radius);',"12.57",["final","Constant"]),
 t("widening-cast","Perform Widening Conversion",'int count = 25;\ndouble value = count;\nSystem.out.println(value);',"25.0",["Widening conversion","double"]),
 t("narrowing-cast","Perform Narrowing Conversion",'double value = 19.85;\nint whole = (int) value;\nSystem.out.println(whole);',"19",["Explicit cast","Truncation"]),
 t("char-code","Convert Between char and int",'char letter = \'A\';\nint code = letter;\nchar next = (char) (code + 1);\nSystem.out.println(code + " " + next);',"65 B",["char","Unicode value"]),
 t("parse-string-number","Parse a Numeric String",'String text = "42";\nint number = Integer.parseInt(text);\nSystem.out.println(number + 8);',"50",["Integer.parseInt()","String conversion"]),
 t("wrapper-autoboxing","Demonstrate Autoboxing and Unboxing",'Integer boxed = 25;\nint primitive = boxed;\nSystem.out.println(boxed.getClass().getSimpleName() + " " + primitive);',"Integer 25",["Wrapper class","Autoboxing"]),
 t("var-local-inference","Use Local Variable Type Inference",'var course = "Java";\nvar version = 17;\nSystem.out.println(course + " " + version);',"Java 17",["var","Local inference"]),
 t("numeric-overflow","Observe Integer Overflow",'int largest = Integer.MAX_VALUE;\nSystem.out.println(largest);\nSystem.out.println(largest + 1);',"2147483647\n-2147483648",["Integer range","Overflow"]),
 o("arithmetic-operators","Use Arithmetic Operators",'int a = 17, b = 5;\nSystem.out.println((a + b) + " " + (a - b) + " " + (a * b));\nSystem.out.println((a / b) + " " + (a % b));',"22 12 85\n3 2",["Arithmetic","Integer division"]),
 o("relational-logical","Use Relational and Logical Operators",'int age = 20;\nboolean hasId = true;\nSystem.out.println(age >= 18 && hasId);\nSystem.out.println(age < 18 || !hasId);',"true\nfalse",["Relational operators","Logical operators"]),
 o("bitwise-operators","Use Bitwise Operators",'int a = 6, b = 3;\nSystem.out.println((a & b) + " " + (a | b) + " " + (a ^ b));\nSystem.out.println(a << 1);',"2 7 5\n12",["Bitwise operators","Shift"]),
 o("operator-precedence","Demonstrate Operator Precedence",'System.out.println(2 + 3 * 4);\nSystem.out.println((2 + 3) * 4);',"14\n20",["Precedence","Parentheses"]),
 o("ternary-operator","Choose a Value with the Ternary Operator",'int mark = 74;\nString result = mark >= 40 ? "Pass" : "Fail";\nSystem.out.println(result);',"Pass",["Ternary operator","Condition"]),
 o("positive-negative-zero","Classify a Number",'int number = -7;\nif (number > 0) System.out.println("Positive");\nelse if (number < 0) System.out.println("Negative");\nelse System.out.println("Zero");',"Negative",["if-else","Comparison"]),
 o("largest-three","Find the Largest of Three Numbers",'int a = 12, b = 27, c = 19;\nint largest = Math.max(a, Math.max(b, c));\nSystem.out.println(largest);',"27",["Math.max()","Nested call"]),
 o("leap-year","Check a Leap Year",'int year = 2024;\nboolean leap = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);\nSystem.out.println(leap);',"true",["Logical expression","Leap-year rule"]),
 o("grade-calculator","Calculate a Grade",'int mark = 84;\nchar grade;\nif (mark >= 90) grade = \'A\';\nelse if (mark >= 75) grade = \'B\';\nelse if (mark >= 60) grade = \'C\';\nelse grade = \'D\';\nSystem.out.println(grade);',"B",["else-if ladder","Range classification"]),
 o("switch-expression","Use a Switch Expression",'int day = 2;\nString name = switch (day) {\n    case 1 -> "Monday";\n    case 2 -> "Tuesday";\n    default -> "Unknown";\n};\nSystem.out.println(name);',"Tuesday",["switch expression","Arrow labels"],{difficulty:"Intermediate"})
];
