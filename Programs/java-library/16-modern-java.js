"use strict";
const { clean, makeJava }=require("./helpers");
const T="Level 16 — Lambdas, Streams & Modern Java";
const e=(slug,title,source,out,concepts,extra={})=>makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:clean(source),sampleOutput:out,concepts,difficulty:"Advanced",...extra});
module.exports=[
 e("lambda-expression","Use a Lambda Expression",`interface Operation{int apply(int a,int b);}\nclass Main{public static void main(String[] args){Operation multiply=(a,b)->a*b;System.out.println(multiply.apply(6,7));}}`,"42",["Lambda","Functional interface"]),
 e("method-reference","Use a Method Reference",`import java.util.*;\nclass Main{public static void main(String[] args){List<String> courses=List.of("Java","Python");courses.forEach(System.out::println);}}`,"Java\nPython",["Method reference","forEach()"]),
 e("stream-filter-map","Filter and Map a Stream",`import java.util.*;\nclass Main{public static void main(String[] args){List<Integer> result=List.of(1,2,3,4,5,6).stream().filter(n->n%2==0).map(n->n*n).toList();System.out.println(result);}}`,"[4, 16, 36]",["filter()","map()"]),
 e("stream-reduce","Reduce a Stream",`import java.util.stream.*;\nclass Main{public static void main(String[] args){int sum=IntStream.rangeClosed(1,10).reduce(0,Integer::sum);System.out.println(sum);}}`,"55",["reduce()","IntStream"]),
 e("stream-grouping","Group Values with Collectors",`import java.util.*;import java.util.stream.*;\nclass Main{public static void main(String[] args){Map<Integer,List<String>> groups=List.of("C","Java","Python","SQL").stream().collect(Collectors.groupingBy(String::length,TreeMap::new,Collectors.toList()));System.out.println(groups);}}`,"{1=[C], 3=[SQL], 4=[Java], 6=[Python]}",["groupingBy()","Collector"]),
 e("optional-value","Handle an Optional Value",`import java.util.*;\nclass Main{public static void main(String[] args){Optional<String> course=Optional.of("Java");System.out.println(course.map(String::toUpperCase).orElse("NONE"));}}`,"JAVA",["Optional","map()"]),
 e("date-time-api","Use the Date and Time API",`import java.time.*;\nclass Main{public static void main(String[] args){LocalDate start=LocalDate.of(2026,9,15);System.out.println(start.plusDays(10));}}`,"2026-09-25",["LocalDate","Immutability"]),
 e("text-block","Create a Text Block",`class Main{public static void main(String[] args){String json="""\n        {"course":"Java"}\n        """;System.out.print(json.trim());}}`,"{\"course\":\"Java\"}",["Text block","String"]),
 e("pattern-instanceof","Use Pattern Matching with instanceof",`class Main{static String describe(Object value){if(value instanceof Integer number)return "Integer "+number;if(value instanceof String text)return "String "+text;return "Other";}public static void main(String[] args){System.out.println(describe(42));System.out.println(describe("Java"));}}`,"Integer 42\nString Java",["Pattern variable","instanceof"]),
 e("parallel-stream","Use a Parallel Stream Safely",`import java.util.stream.*;\nclass Main{public static void main(String[] args){int sum=IntStream.rangeClosed(1,100).parallel().sum();System.out.println(sum);}}`,"5050",["parallel()","Associative reduction"])
];
